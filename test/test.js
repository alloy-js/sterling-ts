const { SterlingType, SterlingSet } = require('../dist/Sterling');

let numbers = new SterlingType([0, 1, 2, 3]);
let morenumbers = new SterlingType([4, 5, 6, 7], numbers);
let indices = new SterlingSet([
    [0, 1],
    [0, 2]
]);

console.log(indices.box([
    [1, 0],
    [2, 0]
]));

console.log(indices);
console.log(indices.transpose());
