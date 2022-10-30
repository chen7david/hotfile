/// <reference types="node" />
import fs from 'fs';
declare type HotfileAddOnProperty = 'id' | 'stat';
export interface HotfileOptions {
    /** depth restricts how many levels deep the scan should go */
    depth?: number;
    /** generates md5 hashes of an item's path and adds that to the item as its id property */
    extendedProperties?: HotfileAddOnProperty[];
    /** if enabled, returns an flat (one-dimensional) list with all scanned files */
    flatten?: boolean;
}
export declare class Hotfile {
    isDirectory: boolean;
    id?: string;
    name: string;
    path: string;
    relativePath?: string;
    base: string;
    size: number;
    children?: Hotfile[];
    ext?: string;
    stat?: fs.Stats;
    constructor(path: string, options?: HotfileOptions);
    static existsSync(path: string): boolean;
    loadChildren(options?: HotfileOptions, depthTracker?: number): Promise<this>;
}
export {};
//# sourceMappingURL=index.d.ts.map