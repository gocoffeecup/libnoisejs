LIBNOISE.model.Cylinder = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

LIBNOISE.model.Cylinder.prototype.getValue = function(angle, y) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing module!');

	}

	var i = parseFloat(angle) * LIBNOISE.MathConsts.DEG_TO_RAD;

	return this.sourceModule.getValue(Math.cos(i), y, Math.sin(i));

}