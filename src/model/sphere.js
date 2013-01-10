LIBNOISE.model.Sphere = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

LIBNOISE.model.Sphere.prototype.getValue = function(lat, lon) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing module!');

	}

	var r = Math.cos(LIBNOISE.MathConsts.DEG_TO_RAD * lat);

	return this.sourceModule.getValue(
		Math.cos(LIBNOISE.MathConsts.DEG_TO_RAD * lon) * r,
		Math.sin(LIBNOISE.MathConsts.DEG_TO_RAD * lat),
		Math.sin(LIBNOISE.MathConsts.DEG_TO_RAD * lon) * r
	);

};
