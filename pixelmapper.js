(function(module) {
  "use strict";
  /**
   * Pixelmapper class
   * Maps 2 dimensional coordinates to a 1 dimensional array of entities
   * Can be used to map image data taken from a HTML5 Canvas to LED strips
   * @module pixelmapper
   */

  /**
   * Pixelmapper class
   * Maps 2 dimensional coordinates to a 1 dimensional array of entities
   * @constructor
   * @param {array} components - Array of components
   * @param {string} components - Output of Pixelmapper.toJSON()
   */
  class Pixelmapper {
    constructor(components) {
      // The pixels mapped to coordinates
      this._mapping = [];

      // The components that were used to create the mapping, 
      this._components = [];

      if(typeof components == 'string') {
        this.fromJSON(components);
      } else if(components instanceof Array) {
        this._init(components);
      }

      return this;
    }


    /**
     * Creates mapping from components and saves them in ._components
     * @param {array} components - Array of components
     */
    _init(components) {
      components.forEach(function(component) {
        this[component.name].apply(this, component.arguments);
      }, this);
      
      this._components = components;

      return this;
    }

    /**
     * Maps a pixel to a coordinate, saving into this._mapping
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    add(x, y) {
      if(this._exists(x, y))
        throw new Error('Double pixel assignment at [' + x + ', ' + y + ']');

      this._mapping.push([x, y]);

      return this;
    }

    /**
     * Adds a number of pixels without an assigned coordinate
     * Useful for OctoWS12811
     * @param {number} amount - Amount of pixels
     */
    fillEmpty(amount) {
      for(var i = 0; i < amount; i++) this._mapping.push(null);
    }

    /**
     * Adds a line of pixels
     * @param {number} x1 - X start coordinate
     * @param {number} x1 - Y start coordinate
     * @param {number} dx - Width
     * @param {number} dy - Height
     */
    line(x1, y1, dx, dy) {
      this._line(x1, y1, dx, dy);
      
      this._components.push({
        name: 'line',
        arguments: [x1, y1, dx, dy]
      });

      return this;
    }

    /**
     * Adds a rectangle with zigzag pattern of pixels
     * @param {number} x1 - X start coordinate
     * @param {number} x1 - Y start coordinate
     * @param {number} dx - Width, can be negative
     * @param {number} dy - Height, can be negative
     * @param {boolean} direction - true for horizontal, false for vertical
     */
    zigzag(x1, y1, dx, dy, direction) {
      var xl = Math.abs(dx);
      var yl = Math.abs(dy);

      for(var line = 0; line < (direction?yl:xl); line++) {
        if(direction) { // Horizontal lines
          this._line(x1+(line%2?(dx>0?dx-1:dx+1):0), y1+(dy>0?line:-line), line%2?-dx:dx, 0);
        } else { // Vertical lines
          this._line(x1+(dx>0?line:-line), y1+(line%2?(dy>0?dy-1:dy+1):0), 0, line%2?-dy:dy);
        }
      }

      this._components.push({
        name: 'zigzag',
        arguments: [x1, y1, dx, dy, direction]
      });

      return this;
    }

    /**
     * Gets the coordinate of a particular pixel in the 1D array
     * @param {number} i - Index of pixel in this._mapping
     */
    get(i) {
      if(typeof this._mapping[i] == 'undefined')
        throw new Error('Pixel with index ' + i + ' does not exist');

      return this._mapping[i];
    }

    /**
     * Finds the pixel with given coordinate
     * @param {number} x
     * @param {number} y
     */
    mapReverse(x, y) {
      for(var i in this._mapping) {
        if(!this._mapping[i]) continue;
        if(this._mapping[i][0] == x && this._mapping[i][1] == y)
          return i;
      }
      return false;
    }

    /**
     * Converts instance to JSON string
     */
    toJSON() {
      return JSON.stringify(this._components);
    }

    /**
     * Initializes instance from JSON string
     * @param {string} json - JSON string
     */
    fromJSON(json) {
      return this._init(JSON.parse(json));
    }
    
    /**
     * Adds a line of pixels
     * Does NOT save to this._components, use public line function
     * @param {number} x1 - X start coordinate
     * @param {number} x1 - Y start coordinate
     * @param {number} dx - Width
     * @param {number} dy - Height
     */
    _line(x1, y1, dx, dy) {
      var xl = Math.abs(dx);
      var yl = Math.abs(dy);
      
      if((xl !== 0 && yl !== 0) && xl != yl)
        throw new Error('Line must be horizontal, vertical or diagonal');

      for(var x = 0, y = 0; x < xl || y < yl; x+=(x<xl?1:0), y+=(y<yl?1:0)) {
        this.add(x1+(dx>=0?x:-x), y1+(dy>=0?y:-y));
      }

      return this;
    }

    /**
     * Checks if a certain coordinate is already mapped
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    _exists(x, y) {
      for(var i in this._mapping) {
        if(!this._mapping[i]) continue;
        if(this._mapping[i][0] == x && this._mapping[i][1] == y)
          return true;
      }
      return false;
    }
  }
  
  module.exports = Pixelmapper;
})(typeof module == 'undefined' ? this['Pixelmapper'] : module);