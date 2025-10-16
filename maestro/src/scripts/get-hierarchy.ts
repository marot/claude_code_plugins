import { MaestroCli } from '../lib/maestro-cli.js';
import { loadConfig } from '../lib/config.js';

export interface GetHierarchyOptions {
  json?: boolean;
  query?: string;
  searchIn?: string[];
  parentLevels?: number;
}

export interface HierarchyNode {
  attributes: Record<string, string>;
  children: HierarchyNode[];
}

export interface SearchResult {
  node: HierarchyNode;
  path: HierarchyNode[];
}

/**
 * Build a map of child nodes to their parent nodes for efficient traversal
 */
export function buildParentMap(
  node: HierarchyNode,
  parentMap: Map<HierarchyNode, HierarchyNode> = new Map(),
  parent?: HierarchyNode
): Map<HierarchyNode, HierarchyNode> {
  if (parent) {
    parentMap.set(node, parent);
  }

  for (const child of node.children) {
    buildParentMap(child, parentMap, node);
  }

  return parentMap;
}

/**
 * Recursively search hierarchy for nodes matching the regex pattern
 */
export function searchHierarchy(
  node: HierarchyNode,
  pattern: RegExp,
  searchIn: string[],
  parentMap: Map<HierarchyNode, HierarchyNode>,
  path: HierarchyNode[] = []
): SearchResult[] {
  const results: SearchResult[] = [];
  const currentPath = [...path, node];

  // Check if current node matches
  let matches = false;
  for (const attr of searchIn) {
    const value = node.attributes[attr];
    if (value && pattern.test(value)) {
      matches = true;
      break;
    }
  }

  if (matches) {
    results.push({ node, path: currentPath });
  }

  // Recursively search children
  for (const child of node.children) {
    results.push(...searchHierarchy(child, pattern, searchIn, parentMap, currentPath));
  }

  return results;
}

/**
 * Find parent node N levels up from the given node
 */
export function findParent(
  node: HierarchyNode,
  levels: number,
  parentMap: Map<HierarchyNode, HierarchyNode>
): HierarchyNode {
  let current = node;
  let levelsTraversed = 0;

  while (levelsTraversed < levels) {
    const parent = parentMap.get(current);
    if (!parent) {
      // Reached root, can't go further
      return current;
    }
    current = parent;
    levelsTraversed++;
  }

  return current;
}

/**
 * Extract a complete subtree starting from the given node
 */
export function extractSubtree(node: HierarchyNode): HierarchyNode {
  // Return a deep copy to avoid mutations
  return JSON.parse(JSON.stringify(node));
}

/**
 * Check if nodeA is contained within nodeB's subtree
 */
function isContainedIn(
  nodeA: HierarchyNode,
  nodeB: HierarchyNode
): boolean {
  if (nodeA === nodeB) {
    return true;
  }

  for (const child of nodeB.children) {
    if (isContainedIn(nodeA, child)) {
      return true;
    }
  }

  return false;
}

/**
 * Remove overlapping subtrees, keeping only the largest ones
 */
export function deduplicateSubtrees(
  subtrees: HierarchyNode[]
): HierarchyNode[] {
  if (subtrees.length <= 1) {
    return subtrees;
  }

  const deduplicated: HierarchyNode[] = [];

  for (const candidate of subtrees) {
    let shouldAdd = true;

    // Check if candidate is contained in any existing deduplicated tree
    for (const existing of deduplicated) {
      if (isContainedIn(candidate, existing)) {
        shouldAdd = false;
        break;
      }
    }

    if (shouldAdd) {
      // Remove any existing trees that are contained in the candidate
      const filtered = deduplicated.filter(
        existing => !isContainedIn(existing, candidate)
      );
      filtered.push(candidate);
      deduplicated.length = 0;
      deduplicated.push(...filtered);
    }
  }

  return deduplicated;
}

/**
 * Get device screen hierarchy and output as JSON
 */
export async function getHierarchy(
  options: GetHierarchyOptions = {}
): Promise<void> {
  const config = loadConfig();
  const cli = new MaestroCli(config);

  const hierarchy = await cli.getHierarchy();

  // Parse hierarchy
  const parsed: HierarchyNode = JSON.parse(hierarchy);

  let result: HierarchyNode | HierarchyNode[];

  // Apply filtering if query is provided
  if (options.query) {
    const {
      query,
      searchIn = ['text', 'resource-id', 'content-desc'],
      parentLevels = 0,
    } = options;

    // Compile regex pattern
    let pattern: RegExp;
    try {
      pattern = new RegExp(query);
    } catch (error) {
      throw new Error(
        `Invalid regex pattern: ${query}. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // Build parent map for efficient traversal
    const parentMap = buildParentMap(parsed);

    // Search for matching nodes
    const matches = searchHierarchy(parsed, pattern, searchIn, parentMap);

    if (matches.length === 0) {
      console.log(
        JSON.stringify(
          { message: 'No matches found', query, searchIn },
          null,
          options.json ? 2 : 0
        )
      );
      return;
    }

    // Find parent nodes at specified level
    const parentNodes = matches.map((match) =>
      findParent(match.node, parentLevels, parentMap)
    );

    // Extract subtrees
    const subtrees = parentNodes.map((node) => extractSubtree(node));

    // Deduplicate overlapping subtrees
    const deduplicated = deduplicateSubtrees(subtrees);

    // If single result, return as object; otherwise return as array
    result = deduplicated.length === 1 ? deduplicated[0] : deduplicated;
  } else {
    // No filtering, return full hierarchy
    result = parsed;
  }

  // Format and output
  const formatted = JSON.stringify(result, null, options.json ? 2 : 0);
  console.log(formatted);
}
