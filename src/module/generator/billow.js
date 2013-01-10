LIBNOISE.module.generator.Billow = function(frequency, lacunarity, octaves, persist, seed, quality) {

	this.frequency  = frequency     || LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_FREQUENCY;
	this.lacunarity = lacunarity    || LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_LACUNARITY;
	this.octaves    = octaves       || LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_OCTAVE_COUNT;
	this.persist    = persist       || LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_PERSISTENCE;
	this.seed       = seed          || LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_SEED;
	this.quality    = quality       || LIBNOISE.NoiseGen.QUALITY_STD;

};

LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_FREQUENCY     = 1.0;
LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_LACUNARITY    = 2.0;
LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_OCTAVE_COUNT  = 6;
LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_PERSISTENCE   = 0.5;
LIBNOISE.module.generator.Billow.DEFAULT_BILLOW_SEED          = 0;
LIBNOISE.module.generator.Billow.BILLOW_MAX_OCTAVE            = 30;

LIBNOISE.module.generator.Billow.prototype.getValue = function(x, y, z) {

	var nx, ny, nz;
	var value   = 0.0;
	var signal  = 0.0;
	var persist = 1.0;

	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z * this.frequency);

	for (var octave = 0; octave < this.octaves; octave++) {

		// Make sure that these floating-point values have the same range as a 32-
		// bit integer so that we can pass them to the coherent-noise functions.
		nx       = LIBNOISE.MathFuncs.makeInt32Range(x);
		ny       = LIBNOISE.MathFuncs.makeInt32Range(y);
		nz       = LIBNOISE.MathFuncs.makeInt32Range(z);

		// Get the coherent-noise value from the input value and add it to the final result.
		signal   = 2.0 * Math.abs(LIBNOISE.NoiseGen.gradientCoherentNoise3D(nx, ny, nz, ((this.seed + octave) & 0xffffffff), this.quality)) - 1.0;
		value   += signal * persist;

		// Prepare the next octave.
		x       *= this.lacunarity;
		y       *= this.lacunarity;
		z       *= this.lacunarity;
		persist *= this.persist;

	}

	return value + 0.5;

};