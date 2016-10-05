var Pixelmapper = require('./pixelmapper.js');

// Create a 3x3 zigzag mapping
var map = new Pixelmapper()
.zigzag(0, 0, 3, 3, false);

// Convert mapping to compact JSON format that can be used
// to initialize a the mapping somewhere else
console.log(new Pixelmapper(map.toJSON())._mapping);