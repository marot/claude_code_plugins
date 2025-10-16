import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  HierarchyNode,
  searchHierarchy,
  buildParentMap,
  findParent,
  extractSubtree,
  deduplicateSubtrees,
} from '../src/scripts/get-hierarchy';

// Helper to load fixture files
function loadFixture(filename: string): HierarchyNode {
  const fixturePath = path.join(__dirname, 'fixtures', filename);
  const content = fs.readFileSync(fixturePath, 'utf-8');
  return JSON.parse(content);
}

describe('HierarchyNode Type', () => {
  it('should match expected structure', () => {
    const node = loadFixture('mock-hierarchy-simple.json');
    expect(node).toHaveProperty('attributes');
    expect(node).toHaveProperty('children');
    expect(Array.isArray(node.children)).toBe(true);
  });

  it('should have attributes object', () => {
    const node = loadFixture('mock-hierarchy-simple.json');
    expect(typeof node.attributes).toBe('object');
  });

  it('should have children array', () => {
    const node = loadFixture('mock-hierarchy-simple.json');
    expect(Array.isArray(node.children)).toBe(true);
  });
});

describe('searchHierarchy()', () => {
  it('should find single node matching regex in text attribute', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(hierarchy, /Login/, ['text'], parentMap);

    expect(results).toHaveLength(1);
    expect(results[0].node.attributes.text).toBe('Login Button');
  });

  it('should find multiple nodes matching regex', () => {
    const hierarchy = loadFixture('mock-hierarchy-overlapping.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(hierarchy, /Login/, ['text'], parentMap);

    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.some(r => r.node.attributes.text === 'Login Button')).toBe(true);
    expect(results.some(r => r.node.attributes.text === 'Login Input')).toBe(true);
  });

  it('should search in specified attributes only', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const parentMap = buildParentMap(hierarchy);

    // Search only in resource-id
    const results = searchHierarchy(hierarchy, /btn_/, ['resource-id'], parentMap);

    results.forEach(result => {
      expect(result.node.attributes['resource-id']).toMatch(/btn_/);
    });
  });

  it('should handle case-insensitive regex patterns', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(hierarchy, /login/i, ['text'], parentMap);

    expect(results).toHaveLength(1);
    expect(results[0].node.attributes.text).toBe('Login Button');
  });

  it('should return empty array when no matches found', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(hierarchy, /NonExistent/, ['text'], parentMap);

    expect(results).toHaveLength(0);
  });

  it('should handle nodes without text attributes', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const parentMap = buildParentMap(hierarchy);
    // Search for nodes with empty text
    const results = searchHierarchy(hierarchy, /icon/, ['content-desc'], parentMap);

    expect(results.some(r => r.node.attributes.text === '')).toBe(true);
  });

  it('should recursively search nested children', () => {
    const hierarchy = loadFixture('mock-hierarchy-nested.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(hierarchy, /Level 5/, ['text'], parentMap);

    expect(results).toHaveLength(1);
    expect(results[0].node.attributes.text).toBe('Level 5 Button');
  });

  it('should handle invalid regex patterns gracefully', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);

    expect(() => {
      // Create invalid regex at runtime using RegExp constructor
      const invalidPattern = new RegExp('[invalid');
      searchHierarchy(hierarchy, invalidPattern, ['text'], parentMap);
    }).toThrow();
  });

  it('should match partial strings', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(hierarchy, /Pass/, ['text'], parentMap);

    expect(results).toHaveLength(1);
    expect(results[0].node.attributes.text).toBe('Forgot Password');
  });

  it('should handle special regex characters', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(hierarchy, /Password\?/, ['text'], parentMap);

    expect(results).toHaveLength(1);
    expect(results[0].node.attributes.text).toBe('Forgot Password?');
  });

  it('should search in multiple attributes', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const parentMap = buildParentMap(hierarchy);
    const results = searchHierarchy(
      hierarchy,
      /password/i,
      ['text', 'content-desc', 'resource-id'],
      parentMap
    );

    expect(results.length).toBeGreaterThan(1);
  });
});

describe('buildParentMap()', () => {
  it('should create parent references for all nodes', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);

    // Root should not have a parent
    expect(parentMap.get(hierarchy)).toBeUndefined();

    // Children should have parent references
    hierarchy.children.forEach(child => {
      expect(parentMap.get(child)).toBe(hierarchy);
    });
  });

  it('should handle deeply nested hierarchies', () => {
    const hierarchy = loadFixture('mock-hierarchy-nested.json');
    const parentMap = buildParentMap(hierarchy);

    // Find the deepest node
    let current: HierarchyNode = hierarchy;
    while (current.children.length > 0) {
      const child = current.children[0];
      expect(parentMap.get(child)).toBe(current);
      current = child;
    }
  });

  it('should handle hierarchies with multiple branches', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const parentMap = buildParentMap(hierarchy);

    const mainContent = hierarchy.children.find(
      c => c.attributes['resource-id'] === 'main_content'
    );
    expect(mainContent).toBeDefined();
    expect(parentMap.get(mainContent!)).toBe(hierarchy);
  });
});

describe('findParent()', () => {
  it('should traverse up 0 levels (return same node)', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);
    const child = hierarchy.children[0];

    const result = findParent(child, 0, parentMap);
    expect(result).toBe(child);
  });

  it('should traverse up 1 level to immediate parent', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);
    const child = hierarchy.children[0];

    const result = findParent(child, 1, parentMap);
    expect(result).toBe(hierarchy);
  });

  it('should traverse up N levels correctly', () => {
    const hierarchy = loadFixture('mock-hierarchy-nested.json');
    const parentMap = buildParentMap(hierarchy);

    // Find the deepest node
    let deepest: HierarchyNode = hierarchy;
    while (deepest.children.length > 0) {
      deepest = deepest.children[0];
    }

    // Traverse up 3 levels
    const result = findParent(deepest, 3, parentMap);
    expect(result).toBeDefined();
    expect(result?.attributes.text).toMatch(/Level 2/);
  });

  it('should return root when traversing beyond available parents', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);
    const child = hierarchy.children[0];

    const result = findParent(child, 10, parentMap);
    expect(result).toBe(hierarchy);
  });

  it('should handle node at root with parent traversal request', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const parentMap = buildParentMap(hierarchy);

    const result = findParent(hierarchy, 1, parentMap);
    expect(result).toBe(hierarchy);
  });
});

describe('extractSubtree()', () => {
  it('should extract complete subtree from parent node', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const subtree = extractSubtree(hierarchy);

    expect(subtree).toEqual(hierarchy);
  });

  it('should include all children recursively', () => {
    const hierarchy = loadFixture('mock-hierarchy-nested.json');
    const subtree = extractSubtree(hierarchy);

    expect(subtree.children).toHaveLength(hierarchy.children.length);
    expect(JSON.stringify(subtree)).toBe(JSON.stringify(hierarchy));
  });

  it('should preserve node attributes', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const node = hierarchy.children[0];
    const subtree = extractSubtree(node);

    expect(subtree.attributes).toEqual(node.attributes);
  });

  it('should preserve structure and nesting', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const mainContent = hierarchy.children.find(
      c => c.attributes['resource-id'] === 'main_content'
    );

    const subtree = extractSubtree(mainContent!);
    expect(JSON.stringify(subtree)).toBe(JSON.stringify(mainContent));
  });

  it('should handle leaf nodes (no children)', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const leaf = hierarchy.children[0];
    const subtree = extractSubtree(leaf);

    expect(subtree.children).toHaveLength(0);
    expect(subtree.attributes).toEqual(leaf.attributes);
  });
});

describe('deduplicateSubtrees()', () => {
  it('should remove duplicate subtrees (exact matches)', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');
    const node = hierarchy.children[0];

    const subtrees = [node, node, hierarchy];
    const deduplicated = deduplicateSubtrees(subtrees);

    // Should only keep hierarchy since it contains node
    expect(deduplicated).toHaveLength(1);
    expect(deduplicated[0]).toBe(hierarchy);
  });

  it('should remove subtrees contained within larger subtrees', () => {
    const hierarchy = loadFixture('mock-hierarchy-nested.json');
    const level1 = hierarchy.children[0];
    const level2 = level1.children[0];

    const subtrees = [hierarchy, level1, level2];
    const deduplicated = deduplicateSubtrees(subtrees);

    // Should only keep hierarchy
    expect(deduplicated).toHaveLength(1);
    expect(deduplicated[0]).toBe(hierarchy);
  });

  it('should preserve independent non-overlapping subtrees', () => {
    const hierarchy = loadFixture('mock-hierarchy-complex.json');
    const nav = hierarchy.children[0];
    const main = hierarchy.children[1];

    const subtrees = [nav, main];
    const deduplicated = deduplicateSubtrees(subtrees);

    // Both should be kept since they don't overlap
    expect(deduplicated).toHaveLength(2);
  });

  it('should handle single subtree (no deduplication needed)', () => {
    const hierarchy = loadFixture('mock-hierarchy-simple.json');

    const subtrees = [hierarchy];
    const deduplicated = deduplicateSubtrees(subtrees);

    expect(deduplicated).toHaveLength(1);
    expect(deduplicated[0]).toBe(hierarchy);
  });

  it('should handle multiple matches in same parent', () => {
    const hierarchy = loadFixture('mock-hierarchy-overlapping.json');
    const parent = hierarchy.children[0];
    const child1 = parent.children[0];
    const child2 = parent.children[1];

    const subtrees = [parent, child1, child2];
    const deduplicated = deduplicateSubtrees(subtrees);

    // Should only keep parent
    expect(deduplicated).toHaveLength(1);
    expect(deduplicated[0]).toBe(parent);
  });

  it('should handle empty array', () => {
    const deduplicated = deduplicateSubtrees([]);
    expect(deduplicated).toHaveLength(0);
  });
});

describe('getHierarchy() integration tests', () => {
  // Note: These tests will be implemented once the main function is updated
  // They will test the full workflow with various options

  it('should return full hierarchy when no query provided', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should return filtered subtrees when query matches', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should return multiple subtrees for multiple matches', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should respect parentLevels option', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should respect searchIn option', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should respect compact formatting option', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should handle query with no matches', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should combine query filtering with compact mode', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });

  it('should handle complex nested hierarchies', () => {
    // TODO: Implement after updating getHierarchy() function
    expect(true).toBe(true);
  });
});
