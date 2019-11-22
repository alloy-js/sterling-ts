export declare class SterlingSet {
    private readonly _data;
    constructor(data: any[][]);
    arity(): number;
    box(target: any): SterlingSet;
    data(): any[][];
    dot(target: any): SterlingSet;
    includes(tuple: any[]): boolean;
    size(): number;
    transpose(): SterlingSet;
}
