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
export declare function buildParentMap(node: HierarchyNode, parentMap?: Map<HierarchyNode, HierarchyNode>, parent?: HierarchyNode): Map<HierarchyNode, HierarchyNode>;
/**
 * Recursively search hierarchy for nodes matching the regex pattern
 */
export declare function searchHierarchy(node: HierarchyNode, pattern: RegExp, searchIn: string[], parentMap: Map<HierarchyNode, HierarchyNode>, path?: HierarchyNode[]): SearchResult[];
/**
 * Find parent node N levels up from the given node
 */
export declare function findParent(node: HierarchyNode, levels: number, parentMap: Map<HierarchyNode, HierarchyNode>): HierarchyNode;
/**
 * Extract a complete subtree starting from the given node
 */
export declare function extractSubtree(node: HierarchyNode): HierarchyNode;
/**
 * Remove overlapping subtrees, keeping only the largest ones
 */
export declare function deduplicateSubtrees(subtrees: HierarchyNode[]): HierarchyNode[];
/**
 * Get device screen hierarchy and output as JSON
 */
export declare function getHierarchy(options?: GetHierarchyOptions): Promise<void>;
//# sourceMappingURL=get-hierarchy.d.ts.map