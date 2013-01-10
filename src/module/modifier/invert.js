LIBNOISE.module.modifier.Invert = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

LIBNOISE.module.modifier.Invert.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return -this.sourceModule.getValue(x, y, z);

};
