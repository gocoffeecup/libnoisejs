LIBNOISE.module.combiner.Min = function(sourceModules) {

	this.sourceModules = sourceModules || null;

};

LIBNOISE.module.combiner.Min.prototype.getValue = function(x, y, z) {

	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module!');

	}

	return Math.min(
		this.sourceModules[0].getValue(x, y, z),
		this.sourceModules[1].getValue(x, y, z)
	);

};
