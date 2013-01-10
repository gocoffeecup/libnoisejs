LIBNOISE.module.generator.Checkerboard = function() {};

LIBNOISE.module.generator.Checkerboard.prototype.getValue = function(x, y, z) {

	var ix = Math.floor(Libnoise.MathFuncs.makeInt32Range(x));
	var iy = Math.floor(Libnoise.MathFuncs.makeInt32Range(y));
	var iz = Math.floor(Libnoise.MathFuncs.makeInt32Range(z));

    return (ix & 1 ^ iy & 1 ^ iz & 1) ? -1.0 : 1.0;

};
