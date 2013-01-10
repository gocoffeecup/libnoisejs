LIBNOISE.module.selector.Blend = function(sourceModules, controlModule) {

	this.sourceModules = sourceModules || [];
	this.controlModule = controlModule || null;

};

LIBNOISE.module.selector.Blend.prototype.getValue = function(x, y, z) {

	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module(s)!');

	}

	if(!this.controlModule) {

		throw new Error('Invalid or missing control module!');

	}

	x = parseFloat(x);
	y = parseFloat(y);
	z = parseFloat(z);

	return LIBNOISE.Interpolation.linear(
		this.sourceModules[0].getValue(x, y, z),
		this.sourceModules[1].getValue(x, y, z),
		(this.controlModule.getValue(x, y, z) + 1.0) / 2.0
	);

};

