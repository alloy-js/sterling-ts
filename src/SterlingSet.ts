export class SterlingSet {

    private readonly _data: any[][];

    constructor (data: any[][]) {

        if (!equalArrayLengths(data))
            throw Error('All tuples must have the same arity');
        this._data = data;

    }

    arity (): number {

        return this._data.length ? this._data[0].length : 0;

    }

    box (target: any): SterlingSet {

        if (target instanceof SterlingSet)
            return new SterlingSet(join(target._data, this._data));

        if (Array.isArray(target)) {

            if (target.length === 0)
                return new SterlingSet([]);

            if (Array.isArray(target[0])) {
                if (!equalArrayLengths(target))
                    throw Error('All tuples must have the same arity');
                return new SterlingSet(join(target, this._data));
            }

            return new SterlingSet(join([target], this._data));

        }

        return new SterlingSet(join([[target]], this._data));

    }

    data (): any[][] {

        return this._data;

    }

    dot (target: any): SterlingSet {

        if (target instanceof SterlingSet)
            return new SterlingSet(join(this._data, target._data));

        if (Array.isArray(target)) {

            if (target.length === 0)
                return new SterlingSet([]);

            if (Array.isArray(target[0])) {
                if (!equalArrayLengths(target))
                    throw Error('All tuples must have the same arity');
                return new SterlingSet(join(this._data, target));
            }

            return new SterlingSet(join(this._data, [target]));

        }

        return new SterlingSet(join(this._data, [[target]]));

    }

    includes (tuple: any[]): boolean {

        let dataLength = this._data.length;
        let index = -1;
        while (++index < dataLength) {
            if (equalArrays(this._data[index], tuple))
                return true;
        }
        return false;

    }

    size (): number {

        return this._data.length;

    }

    transpose (): SterlingSet {

        return new SterlingSet(this._data.map(tuple => tuple.slice().reverse()));

    }

}

function equalArrays (array: any[], other: any[]): boolean {

    const arrLength = array.length;
    const othLength = other.length;

    if (arrLength !== othLength)
        return false;

    let index = -1;
    while (++index < arrLength) {
        if (array[index] !== other[index])
            return false;
    }
    return true;

}

function equalArrayLengths (arrays: any[][]) {

    const length = arrays.length
        ? arrays[0].length
        : 0;

    for (let i=0, l=arrays.length; i<l; ++i)
        if (arrays[i].length !== length)
            return false;

    return true;

}

function join (left: any[][], right: any[][]): any[][] {

    const leftArity = left.length ? left[0].length : 0;
    const rightArity = right.length ? right[0].length : 0;

    if (leftArity === 0 || rightArity === 0) return [[]];

    const last = leftArity - 1;
    const leftLocs: Map<any, number[]> = new Map();
    const tupleTree: Map<any, any> = new Map();
    const tuples: any[][] = [];

    // For the left side, store the row indices for each rightmost atom
    left.forEach((tuple: any[], i: number) => {
        const atom = tuple[last];
        if (!leftLocs.has(atom)) leftLocs.set(atom, []);
        leftLocs.get(atom)!.push(i);
    });

    // Match first atoms on the right side and perform joins
    right.forEach((tuple: any[]) => {
        const atom = tuple[0];
        if (leftLocs.has(atom)) {
            leftLocs.get(atom)!.forEach(row => {
                const leftAtoms = left[row].slice(0, -1);
                const rightAtoms = tuple.slice(1);
                const newTuple = [...leftAtoms, ...rightAtoms];
                if (tupleTreeAdd(tupleTree, newTuple)) {
                    tuples.push(newTuple);
                }
            });
        }
    });

    return tuples;

}

/**
 * Add a tuple to a tuple tree if it doesn't already exist in the tree
 *
 * @remarks
 * A tuple tree is a tree, implemented using JavaScript Maps, that is used to
 * build a unique set of tuples. Beginning with an empty Map, add tuples
 * (ordered arrays of objects) to the Map using this function. If an equivalent
 * tuple has previously been added to the tree, the function will return false,
 * otherwise it will return true.
 *
 * @param tree The tuple tree
 * @param tuple The tuple to add to the tree
 * @returns true if the tuple was added to the tree, false if the tuple already
 * existed in the tree
 */
function tupleTreeAdd (tree: Map<any, any>, tuple: any[]): boolean {

    let atoms = tuple.slice().reverse(),
        map = tree,
        current,
        added = false;

    while ((current = atoms.pop()) !== undefined) {

        if (!map.has(current)) {
            map.set(current, new Map());
            added = true;
        }

        map = map.get(current) as Map<any, any>;

    }

    return added;

}
