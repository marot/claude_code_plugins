import { MaestroCli } from '../lib/maestro-cli.js';
import { loadConfig } from '../lib/config.js';

export interface GetElementsOptions {
  json?: boolean;
  attributes?: string[];
}

export interface ElementInfo {
  text?: string;
  'resource-id'?: string;
  'content-desc'?: string;
  accessibilityText?: string;
  [key: string]: string | undefined;
}

interface HierarchyNode {
  attributes: Record<string, string>;
  children: HierarchyNode[];
}

/**
 * Recursively extract non-empty attribute values from hierarchy
 */
function extractElements(
  node: HierarchyNode,
  attributes: string[],
  elements: ElementInfo[] = []
): ElementInfo[] {
  const element: ElementInfo = {};
  let hasContent = false;

  // Extract specified attributes if they're non-empty
  for (const attr of attributes) {
    const value = node.attributes[attr];
    if (value && value.trim() !== '') {
      element[attr] = value;
      hasContent = true;
    }
  }

  // Only add element if it has at least one non-empty attribute
  if (hasContent) {
    elements.push(element);
  }

  // Recursively process children
  for (const child of node.children) {
    extractElements(child, attributes, elements);
  }

  return elements;
}

/**
 * Get all non-empty text, resource-id, content-desc, and accessibilityText values from device hierarchy
 */
export async function getElements(
  options: GetElementsOptions = {}
): Promise<void> {
  const config = loadConfig();
  const cli = new MaestroCli(config);

  const hierarchy = await cli.getHierarchy();

  // Parse hierarchy
  const parsed: HierarchyNode = JSON.parse(hierarchy);

  // Determine which attributes to extract
  const attributes = options.attributes || [
    'text',
    'resource-id',
    'content-desc',
    'accessibilityText',
  ];

  // Extract elements
  const elements = extractElements(parsed, attributes);

  // Format and output
  const formatted = JSON.stringify(elements, null, options.json ? 2 : 0);
  console.log(formatted);
}
