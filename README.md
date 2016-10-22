## Documentation

### Creating a mapping from components
add - Adds a single pixel
line - Adds a line of pixels
zigzag - Adds a zigzag pattern rectangle of pixels
fillEmpty - Adds a number of pixels without corresponding coordinate

Example:
```javascript
// Create a 3x3 zigzag mapping
var mapping = new Pixelmapper()
.zigzag(0, 0, 3, 3, false);
```

### Functions to do something with the created mapping
getPixel - Get the pixel at a coordinate
getCoordinate - Get the coordinate of a pixel

### Object functions
toJSON - Creates a JSON string that can be used to re-create the mapping using `fromJSON`
fromJSON - Used to create a mapping from a JSON string created with `toSJON`
Instead of using `fromJSON` you can also use the constructor:

### Using the JSON conversion functions
The object can be converted and created to JSON:

Example:
```javascript
// Create a 3x3 zigzag mapping
var mapping = new Pixelmapper()
.zigzag(0, 0, 3, 3, false);

// Convert object to JSON string
var json = mapping.toJSON();

// Create new mapping object from JSON string
var mapping2 = new Pixelmapper(json);

// Or:
var mapping3 = new Pixelmapper().fromJSON(json);
```

For the exact arguments of the functions themselves take a look at the comments in `pixelmapper.js`.