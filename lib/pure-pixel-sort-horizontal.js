'use strict';

var _ = require('underscore');

var base = require("./pixel-sort-base.js");

module.exports = _.extend({}, base, {
	description: "Pure horizontal pixel sort",
	  
	firstX: function(_x, _y) {
		if ( _x < this.width)
			return 0
		else
			return -1;
	},

	nextX: function(_x, _y) {
		return this.width - 1;
	},

	firstY: function(_x, _y) {
		return -1;
	},

	nextY: function(_x, _y) {
		return this.height - 1;
	}
});
