var Pixelmapper = require('./pixelmapper.js');

var map = new Pixelmapper()
.zigzag(0, 0, 3, 3, false);

console.log(new Pixelmapper(map.toJSON())._mapping);