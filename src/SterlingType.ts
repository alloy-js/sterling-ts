import { SterlingSet } from './SterlingSet';

export class SterlingType {

    private readonly _data: SterlingSet;
    private readonly _children: SterlingType[];

    constructor (data: any[], parent?: SterlingType) {

        this._data = new SterlingSet(data.map(item => [item]));
        this._children = [];

        if (parent) parent._children.push(this);

    }

    includes (atom: any, strict?: boolean): boolean {

        if (strict) return this._data.includes([atom]);

        let type: SterlingType | undefined = this,
            current: SterlingType[],
            next: SterlingType[] = [type],
            children: SterlingType[],
            i: number,
            n: number;

        do {
            current = next.reverse();
            next = [];
            while (!!(type = current.pop())) {
                if (type._data.includes([atom])) return true;
                children = type._children;
                for (i=0, n=children.length; i<n; ++i)
                    next.push(children[i]);
            }
        } while (next.length);

        return false;

    }

}
