LIBNOISE.module.modifier.ScaleBias = function(sourceModule, scale, bias) {

	this.sourceModule   = sourceModule  || null;
	this.scale          = scale         || LIBNOISE.module.modifier.ScaleBias.DEFAULT_SCALE;
	this.bias           = bias          || LIBNOISE.module.modifier.ScaleBias.DEFAULT_BIAS;

};

LIBNOISE.module.modifier.ScaleBias.DEFAULT_BIAS  = 0.0;
LIBNOISE.module.modifier.ScaleBias.DEFAULT_SCALE = 1.0;

LIBNOISE.module.modifier.ScaleBias.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModule.getValue(x, y, z) * this.scale + this.bias;

};

