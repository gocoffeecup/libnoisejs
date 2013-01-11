LIBNOISE.module.generator.Cylinders = function(frequency) {

	this.frequency = frequency || LIBNOISE.module.generator.Cylinders.DEFAULT_CYLINDERS_FREQUENCY;

};

LIBNOISE.module.generator.Cylinders.DEFAULT_CYLINDERS_FREQUENCY = 1.0;

LIBNOISE.module.generator.Cylinders.prototype.getValue = function(x, y, z) {

	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z);

	var distFromCenter          = Math.sqrt(x * x + z * z);
    var distFromSmallerSphere   = distFromCenter - Math.floor(distFromCenter);
    var distFromLargerSphere    = 1.0 - distFromSmallerSphere;
    var nearestDist             = Math.min(distFromSmallerSphere, distFromLargerSphere);

    return 1.0 - (nearestDist * 4.0); // Puts it in the -1.0 to +1.0 range.

};

LIBNOISE.module.generator.Cylinders.setFrequency = function(f){
  this.frequency = f
};

