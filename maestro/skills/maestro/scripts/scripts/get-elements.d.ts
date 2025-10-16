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
/**
 * Get all non-empty text, resource-id, content-desc, and accessibilityText values from device hierarchy
 */
export declare function getElements(options?: GetElementsOptions): Promise<void>;
//# sourceMappingURL=get-elements.d.ts.map