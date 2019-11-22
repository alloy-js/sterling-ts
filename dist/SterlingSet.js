"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SterlingSet {
    constructor(data) {
        if (!equalArrayLengths(data))
            throw Error('All tuples must have the same arity');
        this._data = data;
    }
    arity() {
        return this._data.length ? this._data[0].length : 0;
    }
    box(target) {
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
    data() {
        return this._data;
    }
    dot(target) {
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
    includes(tuple) {
        let dataLength = this._data.length;
        let index = -1;
        while (++index < dataLength) {
            if (equalArrays(this._data[index], tuple))
                return true;
        }
        return false;
    }
    size() {
        return this._data.length;
    }
    transpose() {
        return new SterlingSet(this._data.map(tuple => tuple.slice().reverse()));
    }
}
exports.SterlingSet = SterlingSet;
function equalArrays(array, other) {
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
function equalArrayLengths(arrays) {
    const length = arrays.length
        ? arrays[0].length
        : 0;
    for (let i = 0, l = arrays.length; i < l; ++i)
        if (arrays[i].length !== length)
            return false;
    return true;
}
function join(left, right) {
    const leftArity = left.length ? left[0].length : 0;
    const rightArity = right.length ? right[0].length : 0;
    if (leftArity === 0 || rightArity === 0)
        return [[]];
    const last = leftArity - 1;
    const leftLocs = new Map();
    const tupleTree = new Map();
    const tuples = [];
    // For the left side, store the row indices for each rightmost atom
    left.forEach((tuple, i) => {
        const atom = tuple[last];
        if (!leftLocs.has(atom))
            leftLocs.set(atom, []);
        leftLocs.get(atom).push(i);
    });
    // Match first atoms on the right side and perform joins
    right.forEach((tuple) => {
        const atom = tuple[0];
        if (leftLocs.has(atom)) {
            leftLocs.get(atom).forEach(row => {
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
function tupleTreeAdd(tree, tuple) {
    let atoms = tuple.slice().reverse(), map = tree, current, added = false;
    while ((current = atoms.pop()) !== undefined) {
        if (!map.has(current)) {
            map.set(current, new Map());
            added = true;
        }
        map = map.get(current);
    }
    return added;
}
