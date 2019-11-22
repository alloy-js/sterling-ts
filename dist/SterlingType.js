"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SterlingSet_1 = require("./SterlingSet");
class SterlingType {
    constructor(data, parent) {
        this._data = new SterlingSet_1.SterlingSet(data.map(item => [item]));
        this._children = [];
        if (parent)
            parent._children.push(this);
    }
    includes(atom, strict) {
        if (strict)
            return this._data.includes([atom]);
        let type = this, current, next = [type], children, i, n;
        do {
            current = next.reverse();
            next = [];
            while (!!(type = current.pop())) {
                if (type._data.includes([atom]))
                    return true;
                children = type._children;
                for (i = 0, n = children.length; i < n; ++i)
                    next.push(children[i]);
            }
        } while (next.length);
        return false;
    }
}
exports.SterlingType = SterlingType;
