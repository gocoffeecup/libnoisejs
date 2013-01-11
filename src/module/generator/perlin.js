LIBNOISE.module.generator.Perlin = function(frequency, lacunarity, octaves, persist, seed, quality) {

	this.frequency  = frequency     || LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_FREQUENCY;
	this.lacunarity = lacunarity    || LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_LACUNARITY;
	this.octaves    = octaves       || LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_OCTAVE_COUNT;
	this.persist    = persist       || LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_PERSISTENCE;
	this.seed       = seed          || LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_SEED;
	this.quality    = quality       || LIBNOISE.NoiseGen.QUALITY_STD;

};

LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_FREQUENCY     = 1.0;
LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_LACUNARITY    = 2.0;
LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_OCTAVE_COUNT  = 6;
LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_PERSISTENCE   = 0.5;
LIBNOISE.module.generator.Perlin.DEFAULT_PERLIN_SEED          = 0;
LIBNOISE.module.generator.Perlin.PERLIN_MAX_OCTAVE            = 30;

LIBNOISE.module.generator.Perlin.prototype.getValue = function(x, y, z) {

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
		signal   = LIBNOISE.NoiseGen.gradientCoherentNoise3D(nx, ny, nz, ((this.seed + octave) & 0xffffffff), this.quality);
		value   += signal * persist;

		// Prepare the next octave.
		x       *= this.lacunarity;
		y       *= this.lacunarity;
		z       *= this.lacunarity;
		persist *= this.persist;

	}

	return value;

};

LIBNOISE.module.generator.Perlin.prototype.SetFrequency = function(f){
  this.frequency = f
};

LIBNOISE.module.generator.Perlin.prototype.SetLacunarity = function(l){
  this.lacunarity = l
};

LIBNOISE.module.generator.Perlin.prototype.SetOctaves = function(o){
  this.octaves = o
};

LIBNOISE.module.generator.Perlin.prototype.SetPersistence = function(p){
  this.persist = p
};

LIBNOISE.module.generator.Perlin.prototype.SetSeed = function(s){
  this.seed = s
};

LIBNOISE.module.generator.Perlin.prototype.SetQuality = function(q){
  this.quality = q
};