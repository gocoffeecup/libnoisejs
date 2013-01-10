LIBNOISE.model.Plane = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

LIBNOISE.model.Plane.prototype.getValue = function(x, y) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing module!');

	}

	return this.sourceModule.getValue(x, 0, y);

};

