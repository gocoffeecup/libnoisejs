
var LIBNOISE = {}


LIBNOISE.Interpolation = {

	/// Performs cubic interpolation between two values bound between two other
	/// values.
	///
	/// @param n0 The value before the first value.
	/// @param n1 The first value.
	/// @param n2 The second value.
	/// @param n3 The value after the second value.
	/// @param a The alpha value.
	///
	/// @returns The interpolated value.
	///
	/// The alpha value should range from 0.0 to 1.0.  If the alpha value is
	/// 0.0, this function returns @a n1.  If the alpha value is 1.0, this
	/// function returns @a n2.
	cubic: function(n0, n1, n2, n3, a) {
	  //console.log(n0,n1,n2,n3,a)
		var p = parseFloat((n3 - n2) - (n0 - n1));
		var q = parseFloat((n0 - n1) - p);
		var r = parseFloat(n2 - n0);
		var s = parseFloat(n1);
		return parseFloat(p * a * a * a + q * a * a + r * a + s);
	},

	/// Performs linear interpolation between two values.
	///
	/// @param n0 The first value.
	/// @param n1 The second value.
	/// @param a The alpha value.
	///
	/// @returns The interpolated value.
	///
	/// The alpha value should range from 0.0 to 1.0.  If the alpha value is
	/// 0.0, this function returns @a n0.  If the alpha value is 1.0, this
	/// function returns @a n1.
	linear: function(n0, n1, a) {
		a = parseFloat(a);
		return parseFloat((1.0 - a) * parseFloat(n0)) + (a * parseFloat(n1));
	},

	/// Maps a value onto a cubic S-curve.
	///
	/// @param a The value to map onto a cubic S-curve.
	///
	/// @returns The mapped value.
	///
	/// @a a should range from 0.0 to 1.0.
	///
	/// The derivitive of a cubic S-curve is zero at @a a = 0.0 and @a a =
	/// 1.0
	cubicSCurve: function(a) {
		a = parseFloat(a);
		return (a * a * (3.0 - 2.0 * a));
	},

	/// Maps a value onto a quintic S-curve.
	///
	/// @param a The value to map onto a quintic S-curve.
	///
	/// @returns The mapped value.
	///
	/// @a a should range from 0.0 to 1.0.
	///
	/// The first derivitive of a quintic S-curve is zero at @a a = 0.0 and
	/// @a a = 1.0
	///
	/// The second derivitive of a quintic S-curve is zero at @a a = 0.0 and
	/// @a a = 1.0
	quinticSCurve: function(a) {
		a = parseFloat(a);
		var a3 = parseFloat(a * a * a);
		var a4 = parseFloat(a3 * a);
		var a5 = parseFloat(a4 * a);
		return parseFloat((6.0 * a5) - (15.0 * a4) + (10.0 * a3));
	}

};

LIBNOISE.MathConsts = {
	PI: Math.PI,
	SQRT_2: Math.SQRT2,
	SQRT_3: 1.7320508075688772935,
	DEG_TO_RAD: Math.PI / 180.0,
	RAD_TO_DEG:  1.0 / (Math.PI / 180.0)
};

LIBNOISE.MathFuncs = {

	makeInt32Range: function(n) {

		n = parseFloat(n);

		if (n >= 1073741824.0) {

		  return (2.0 * (n % 1073741824.0)) - 1073741824.0;

		} else if (n <= -1073741824.0) {

		  return (2.0 * (n % 1073741824.0)) + 1073741824.0;

		}

		return n;

	}

};


LIBNOISE.Misc = {

	clampValue: function(value, lowerBound, upperBound) {

		if (value < lowerBound) {

			return lowerBound;

		} else if (value > upperBound) {

			return upperBound;

		} else {

			return value;

		}

	},

	exponentFilter: function(value, cover, sharpness) {

		var c = value - (255 - cover);

		if(c < 0) {

			c = 0;

		}

		return 255 - Math.floor(Math.pow(sharpness, c) * 255);


	},

	normalizeValue: function(value, lowerBound, upperBound) {

		return parseFloat(value - lowerBound) / parseFloat(upperBound - lowerBound);

	},

	swapValues: function(a, b) {

		if(typeof a == 'object') {

			b = a[1];
			a = a[0];

		}

		return [b, a];

    }

};

LIBNOISE.NoiseGen = {

	// consts
	X_NOISE_GEN:        1619,
	Y_NOISE_GEN:        31337,
	Z_NOISE_GEN:        6971,
	SEED_NOISE_GEN:     1013,
	SHIFT_NOISE_GEN:    8,
	/// Generates coherent noise quickly.  When a coherent-noise function with
	/// NoiseGen.prototype quality setting is used to generate a bump-map image, there are
	/// noticeable "creasing" artifacts in the resulting image.  This is
	/// because the derivative of that function is discontinuous at integer
	/// boundaries.
	QUALITY_FAST:       0,

	/// Generates standard-quality coherent noise.  When a coherent-noise
	/// function with NoiseGen.prototype quality setting is used to generate a bump-map
	/// image, there are some minor "creasing" artifacts in the resulting
	/// image.  This is because the second derivative of that function is
	/// discontinuous at integer boundaries.
	QUALITY_STD:        1,

	/// Generates the best-quality coherent noise.  When a coherent-noise
	/// function with NoiseGen.prototype quality setting is used to generate a bump-map
	/// image, there are no "creasing" artifacts in the resulting image.  This
	/// is because the first and second derivatives of that function are
	/// continuous at integer boundaries.
	QUALITY_BEST:       2,

	intValueNoise3D: function(x, y, z, seed) {

		x       = parseInt(x);
		y       = parseInt(y);
		z       = parseInt(z);
		seed    = parseInt(seed);

		// All constants are primes and must remain prime in order for this noise
		// function to work correctly.
		var n = parseInt((
			  LIBNOISE.NoiseGen.X_NOISE_GEN    * x
			+ LIBNOISE.NoiseGen.Y_NOISE_GEN    * y
			+ LIBNOISE.NoiseGen.Z_NOISE_GEN    * z
			+ LIBNOISE.NoiseGen.SEED_NOISE_GEN * seed)
			& 0x7fffffff
		);

		n = (n >> 13) ^ n;

		return parseFloat((n * (n * n * 60493 + 19990303) + 1376312589) & 0x7fffffff);

	},

	valueNoise3D: function(x, y, z, seed) {


	  return 1.0 - (LIBNOISE.NoiseGen.intValueNoise3D(parseInt(x), parseInt(y), parseInt(z), parseInt(seed)) / 1073741824.0);

	},

	gradientNoise3D: function(fx, fy, fz, ix, iy, iz, seed) {

		if(!seed) {
			seed = 1;
		}

		fx = parseFloat(fx);
		fy = parseFloat(fy);
		fz = parseFloat(fz);
		ix = parseFloat(ix);
		iy = parseFloat(iy);
		iz = parseFloat(iz);

		// Randomly generate a gradient vector given the integer coordinates of the
		// input value.  This implementation generates a random number and uses it
		// as an index into a normalized-vector lookup table.
		var vectorIndex = parseInt(
			LIBNOISE.NoiseGen.X_NOISE_GEN * ix +
			LIBNOISE.NoiseGen.Y_NOISE_GEN * iy +
			LIBNOISE.NoiseGen.Z_NOISE_GEN * iz +
			LIBNOISE.NoiseGen.SEED_NOISE_GEN * seed
		) & 0xffffffff;

		vectorIndex ^= (vectorIndex >> LIBNOISE.NoiseGen.SHIFT_NOISE_GEN);
		vectorIndex &= 0xff;

		var xvGradient = LIBNOISE.VectorTable[(vectorIndex << 2)];
		var yvGradient = LIBNOISE.VectorTable[(vectorIndex << 2) + 1];
		var zvGradient = LIBNOISE.VectorTable[(vectorIndex << 2) + 2];

		// Set up us another vector equal to the distance between the two vectors
		// passed to this function.
		var xvPoint = (fx - ix);
		var yvPoint = (fy - iy);
		var zvPoint = (fz - iz);

		// Now compute the dot product of the gradient vector with the distance
		// vector.  The resulting value is gradient noise.  Apply a scaling value
		// so that this noise value ranges from -1.0 to 1.0.
		return (
			(xvGradient * xvPoint) +
			(yvGradient * yvPoint) +
			(zvGradient * zvPoint)
		) * 2.12;

	},

	coherentNoise3D: function(x, y, z, seed, quality, func) {

		if(!func) {

			throw new Error('Must provide proper interpolation function!');

		}

		x = parseFloat(x);
		y = parseFloat(y);
		z = parseFloat(z);

		if(!seed) {

			seed = 1;

		} else {

			seed = parseInt(seed);

		}

		if(!quality) {

			quality = LIBNOISE.NoiseGen.QUALITY_STD;

		} else {

			quality = parseInt(quality);

		}

		var xi = parseInt(x);
		var yi = parseInt(y);
		var zi = parseInt(z);

		// Create a unit-length cube aligned along an integer boundary.  This cube
		// surrounds the input point.
		var x0 = parseFloat(x > 0.0 ? xi : x - 1);
		var x1 = x0 + 1;
		var y0 = parseFloat(y > 0.0 ? yi : y - 1);
		var y1 = y0 + 1;
		var z0 = parseFloat(z > 0.0 ? zi : z - 1);
		var z1 = z0 + 1;

		// Map the difference between the coordinates of the input value and the
		// coordinates of the cube's outer-lower-left vertex onto an S-curve.
		var xs = 0, ys = 0, zs = 0;

		switch (quality) {

			case LIBNOISE.NoiseGen.QUALITY_BEST:
				xs = LIBNOISE.Interpolation.quinticSCurve(x - x0);
				ys = LIBNOISE.Interpolation.quinticSCurve(y - y0);
				zs = LIBNOISE.Interpolation.quinticSCurve(z - z0);
				break;

			case LIBNOISE.NoiseGen.QUALITY_STD:
				xs = LIBNOISE.Interpolation.cubicSCurve(x - x0);
				ys = LIBNOISE.Interpolation.cubicSCurve(y - y0);
				zs = LIBNOISE.Interpolation.cubicSCurve(z - z0);
				break;

			default:
			case LIBNOISE.NoiseGen.QUALITY_FAST:
				xs = x - x0;
				ys = y - y0;
				zs = z - z0;
				break;

		}

		// use provided function to interpolate
		return func(x0, y0, z0, x1, y1, z1, xs, ys, zs);

	},

	valueCoherentNoise3D: function(x, y, z, seed, quality) {

		return LIBNOISE.NoiseGen.coherentNoise3D(x, y, z, seed, quality, function(x0, y0, z0, x1, y1, z1, xs, ys, zs) {

			// Now calculate the noise values at each vertex of the cube.  To generate
			// the coherent-noise value at the input point, interpolate these eight
			// noise values using the S-curve value as the interpolant (trilinear
			// interpolation.)
			var n0, n1, ix0, ix1, iy0, iy1;

			n0   = LIBNOISE.NoiseGen.valueNoise3D(x0, y0, z0, seed);
			n1   = LIBNOISE.NoiseGen.valueNoise3D(x1, y0, z0, seed);
			ix0  = LIBNOISE.Interpolation.linear(n0, n1, xs);
			n0   = LIBNOISE.NoiseGen.valueNoise3D(x0, y1, z0, seed);
			n1   = LIBNOISE.NoiseGen.valueNoise3D(x1, y1, z0, seed);
			ix1  = LIBNOISE.Interpolation.linear(n0, n1, xs);
			iy0  = LIBNOISE.Interpolation.linear(ix0, ix1, ys);
			n0   = LIBNOISE.NoiseGen.valueNoise3D(x0, y0, z1, seed);
			n1   = LIBNOISE.NoiseGen.valueNoise3D(x1, y0, z1, seed);
			ix0  = LIBNOISE.Interpolation.linear(n0, n1, xs);
			n0   = LIBNOISE.NoiseGen.valueNoise3D(x0, y1, z1, seed);
			n1   = LIBNOISE.NoiseGen.valueNoise3D(x1, y1, z1, seed);
			ix1  = LIBNOISE.Interpolation.linear(n0, n1, xs);
			iy1  = LIBNOISE.Interpolation.linear(ix0, ix1, ys);

			return LIBNOISE.Interpolation.linear(iy0, iy1, zs);

		});

	},

	gradientCoherentNoise3D: function(x, y, z, seed, quality) {

		return LIBNOISE.NoiseGen.coherentNoise3D(x, y, z, seed, quality, function(x0, y0, z0, x1, y1, z1, xs, ys, zs) {

			// Now calculate the noise values at each vertex of the cube.  To generate
			// the coherent-noise value at the input point, interpolate these eight
			// noise values using the S-curve value as the interpolant (trilinear
			// interpolation.)
			var n0, n1, ix0, ix1, iy0, iy1;

			n0  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x0, y0, z0, seed);
			n1  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x1, y0, z0, seed);
			ix0 = LIBNOISE.Interpolation.linear(n0, n1, xs);
			n0  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x0, y1, z0, seed);
			n1  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x1, y1, z0, seed);
			ix1 = LIBNOISE.Interpolation.linear(n0, n1, xs);
			iy0 = LIBNOISE.Interpolation.linear(ix0, ix1, ys);
			n0  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x0, y0, z1, seed);
			n1  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x1, y0, z1, seed);
			ix0 = LIBNOISE.Interpolation.linear(n0, n1, xs);
			n0  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x0, y1, z1, seed);
			n1  = LIBNOISE.NoiseGen.gradientNoise3D(x, y, z, x1, y1, z1, seed);
			ix1 = LIBNOISE.Interpolation.linear(n0, n1, xs);
			iy1 = LIBNOISE.Interpolation.linear(ix0, ix1, ys);

			return LIBNOISE.Interpolation.linear(iy0, iy1, zs);

		});

	}

};

LIBNOISE.NoiseMap = function(w, h) {

	this.width  = w || 1;
	this.height = h || 1;
	this.map    = [];

};

LIBNOISE.NoiseMap.prototype = {

	get height() {

		return this._height;

	},

	set height(v) {

		if(v < 0) {

			throw new Error('Height must be greater than zero.');

		}

		this._height = v;

	},

	get width() {

		return this._width;

	},

	set width(v) {

		if(v < 0) {

			throw new Error('Width must be greater than zero.');

		}

		this._width = v;

	},

	addValue: function(x, y, v) {

		var value = this.getValue(x, y) || 0;

		this.setValue(x, y, value + v);

	},

	getValue: function(x, y) {

		return this.map[y * this.width + x];

	},

	setSize: function(w, h) {

		this.width  = w;
		this.height = h;

	},

	setValue: function(x, y, v) {

		this.map[y * this.width + x] = v;

	},

	subtractValue: function(x, y, v) {

		var value = this.getValue(x, y) || 0;

		this.setValue(x, y,  value - v);

	}

};

LIBNOISE.VectorTable = [
	-0.763874,  -0.596439,  -0.246489,  0.0,
     0.396055,   0.904518,  -0.158073,  0.0,
    -0.499004,  -0.8665,    -0.0131631, 0.0,
     0.468724,  -0.824756,   0.316346,  0.0,
     0.829598,   0.43195,    0.353816,  0.0,
    -0.454473,   0.629497,  -0.630228,  0.0,
    -0.162349,  -0.869962,  -0.465628,  0.0,
     0.932805,   0.253451,   0.256198,  0.0,
    -0.345419,   0.927299,  -0.144227,  0.0,
    -0.715026,  -0.293698,  -0.634413,  0.0,
    -0.245997,   0.717467,  -0.651711,  0.0,
    -0.967409,  -0.250435,  -0.037451,  0.0,
     0.901729,   0.397108,  -0.170852,  0.0,
     0.892657,  -0.0720622, -0.444938,  0.0,
     0.0260084, -0.0361701,  0.999007,  0.0,
     0.949107,  -0.19486,    0.247439,  0.0,
     0.471803,  -0.807064,  -0.355036,  0.0,
     0.879737,   0.141845,   0.453809,  0.0,
     0.570747,   0.696415,   0.435033,  0.0,
    -0.141751,  -0.988233,  -0.0574584, 0.0,
    -0.58219,   -0.0303005,  0.812488,  0.0,
    -0.60922,    0.239482,  -0.755975,  0.0,
     0.299394,  -0.197066,  -0.933557,  0.0,
    -0.851615,  -0.220702,  -0.47544,   0.0,
     0.848886,   0.341829,  -0.403169,  0.0,
    -0.156129,  -0.687241,   0.709453,  0.0,
    -0.665651,   0.626724,   0.405124,  0.0,
     0.595914,  -0.674582,   0.43569,   0.0,
     0.171025,  -0.509292,   0.843428,  0.0,
     0.78605,    0.536414,  -0.307222,  0.0,
     0.18905,   -0.791613,   0.581042,  0.0,
    -0.294916,   0.844994,   0.446105,  0.0,
     0.342031,  -0.58736,   -0.7335,    0.0,
     0.57155,    0.7869,     0.232635,  0.0,
     0.885026,  -0.408223,   0.223791,  0.0,
    -0.789518,   0.571645,   0.223347,  0.0,
     0.774571,   0.31566,    0.548087,  0.0,
    -0.79695,   -0.0433603, -0.602487,  0.0,
    -0.142425,  -0.473249,  -0.869339,  0.0,
    -0.0698838,  0.170442,   0.982886,  0.0,
     0.687815,  -0.484748,   0.540306,  0.0,
     0.543703,  -0.534446,  -0.647112,  0.0,
     0.97186,    0.184391,  -0.146588,  0.0,
     0.707084,   0.485713,  -0.513921,  0.0,
     0.942302,   0.331945,   0.043348,  0.0,
     0.499084,   0.599922,   0.625307,  0.0,
    -0.289203,   0.211107,   0.9337,    0.0,
     0.412433,  -0.71667,   -0.56239,   0.0,
     0.87721,   -0.082816,   0.47291,   0.0,
    -0.420685,  -0.214278,   0.881538,  0.0,
     0.752558,  -0.0391579,  0.657361,  0.0,
     0.0765725, -0.996789,   0.0234082, 0.0,
    -0.544312,  -0.309435,  -0.779727,  0.0,
    -0.455358,  -0.415572,   0.787368,  0.0,
    -0.874586,   0.483746,   0.0330131, 0.0,
     0.245172,  -0.0838623,  0.965846,  0.0,
     0.382293,  -0.432813,   0.81641,   0.0,
    -0.287735,  -0.905514,   0.311853,  0.0,
    -0.667704,   0.704955,  -0.239186,  0.0,
     0.717885,  -0.464002,  -0.518983,  0.0,
     0.976342,  -0.214895,   0.0240053, 0.0,
    -0.0733096, -0.921136,   0.382276,  0.0,
    -0.986284,   0.151224,  -0.0661379, 0.0,
    -0.899319,  -0.429671,   0.0812908, 0.0,
     0.652102,  -0.724625,   0.222893,  0.0,
     0.203761,   0.458023,  -0.865272,  0.0,
    -0.030396,   0.698724,  -0.714745,  0.0,
    -0.460232,   0.839138,   0.289887,  0.0,
    -0.0898602,  0.837894,   0.538386,  0.0,
    -0.731595,   0.0793784,  0.677102,  0.0,
    -0.447236,  -0.788397,   0.422386,  0.0,
     0.186481,   0.645855,  -0.740335,  0.0,
    -0.259006,   0.935463,   0.240467,  0.0,
     0.445839,   0.819655,  -0.359712,  0.0,
     0.349962,   0.755022,  -0.554499,  0.0,
    -0.997078,  -0.0359577,  0.0673977, 0.0,
    -0.431163,  -0.147516,  -0.890133,  0.0,
     0.299648,  -0.63914,    0.708316,  0.0,
     0.397043,   0.566526,  -0.722084,  0.0,
    -0.502489,   0.438308,  -0.745246,  0.0,
     0.0687235,  0.354097,   0.93268,   0.0,
    -0.0476651, -0.462597,   0.885286,  0.0,
    -0.221934,   0.900739,  -0.373383,  0.0,
    -0.956107,  -0.225676,   0.186893,  0.0,
    -0.187627,   0.391487,  -0.900852,  0.0,
    -0.224209,  -0.315405,   0.92209,   0.0,
    -0.730807,  -0.537068,   0.421283,  0.0,
    -0.0353135, -0.816748,   0.575913,  0.0,
    -0.941391,   0.176991,  -0.287153,  0.0,
    -0.154174,   0.390458,   0.90762,   0.0,
    -0.283847,   0.533842,   0.796519,  0.0,
    -0.482737,  -0.850448,   0.209052,  0.0,
    -0.649175,   0.477748,   0.591886,  0.0,
     0.885373,  -0.405387,  -0.227543,  0.0,
    -0.147261,   0.181623,  -0.972279,  0.0,
     0.0959236, -0.115847,  -0.988624,  0.0,
    -0.89724,   -0.191348,   0.397928,  0.0,
     0.903553,  -0.428461,  -0.00350461,0.0,
     0.849072,  -0.295807,  -0.437693,  0.0,
     0.65551,    0.741754,  -0.141804,  0.0,
     0.61598,   -0.178669,   0.767232,  0.0,
     0.0112967,  0.932256,  -0.361623,  0.0,
    -0.793031,   0.258012,   0.551845,  0.0,
     0.421933,   0.454311,   0.784585,  0.0,
    -0.319993,   0.0401618, -0.946568,  0.0,
    -0.81571,    0.551307,  -0.175151,  0.0,
    -0.377644,   0.00322313, 0.925945,  0.0,
     0.129759,  -0.666581,  -0.734052,  0.0,
     0.601901,  -0.654237,  -0.457919,  0.0,
    -0.927463,  -0.0343576, -0.372334,  0.0,
    -0.438663,  -0.868301,  -0.231578,  0.0,
    -0.648845,  -0.749138,  -0.133387,  0.0,
     0.507393,  -0.588294,   0.629653,  0.0,
     0.726958,   0.623665,   0.287358,  0.0,
     0.411159,   0.367614,  -0.834151,  0.0,
     0.806333,   0.585117,  -0.0864016, 0.0,
     0.263935,  -0.880876,   0.392932,  0.0,
     0.421546,  -0.201336,   0.884174,  0.0,
    -0.683198,  -0.569557,  -0.456996,  0.0,
    -0.117116,  -0.0406654, -0.992285,  0.0,
    -0.643679,  -0.109196,  -0.757465,  0.0,
    -0.561559,  -0.62989,    0.536554,  0.0,
     0.0628422,  0.104677,  -0.992519,  0.0,
     0.480759,  -0.2867,    -0.828658,  0.0,
    -0.228559,  -0.228965,  -0.946222,  0.0,
    -0.10194,   -0.65706,   -0.746914,  0.0,
     0.0689193, -0.678236,   0.731605,  0.0,
     0.401019,  -0.754026,   0.52022,   0.0,
    -0.742141,   0.547083,  -0.387203,  0.0,
    -0.00210603,-0.796417,  -0.604745,  0.0,
     0.296725,  -0.409909,  -0.862513,  0.0,
    -0.260932,  -0.798201,   0.542945,  0.0,
    -0.641628,   0.742379,   0.192838,  0.0,
    -0.186009,  -0.101514,   0.97729,   0.0,
     0.106711,  -0.962067,   0.251079,  0.0,
    -0.743499,   0.30988,   -0.592607,  0.0,
    -0.795853,  -0.605066,  -0.0226607, 0.0,
    -0.828661,  -0.419471,  -0.370628,  0.0,
     0.0847218, -0.489815,  -0.8677,    0.0,
    -0.381405,   0.788019,  -0.483276,  0.0,
     0.282042,  -0.953394,   0.107205,  0.0,
     0.530774,   0.847413,   0.0130696, 0.0,
     0.0515397,  0.922524,   0.382484,  0.0,
    -0.631467,  -0.709046,   0.313852,  0.0,
     0.688248,   0.517273,   0.508668,  0.0,
     0.646689,  -0.333782,  -0.685845,  0.0,
    -0.932528,  -0.247532,  -0.262906,  0.0,
     0.630609,   0.68757,   -0.359973,  0.0,
     0.577805,  -0.394189,   0.714673,  0.0,
    -0.887833,  -0.437301,  -0.14325,   0.0,
     0.690982,   0.174003,   0.701617,  0.0,
    -0.866701,   0.0118182,  0.498689,  0.0,
    -0.482876,   0.727143,   0.487949,  0.0,
    -0.577567,   0.682593,  -0.447752,  0.0,
     0.373768,   0.0982991,  0.922299,  0.0,
     0.170744,   0.964243,  -0.202687,  0.0,
     0.993654,  -0.035791,  -0.106632,  0.0,
     0.587065,   0.4143,    -0.695493,  0.0,
    -0.396509,   0.26509,   -0.878924,  0.0,
    -0.0866853,  0.83553,   -0.542563,  0.0,
     0.923193,   0.133398,  -0.360443,  0.0,
     0.00379108,-0.258618,   0.965972,  0.0,
     0.239144,   0.245154,  -0.939526,  0.0,
     0.758731,  -0.555871,   0.33961,   0.0,
     0.295355,   0.309513,   0.903862,  0.0,
     0.0531222, -0.91003,   -0.411124,  0.0,
     0.270452,   0.0229439, -0.96246,   0.0,
     0.563634,   0.0324352,  0.825387,  0.0,
     0.156326,   0.147392,   0.976646,  0.0,
    -0.0410141,  0.981824,   0.185309,  0.0,
    -0.385562,  -0.576343,  -0.720535,  0.0,
     0.388281,   0.904441,   0.176702,  0.0,
     0.945561,  -0.192859,  -0.262146,  0.0,
     0.844504,   0.520193,   0.127325,  0.0,
     0.0330893,  0.999121,  -0.0257505, 0.0,
    -0.592616,  -0.482475,  -0.644999,  0.0,
     0.539471,   0.631024,  -0.557476,  0.0,
     0.655851,  -0.027319,  -0.754396,  0.0,
     0.274465,   0.887659,   0.369772,  0.0,
    -0.123419,   0.975177,  -0.183842,  0.0,
    -0.223429,   0.708045,   0.66989,   0.0,
    -0.908654,   0.196302,   0.368528,  0.0,
    -0.95759,   -0.00863708, 0.288005,  0.0,
     0.960535,   0.030592,   0.276472,  0.0,
    -0.413146,   0.907537,   0.0754161, 0.0,
    -0.847992,   0.350849,  -0.397259,  0.0,
     0.614736,   0.395841,   0.68221,   0.0,
    -0.503504,  -0.666128,  -0.550234,  0.0,
    -0.268833,  -0.738524,  -0.618314,  0.0,
     0.792737,  -0.60001,   -0.107502,  0.0,
    -0.637582,   0.508144,  -0.579032,  0.0,
     0.750105,   0.282165,  -0.598101,  0.0,
    -0.351199,  -0.392294,  -0.850155,  0.0,
     0.250126,  -0.960993,  -0.118025,  0.0,
    -0.732341,   0.680909,  -0.0063274, 0.0,
    -0.760674,  -0.141009,   0.633634,  0.0,
     0.222823,  -0.304012,   0.926243,  0.0,
     0.209178,   0.505671,   0.836984,  0.0,
     0.757914,  -0.56629,   -0.323857,  0.0,
    -0.782926,  -0.339196,   0.52151,   0.0,
    -0.462952,   0.585565,   0.665424,  0.0,
     0.61879,    0.194119,  -0.761194,  0.0,
     0.741388,  -0.276743,   0.611357,  0.0,
     0.707571,   0.702621,   0.0752872, 0.0,
     0.156562,   0.819977,   0.550569,  0.0,
    -0.793606,   0.440216,   0.42,      0.0,
     0.234547,   0.885309,  -0.401517,  0.0,
     0.132598,   0.80115,   -0.58359,   0.0,
    -0.377899,  -0.639179,   0.669808,  0.0,
    -0.865993,  -0.396465,   0.304748,  0.0,
    -0.624815,  -0.44283,    0.643046,  0.0,
    -0.485705,   0.825614,  -0.287146,  0.0,
    -0.971788,   0.175535,   0.157529,  0.0,
    -0.456027,   0.392629,   0.798675,  0.0,
    -0.0104443,  0.521623,  -0.853112,  0.0,
    -0.660575,  -0.74519,    0.091282,  0.0,
    -0.0157698, -0.307475,  -0.951425,  0.0,
    -0.603467,  -0.250192,   0.757121,  0.0,
     0.506876,   0.25006,    0.824952,  0.0,
     0.255404,   0.966794,   0.00884498,0.0,
     0.466764,  -0.874228,  -0.133625,  0.0,
     0.475077,  -0.0682351, -0.877295,  0.0,
    -0.224967,  -0.938972,  -0.260233,  0.0,
    -0.377929,  -0.814757,  -0.439705,  0.0,
    -0.305847,   0.542333,  -0.782517,  0.0,
     0.26658,   -0.902905,  -0.337191,  0.0,
     0.0275773,  0.322158,  -0.946284,  0.0,
     0.0185422,  0.716349,   0.697496,  0.0,
    -0.20483,    0.978416,   0.0273371, 0.0,
    -0.898276,   0.373969,   0.230752,  0.0,
    -0.00909378, 0.546594,   0.837349,  0.0,
     0.6602,    -0.751089,   0.000959236,0.0,
     0.855301,  -0.303056,   0.420259,  0.0,
     0.797138,   0.0623013, -0.600574,  0.0,
     0.48947,   -0.866813,   0.0951509, 0.0,
     0.251142,   0.674531,   0.694216,  0.0,
    -0.578422,  -0.737373,  -0.348867,  0.0,
    -0.254689,  -0.514807,   0.818601,  0.0,
     0.374972,   0.761612,   0.528529,  0.0,
     0.640303,  -0.734271,  -0.225517,  0.0,
    -0.638076,   0.285527,   0.715075,  0.0,
     0.772956,  -0.15984,   -0.613995,  0.0,
     0.798217,  -0.590628,   0.118356,  0.0,
    -0.986276,  -0.0578337, -0.154644,  0.0,
    -0.312988,  -0.94549,    0.0899272, 0.0,
    -0.497338,   0.178325,   0.849032,  0.0,
    -0.101136,  -0.981014,   0.165477,  0.0,
    -0.521688,   0.0553434, -0.851339,  0.0,
    -0.786182,  -0.583814,   0.202678,  0.0,
    -0.565191,   0.821858,  -0.0714658, 0.0,
     0.437895,   0.152598,  -0.885981,  0.0,
    -0.92394,    0.353436,  -0.14635,   0.0,
     0.212189,  -0.815162,  -0.538969,  0.0,
    -0.859262,   0.143405,  -0.491024,  0.0,
     0.991353,   0.112814,   0.0670273, 0.0,
     0.0337884, -0.979891,  -0.196654,  0.0
];



LIBNOISE.builders = {}
LIBNOISE.builders.NoiseMapBuilderCylinder = function(sourceModule, width, height) {

	this.sourceModule       = sourceModule  || null;
	this.width              = width         || 256;
	this.height             = height        || 256;

	this.lowerAngleBound    = 0.0;
	this.lowerHeightBound   = 0.0;
	this.upperAngleBound    = 1.0;
	this.upperHeightBound   = 1.0;

	this.noiseMap           = new LIBNOISE.NoiseMap(this.width, this.height);

};

LIBNOISE.builders.NoiseMapBuilderCylinder.prototype = {

	get lowerAngleBound() {

		return this._lowerAngleBound;

	},

	set lowerAngleBound(v) {

		if (v >= this.upperAngleBound) {

			throw new Error('Lower bound cannot equal or exceed upper bound!');

		}

		this._lowerAngleBound = v;

	},

	get lowerHeightBound() {

		return this._lowerHeightBound;

	},

	set lowerHeightBound(v) {

		if (v >= this.upperHeightBound) {

			throw new Error('Lower bound cannot equal or exceed upper bound!');

		}

		this._lowerHeightBound = v;

	},

	get upperAngleBound() {

		return this._upperAngleBound;

	},

	set upperAngleBound(v) {

		if (v <= this.upperAngleBound) {

			throw new Error('Upper bound cannot equal or exceed upper bound!');

		}

		this._upperAngleBound = v;

	},

	get upperHeightBound() {

		return this._upperHeightBound;

	},

	set upperHeightBound(v) {

		if (v <= this.upperHeightBound) {

			throw new Error('Upper bound cannot equal or exceed upper bound!');

		}

		this._upperHeightBound = v;

	},

	build: function() {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing module!');

		}

		// Create the cylinder model.
		var cylinder    = new LIBNOISE.model.Cylinder(this.sourceModule);
		var xDelta      = (this.upperAngleBound  - this.lowerAngleBound)  / this.width;
		var yDelta      = (this.upperHeightBound - this.lowerHeightBound) / this.height;
		var curAngle    = this.lowerAngleBound;
		var curHeight   = this.lowerHeightBound;

		// Fill every point in the noise map with the output values from the model.
		for (var y = 0; y < this.height; y++) {

			curAngle = this.lowerAngleBound;

			for (var x = 0; x < this.width; x++) {

				this.noiseMap.setValue(x, y, cylinder.getValue(curAngle, curHeight));

				curAngle += xDelta;

			}

			curHeight += yDelta;

		}

		return this.noiseMap;

	},

	setBounds: function(lowerAngleBound, lowerHeightBound, upperAngleBound, upperHeightBound) {

		this.lowerAngleBound    = lowerAngleBound;
		this.lowerHeightBound   = lowerHeightBound;
		this.upperAngleBound    = upperAngleBound;
		this.upperHeightBound   = upperHeightBound;

	}

};
LIBNOISE.builders.NoiseMapBuilderPlane = function(sourceModule, width, height, seamless) {

	this.sourceModule   = sourceModule  || null;
	this.width          = width         || 256;
	this.height         = height        || 256;
	this.seamless       = seamless      || false;

	this.lowerXBound    = 0.0;
	this.lowerYBound    = 0.0;
	this.upperXBound    = 1.0;
	this.upperYBound    = 1.0;

	this.noiseMap       = new LIBNOISE.NoiseMap(this.width, this.height);

};

LIBNOISE.builders.NoiseMapBuilderPlane.prototype = {

	get lowerXBound() {

		return this._lowerXBound;

	},

	set lowerXBound(v) {

		this._lowerXBound = v;

	},

	get lowerYBound() {

		return this._lowerYBound;

	},

	set lowerYBound(v) {

		this._lowerYBound = v;

	},

	get upperXBound() {

		return this._upperXBound;

	},

	set upperXBound(v) {

		this._upperXBound = v;

	},

	get upperYBound() {

		return this._upperYBound;

	},

	set upperYBound(v) {

		this._upperYBound = v;

	},

	build: function() {

		var xExtent = this.upperXBound - this.lowerXBound;
		var yExtent = this.upperYBound - this.lowerYBound;

		if (xExtent < 0 || yExtent < 0) {

			throw new Error('Invalid bounds!');

		}

		if (!this.sourceModule) {

			throw new Error('Invalid or missing module!');

		}

		// Create the plane model.
		var plane   = new LIBNOISE.model.Plane(this.sourceModule);
		var xDelta  = xExtent / this.width;
		var yDelta  = yExtent / this.height;
		var curX    = this.lowerXBound;
		var curY    = this.lowerYBound;
		var value, xBlend;

		// Fill every point in the noise map with the output values from the model.
		for (var y = 0; y < this.height; y++) {

			curX = this.lowerXBound;

			for (var x = 0; x < this.width; x++) {

				if(!this.seamless) {

					value = plane.getValue(curX, curY);

				} else {

					xBlend = 1.0 - ((curX - this.lowerXBound) / xExtent);

					value = Interpolation.linear(
						Interpolation.linear(
							plane.getValue(curX, curY),
							plane.getValue(curX + xExtent, curY),
							xBlend
						),
						Interpolation.linear(
							plane.getValue(curX, curY + yExtent),
							plane.getValue(curX + xExtent, curY + yExtent),
							xBlend
						),
						1.0 - ((curY - this.lowerYBound) / yExtent)
					);
				}

				this.noiseMap.setValue(x, y, value);

				curX += xDelta;

			}

			curY += yDelta;

		}

		return this.noiseMap;

	},

	setBounds: function(lowerXBound, lowerYBound, upperXBound, upperYBound) {

		this.upperXBound    = upperXBound;
		this.upperYBound    = upperYBound;
		this.lowerXBound    = lowerXBound;
		this.lowerYBound    = lowerYBound;

	}

}
LIBNOISE.builders.NoiseMapBuilderSphere = function(sourceModule, width, height) {

	this.sourceModule   = sourceModule  || null;
	this.width          = width         || 256;
	this.height         = height        || 256;

	this.northLatBound  = 0.0;
	this.southLatBound  = 0.0;
	this.eastLonBound   = 0.0;
	this.westLonBound   = 0.0;

	this.noiseMap       = new LIBNOISE.NoiseMap(this.width, this.height);

};

LIBNOISE.builders.NoiseMapBuilderSphere.prototype = {

	get eastLonBound() {

		return this._eastLonBound;

	},

	set eastLonBound(v) {

		if (v <= this.westLonBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._eastLonBound = v;

	},

	get northLatbound() {

		return this._northLatbound;

	},

	set northLatbound(v) {

		if (v <= this.southLatBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._northLatbound = v;

	},

	get southLatBound() {

		return this._southLatBound;

	},

	set southLatBound(v) {

		if (v >= this.northLatBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._westLonBound = v;

	},

	get westLonBound() {

		return this._westLonBound;

	},

	set westLonBound(v) {

		if (v >= this.eastLonBound) {

			throw new Error('Lower bound cannot equal or exceed east bound!');

		}

		this._westLonBound = v;

	},

	build: function() {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing module!');

		}

		// Create the cylinder model.
		var sphere  = new LIBNOISE.model.Sphere(this.sourceModule);
		var xDelta  = (this.eastLonBound  - this.westLonBound)  / this.width;
		var yDelta  = (this.northLatbound - this.southLatBound) / this.height;
		var curLon  = this.westLonBound;
		var curLat  = this.eastLonBound;

		// Fill every point in the noise map with the output values from the model.
		for (var y = 0; y < this.height; y++) {

			curLon = this.westLonBound;

			for (var x = 0; x < this.width; x++) {

				this.noiseMap.setValue(x, y, sphere.getValue(curLat, curLon));

				curLon += xDelta;

			}

			curLat += yDelta;

		}

		return this.noiseMap;

	},

	setBounds: function(westLonBound, eastLonBound, southLatBound, northLatBound) {

		this.westLonBound   = westLonBound;
		this.eastLonBound   = eastLonBound;
		this.southLatBound  = southLatBound;
		this.northLatBound  = northLatBound;

	}

};

LIBNOISE.model = {}
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
LIBNOISE.model.Line = function(sourceModule) {

	this.attenuate      = true;
	this.x0             = 0.0;
  this.x1             = 1.0;
	this.y0             = 0.0;
	this.y1             = 1.0;
	this.z0             = 0.0;
	this.z1             = 1.0;
	this.sourceModule   = sourceModule || null;

};

LIBNOISE.model.Line.prototype.getValue = function(p) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing module!');

	}

    var value = this.sourceModule.getValue(
	    (this.x1 - this.x0) * p + this.x0,
	    (this.y1 - this.y0) * p + this.y0,
	    (this.z1 - this.z0) * p + this.z0
	);

	return this.attenuate ? (p * (1.0 - p) * 4 * value) : value;

};
LIBNOISE.model.Plane = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

LIBNOISE.model.Plane.prototype.getValue = function(x, y) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing module!');

	}

	return this.sourceModule.getValue(x, 0, y);

};


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

LIBNOISE.module = 
{ combiner : {}
, generator : {}
, modifier : {}
, selector : {}
, transformer : {}
}
LIBNOISE.module.combiner.Add = function(sourceModules) {

	this.sourceModules = sourceModules || null;

};

LIBNOISE.module.combiner.Add.prototype.getValue = function(x, y, z) {


	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModules[0].getValue(x, y, z) + this.sourceModules[1].getValue(x, y, z);

};


LIBNOISE.module.combiner.Max = function(sourceModules) {

	this.sourceModules = sourceModules || null;

};

LIBNOISE.module.combiner.Max.prototype.getValue = function(x, y, z) {

	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module!');

	}

	return Math.max(
		this.sourceModules[0].getValue(x, y, z),
		this.sourceModules[1].getValue(x, y, z)
	);

};

LIBNOISE.module.combiner.Min = function(sourceModules) {

	this.sourceModules = sourceModules || null;

};

LIBNOISE.module.combiner.Min.prototype.getValue = function(x, y, z) {

	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module!');

	}

	return Math.min(
		this.sourceModules[0].getValue(x, y, z),
		this.sourceModules[1].getValue(x, y, z)
	);

};

LIBNOISE.module.combiner.Multiply = function(sourceModules) {

	this.sourceModules = sourceModules || null;

};

LIBNOISE.module.combiner.Multiply.prototype.getValue = function(x, y, z) {

	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModules[0].getValue(x, y, z) * this.sourceModules[1].getValue(x, y, z);

};

LIBNOISE.module.combiner.Power = function(sourceModules) {

	this.sourceModules = sourceModules || null;

};

LIBNOISE.module.combiner.Power.prototype.getValue = function(x, y, z) {

	if(!this.sourceModules.length < 2) {

		throw new Error('Invalid or missing source module!');

	}

	return Math.pow(
		this.sourceModules[0].getValue(x, y, z),
		this.sourceModules[1].getValue(x, y, z)
	);

};
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

LIBNOISE.module.generator.Billow.prototype.setFrequency = function(f){
  this.frequency = f
}
LIBNOISE.module.generator.Checkerboard = function() {};

LIBNOISE.module.generator.Checkerboard.prototype.getValue = function(x, y, z) {

	var ix = Math.floor(Libnoise.MathFuncs.makeInt32Range(x));
	var iy = Math.floor(Libnoise.MathFuncs.makeInt32Range(y));
	var iz = Math.floor(Libnoise.MathFuncs.makeInt32Range(z));

    return (ix & 1 ^ iy & 1 ^ iz & 1) ? -1.0 : 1.0;

};

LIBNOISE.module.generator.Const = function(v) {

	this.value = v || LIBNOISE.module.generator.Const.DEFAULT_CONST_VALUE;

};

LIBNOISE.module.generator.Const.DEFAULT_CONST_VALUE = 0.0;

LIBNOISE.module.generator.Const.prototype.getValue = function() {

	return this.value;

};

LIBNOISE.module.generator.Const.setValue = function(v){
  this.value = v
};

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
LIBNOISE.module.generator.RidgedMulti = function(frequency, lacunarity, octaves, seed, quality, offset, gain) {

	this.frequency  = frequency     || LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_FREQUENCY;
	this.lacunarity = lacunarity    || LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_LACUNARITY;
	this.octaves    = octaves       || LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_OCTAVE_COUNT;
	this.seed       = seed          || LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_SEED;
	this.quality    = quality       || LIBNOISE.NoiseGen.QUALITY_STD;
	this.offset     = offset        || LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_OFFSET;
	this.gain       = gain          || LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_GAIN;

};

LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_FREQUENCY    = 1.0;
LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_LACUNARITY   = 2.0;
LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_OCTAVE_COUNT = 6;
LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_SEED         = 0;
LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_OFFSET       = 1.0;
LIBNOISE.module.generator.RidgedMulti.DEFAULT_RIDGED_GAIN         = 2.0;
LIBNOISE.module.generator.RidgedMulti.RIDGED_MAX_OCTAVE           = 30;

LIBNOISE.module.generator.RidgedMulti.prototype = {

	get lacunarity() {

		return this._lacunarity;

	},

	set lacunarity(v) {

		this._lacunarity = v;

		var h           = 1.0;
		var frequency   = 1.0;

		this.weights    = [];

		for (var i = 0; i < LIBNOISE.module.generator.RidgedMulti.RIDGED_MAX_OCTAVE; i++) {

			// Compute weight for each frequency.
			this.weights[i]  = Math.pow(frequency, -h);
			frequency       *= this.lacunarity;

		}

	},

	getValue: function(x, y, z) {

		var nx, ny, nz, seed;

		var value   = 0.0;
		var signal  = 0.0;
		var weight  = 1.0;

		x           = parseFloat(x * this.frequency);
		y           = parseFloat(y * this.frequency);
		z           = parseFloat(z * this.frequency);

		for (var octave = 0; octave < this.octaves; octave++) {

			// Make sure that these floating-point values have the same range as a 32-
			// bit integer so that we can pass them to the coherent-noise functions.
			nx      = LIBNOISE.MathFuncs.makeInt32Range(x);
			ny      = LIBNOISE.MathFuncs.makeInt32Range(y);
			nz      = LIBNOISE.MathFuncs.makeInt32Range(z);

			// Get the coherent-noise value.
			seed    = (this.seed + octave) & 0x7fffffff;
			signal  = LIBNOISE.NoiseGen.gradientCoherentNoise3D(nx, ny, nz, seed, this.quality);

			// Make the ridges.
			signal  = Math.abs(signal);
			signal  = this.offset - signal;

			// Square the signal to increase the sharpness of the ridges.
			signal *= signal;

			// The weighting from the previous octave is applied to the signal.
			// Larger values have higher weights, producing sharp points along the
			// ridges.
			signal *= weight;

			// Weight successive contributions by the previous signal.
			weight  = signal * this.gain;

			// Clamp value to within 0 and 1
			weight  = LIBNOISE.Misc.clampValue(weight, 0.0, 1.0);

			// Add the signal to the output value.
			value  += (signal * this.weights[octave]);

			// Go to the next octave.
			x      *= this.lacunarity;
			y      *= this.lacunarity;
			z      *= this.lacunarity;

		}

		return (value * 1.25) - 1.0;

	}

};
LIBNOISE.module.generator.RidgedMulti.prototype.SetFrequency = function(f){
  this.frequency = f
};

LIBNOISE.module.generator.RidgedMulti.prototype.SetLacunarity = function(l){
  this.lacunarity = l
};

LIBNOISE.module.generator.RidgedMulti.prototype.SetOctaves = function(o){
  this.octaves = o
};

LIBNOISE.module.generator.RidgedMulti.prototype.SetPersistance = function(p){
  this.persist = p
};

LIBNOISE.module.generator.RidgedMulti.prototype.SetSeed = function(s){
  this.seed = s
};

LIBNOISE.module.generator.RidgedMulti.prototype.SetQuality = function(q){
  this.quality = q
};


LIBNOISE.module.generator.Spheres = function(frequency) {

	this.frequency = frequency || LIBNOISE.module.generator.Spheres.DEFAULT_SPHERES_FREQUENCY;
};

LIBNOISE.module.generator.Spheres.DEFAULT_SPHERES_FREQUENCY = 4.0;

LIBNOISE.module.generator.Spheres.prototype.getValue = function(x, y, z) {

	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z * this.frequency);

	var distFromCenter          = Math.sqrt(x * x + y * y + z * z);
	var distFromSmallerSphere   = distFromCenter - Math.floor(distFromCenter);
	var distFromLargerSphere    = 1.0 - distFromSmallerSphere;
	var nearestDist             = Math.min(distFromSmallerSphere, distFromLargerSphere);

	return 1.0 - (nearestDist * 4.0); // Puts it in the -1.0 to +1.0 range.

};

LIBNOISE.module.generator.Spheres.prototype.SetFrequency = function(f){
  this.frequency = f
};

LIBNOISE.module.generator.Voronoi = function(frequency, displacement, distance, seed) {

	this.frequency      = frequency     || LIBNOISE.module.generator.Voronoi.DEFAULT_VORONOI_FREQUENCY;
	this.displacement   = displacement  || LIBNOISE.module.generator.Voronoi.DEFAULT_VORONOI_DISPLACEMENT;
	this.distance       = distance      || false;
	this.seed           = seed          || LIBNOISE.module.generator.Voronoi.DEFAULT_VORONOI_SEED;

};

LIBNOISE.module.generator.Voronoi.DEFAULT_VORONOI_DISPLACEMENT    = 1.0;
LIBNOISE.module.generator.Voronoi.DEFAULT_VORONOI_FREQUENCY       = 1.0;
LIBNOISE.module.generator.Voronoi.DEFAULT_VORONOI_SEED            = 0;

LIBNOISE.module.generator.Voronoi.prototype.getValue = function(x, y, z) {

	// This method could be more efficient by caching the seed values.
	x = parseFloat(x * this.frequency);
	y = parseFloat(y * this.frequency);
	z = parseFloat(z * this.frequency);

	var xPos, yPos, zPos, xDist, yDist, zDist, dist;

	var xi          = parseInt(x);
	var yi          = parseInt(y);
	var zi          = parseInt(z);
	var xInt        = (x > 0.0 ? xi : xi - 1);
	var yInt        = (y > 0.0 ? yi : yi - 1);
	var zInt        = (z > 0.0 ? zi : zi - 1);
	var minDist     = 2147483647.0;
	var xCandidate  = 0;
	var yCandidate  = 0;
	var zCandidate  = 0;
	var value       = 0.0;

	// Inside each unit cube, there is a seed point at a random position.  Go
	// through each of the nearby cubes until we find a cube with a seed point
	// that is closest to the specified position.
	for (var zCur = zInt - 2; zCur <= zInt + 2; zCur++) {
		for (var yCur = yInt - 2; yCur <= yInt + 2; yCur++) {
			for (var xCur = xInt - 2; xCur <= xInt + 2; xCur++) {

				// Calculate the position and distance to the seed point inside of
				// this unit cube.
				xPos    = parseFloat(xCur + LIBNOISE.NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed));
				yPos    = parseFloat(yCur + LIBNOISE.NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed + 1));
				zPos    = parseFloat(zCur + LIBNOISE.NoiseGen.valueNoise3D(xCur, yCur, zCur, this.seed + 2));
				xDist   = parseFloat(xPos - x);
				yDist   = parseFloat(yPos - y);
				zDist   = parseFloat(zPos - z);
				dist    = parseFloat(xDist * xDist + yDist * yDist + zDist * zDist);

				if (dist < minDist) {
					// This seed point is closer to any others found so far, so record
					// this seed point.
					minDist     = dist;
					xCandidate  = xPos;
					yCandidate  = yPos;
					zCandidate  = zPos;
				}
			}
		}
	}

	if (this.distance) {
		// Determine the distance to the nearest seed point.
		xDist = xCandidate - x;
		yDist = yCandidate - y;
		zDist = zCandidate - z;
		value = (Math.sqrt(xDist * xDist + yDist * yDist + zDist * zDist)) * LIBNOISE.MathConsts.SQRT_3 - 1.0;
	}

	// Return the calculated distance with the displacement value applied.
	return value + (
		this.displacement * LIBNOISE.NoiseGen.valueNoise3D(
			parseInt(Math.floor(xCandidate)),
			parseInt(Math.floor(yCandidate)),
			parseInt(Math.floor(zCandidate))
		)
	);

};

LIBNOISE.module.generator.Voronoi.prototype.SetFrequency = function(f){
  this.frequency = f
};

LIBNOISE.module.generator.Voronoi.prototype.SetDisplacement = function(d){
  this.displacement = d
};

LIBNOISE.module.generator.Voronoi.prototype.SetSeed = function(s){
  this.seed = s
};



LIBNOISE.module.modifier.Abs = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

LIBNOISE.module.modifier.Abs.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return Math.abs(this.sourceModule.getValue(x, y, z));

};

LIBNOISE.module.modifier.Clamp = function(sourceModule, lowerBound, upperBound) {

	this.sourceModule   = sourceModule  || null;
	this.lowerBound     = lowerBound    || null;
	this.upperBound     = upperBound    || null;


};

LIBNOISE.module.modifier.Clamp.prototype = {

	get lowerBound() {

		return this._lowerBound;

	},

	set lowerBound(v) {

		if (v > this.upperBound) {

			throw new Error('Lower bound cannot exceed upper bound!');

		}

		this._lowerBound = v;

	},

	get upperBound() {

		return this._upperBound;

	},

	set upperBound(v) {

		if (v < this.lowerBound) {

			throw new Error('Upper bound cannot be less than lower bound!');

		}

		this._upperBound = v;

	},

	getValue: function(x, y, z) {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing source module!');

		}

		return Misc.clampValue(this.sourceModule.getValue(x, y, z), this.lowerBound, this.upperBound);

	},

	setBounds: function(lowerBound, upperBound) {

		this.upperBound = upperBound;
		this.lowerBound = lowerBound;

	}

};

LIBNOISE.module.modifier.Curve = function(sourceModule, controlPoints) {

	this.sourceModule   = sourceModule || null;
	this.controlPoints  = controlPoints|| [];

};

LIBNOISE.module.modifier.Curve.prototype.findInsertionPos = function(value) {

	value = parseFloat(value);

	for (var position = 0; position < this.controlPoints.length; position++) {

		if (value < this.controlPoints[position]) {

			// We found the array index in which to insert the new control point.
			// Exit now.
			break;

		} else if (value == this.controlPoints[position]) {

			// Each control point is required to contain a unique value, so throw
			// an exception.
			throw new Error('Invalid parameter');

		}

	}

	return position;

};

LIBNOISE.module.modifier.Curve.prototype.insertAtPos = function (position, input, output) {

	position = parseInt(position);
	input = parseFloat(input);
	output = parseFloat(output);

	// Make room for the new control point at the specified position within
	// the control point array.  The position is determined by the value of
	// the control point; the control points must be sorted by value within
	// that array.
	var newControlPoints = [];

	for (var i = 0; i < this.controlPoints.length; i++) {

		if (i < position) {

			newControlPoints[i] = this.controlPoints[i];

		} else {

			newControlPoints[i + 1] = this.controlPoints[i];

		}

	}

	this.controlPoints = newControlPoints;

	// Now that we've made room for the new control point within the array,
	// add the new control point.
	this.controlPoints[position] = [input, output];

};

LIBNOISE.module.modifier.Curve.prototype.addControlPoint = function(input, output) {

	input = parseFloat(input);
	output = parseFloat(output);

	// Find the insertion point for the new control point and insert the new
	// point at that position.  The control point array will remain sorted by
	// input value.
	this.insertAtPos(this.findInsertionPos(input), input, output);

};

LIBNOISE.module.modifier.Curve.prototype.getValue = function(x, y, z) {

	if (!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	if (!this.controlPoints.length >= 4) {

		throw new Error('Insufficient number of control points!');

	}

	// Get the output value from the source module.
	var value = this.sourceModule.getValue(x, y, z);

	// Find the first element in the control point array that has an input value
	// larger than the output value from the source module.
	for (var indexPos = 0; indexPos < this.controlPoints.length; indexPos++) {

		if (value < this.controlPoints[indexPos][0]) {

			break;

		}

	}

	// Find the four nearest control points so that we can perform cubic
	// interpolation.
	var index0 = Misc.clampValue(indexPos - 2, 0, this.controlPoints.length - 1);
	var index1 = Misc.clampValue(indexPos - 1, 0, this.controlPoints.length - 1);
	var index2 = Misc.clampValue(indexPos, 0, this.controlPoints.length - 1);
	var index3 = Misc.clampValue(indexPos + 1, 0, this.controlPoints.length - 1);

	// If some control points are missing (which occurs if the value from the
	// source module is greater than the largest input value or less than the
	// smallest input value of the control point array), get the corresponding
	// output value of the nearest control point and exit now.
	if (index1 == index2) {

		return this.controlPoints[index1][1];

	}

	// Compute the alpha value used for cubic interpolation.
	var input0 = this.controlPoints[index1][0];
	var input1 = this.controlPoints[index2][0];
	var alpha = (value - input0) / (input1 - input0);

	// Now perform the cubic interpolation given the alpha value.
	return Interpolation.cubic(
		this.controlPoints[index0][1],
		this.controlPoints[index1][1],
		this.controlPoints[index2][1],
		this.controlPoints[index3][1],
		alpha
	);

};

LIBNOISE.module.modifier.Exponent = function(sourceModule, exponent) {

	this.sourceModule   = sourceModule  || null;
	this.exponent       = exponent      || 1

};

LIBNOISE.module.modifier.Exponent.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return Math.pow(Math.abs((this.sourceModule.getValue(x, y, z) + 1.0) / 2.0), this.exponent) * 2.0 - 1.0;

};

LIBNOISE.module.modifier.Invert = function(sourceModule) {

	this.sourceModule = sourceModule || null;

};

LIBNOISE.module.modifier.Invert.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return -this.sourceModule.getValue(x, y, z);

};

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

LIBNOISE.module.modifier.ScaleBias.prototype.SetScale = function(s){
  this.scale = s
};

LIBNOISE.module.modifier.ScaleBias.prototype.SetBias = function(b){
  this.bias = b
};

LIBNOISE.module.modifier.Terrace = function(sourceModule, controlPoints, invert) {

	this.sourceModule   = sourceModule  || null;
	this.controlPoints  = controlPoints || [];
	this.invert         = invert        || false;

};

LIBNOISE.module.modifier.Terrace.prototype.findInsertionPos = function(value) {

	value = parseFloat(value);

	for (var insertionPos = 0; insertionPos < this.controlPoints.length; insertionPos++) {

		if (value < this.controlPoints[insertionPos]) {

			// We found the array index in which to insert the new control point.
			// Exit now.
			break;

		} else if (value == this.controlPoints[insertionPos]) {

			// Each control point is required to contain a unique value, so throw
			// an exception.
			throw new Error('Invalid parameter');

		}

	}

	return insertionPos;

};

LIBNOISE.module.modifier.Terrace.prototype.insertAtPos = function (insertionPos, value) {

	insertionPos    = parseInt(insertionPos);
	value           = parseFloat(value);

	// Make room for the new control point at the specified position within
	// the control point array.  The position is determined by the value of
	// the control point; the control points must be sorted by value within
	// that array.
	var newControlPoints = [];

	for (var i = 0; i < this.controlPoints.length; i++) {

		if (i < insertionPos) {

			newControlPoints[i] = this.controlPoints[i];

		} else {

			newControlPoints[i + 1] = this.controlPoints[i];

		}

	}

	this.controlPoints = newControlPoints;

	// Now that we've made room for the new control point within the array,
	// add the new control point.
	this.controlPoints[insertionPos] = value;

};

LIBNOISE.module.modifier.Terrace.prototype.addControlPoint = function(value) {

	value = parseFloat(value);

	// Find the insertion point for the new control point and insert the new
	// point at that position.  The control point array will remain sorted by
	// value.
	this.insertAtPos(this.findInsertionPos(value), value);

};

LIBNOISE.module.modifier.Terrace.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	// Get the output value from the source module.
	var sourceModuleValue = this.sourceModule.getValue(x, y, z);

	// Find the first element in the control point array that has a value
	// larger than the output value from the source module.
	for (var indexPos = 0; indexPos < this.controlPoints.length; indexPos++) {

		if (sourceModuleValue < this.controlPoints[indexPos]) {

			break;

		}

	}

	// Find the two nearest control points so that we can map their values
	// onto a quadratic curve.
	var index0 = LIBNOISE.Misc.clampValue(indexPos - 1, 0, this.controlPoints.length - 1);
	var index1 = LIBNOISE.Misc.clampValue(indexPos, 0, this.controlPoints.length - 1);

	// If some control points are missing (which occurs if the output value from
	// the source module is greater than the largest value or less than the
	// smallest value of the control point array), get the value of the nearest
	// control point and exit now.
	if (index0 == index1) {

		return this.controlPoints[index1];

	}

	// Compute the alpha value used for linear interpolation.
	var value0 = this.controlPoints[index0];
	var value1 = this.controlPoints[index1];
	var alpha = (sourceModuleValue - value0) / (value1 - value0);

	if (this.invert) {

		var swapped = LIBNOISE.Misc.swapValues([value0, value1]);

		alpha -= 1.0;
		value0 = swapped[0];
		value1 = swapped[1];

	}

	// Squaring the alpha produces the terrace effect.
	alpha *= alpha;

	// Now perform the linear interpolation given the alpha value.
	return LIBNOISE.Interpolation.linear(value0, value1, alpha);

};

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


LIBNOISE.module.selector.Select = function(sourceModules, controlModule, edge, lowerBound, upperBound) {

	this.sourceModules  = sourceModules || [];
	this.controlModule  = controlModule || null;
	this.edge           = edge          || LIBNOISE.module.selector.Select.DEFAULT_SELECT_EDGE_FALLOFF;
	this.lowerBound     = lowerBound    || LIBNOISE.module.selector.Select.DEFAULT_SELECT_LOWER_BOUND;
	this.upperBound     = upperBound    || LIBNOISE.module.selector.Select.DEFAULT_SELECT_UPPER_BOUND;

};

LIBNOISE.module.selector.Select.DEFAULT_SELECT_EDGE_FALLOFF  = 0.0;
LIBNOISE.module.selector.Select.DEFAULT_SELECT_LOWER_BOUND   = -1.0;
LIBNOISE.module.selector.Select.DEFAULT_SELECT_UPPER_BOUND   = 1.0;

LIBNOISE.module.selector.Select.prototype = {

	get edge() {

		return this._edge;

	},

	set edge(v) {

		// Make sure that the edge falloff curves do not overlap.
		var size = this.upperBound - this.lowerBound;
		var half = size / 2;

		this._edge = (v > half) ? half : v;

	},

	get lowerBound() {

		return this._lowerBound;

	},

	set lowerBound(v) {

		if (v > this.upperBound) {

			throw new Error('Lower bound cannot exceed upper bound!');

		}

		this._lowerBound = v;

	},

	get upperBound() {

		return this._upperBound;

	},

	set upperBound(v) {

		if (v < this.lowerBound) {

			throw new Error('Upper bound cannot be less than lower bound!');

		}

		this._upperBound = v;

	},

	setBounds: function(lower, upper) {

		this.upperBound = upper;
		this.lowerBound = lower;

	},

	getValue: function(x, y, z) {

		if (!this.sourceModules.length < 2) {

			throw new Error('Invalid or missing source module(s)!');

		}

		if (!this.controlModule) {

			throw new Error('Invalid or missing control module!');

		}

		var lowerCurve, upperCurve;
		var controlValue = this.controlModule.getValue(x, y, z);

		if (this.edge > 0.0) {

			if (controlValue < (this.lowerBound - this.edge)) {

				// The output value from the control module is below the selector
				// threshold; return the output value from the first source module.
				return this.sourceModules[0].getValue(x, y, z);

			} else if (controlValue < (this.lowerBound + this.edge)) {

				// The output value from the control module is near the lower end of the
				// selector threshold and within the smooth curve. Interpolate between
				// the output values from the first and second source modules.
				lowerCurve = parseFloat(this.lowerBound - this.edge);
				upperCurve = parseFloat(this.lowerBound + this.edge);

				return LIBNOISE.Interpolation.linear(
					this.sourceModules[0].getValue(x, y, z),
					this.sourceModules[1].getValue(x, y, z),
					LIBNOISE.Interpolation.cubicSCurve((controlValue - lowerCurve) / (upperCurve - lowerCurve))
				);

			} else if (controlValue < (this.upperBound - this.edge)) {

				// The output value from the control module is within the selector
				// threshold; return the output value from the second source module.
				return this.sourceModules[1].getValue(x, y, z);

			} else if (controlValue < (this.upperBound + this.edge)) {

				// The output value from the control module is near the upper end of the
				// selector threshold and within the smooth curve. Interpolate between
				// the output values from the first and second source modules.
				lowerCurve = parseFloat(this.upperBound - this.edge);
				upperCurve = parseFloat(this.upperBound + this.edge);

				return LIBNOISE.Interpolation.linear(
					this.sourceModules[1].getValue(x, y, z),
					this.sourceModules[0].getValue(x, y, z),
					LIBNOISE.Interpolation.cubicSCurve((controlValue - lowerCurve) / (upperCurve - lowerCurve))
				);

			}

			// Output value from the control module is above the selector threshold;
			// return the output value from the first source module.
			return this.sourceModules[0].getValue(x, y, z);

		} else {

			return (controlValue < this.lowerBound || controlValue > this.upperBound)
				? this.sourceModules[0].getValue(x, y, z)
				: this.sourceModules[1].getValue(x, y, z);

		}


	}

};


LIBNOISE.module.transformer.Displace = function(sourceModule, xModule, yModule, zModule) {

	this.sourceModule   = sourceModule  || null;
	this.xModule        = xModule       || null;
	this.yModule        = yModule       || null;
	this.zModule        = zModule       || null;

};

LIBNOISE.module.transformer.Displace.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	if(!this.xModule || !this.yModule || !this.zModule) {

		throw new Error('Invalid or missing displacement module(s)!');

	}

	return this.sourceModule.getValue(
		x + this.xModule.getValue(x, y, z),
		y + this.yModule.getValue(x, y, z),
		z + this.zModule.getValue(x, y, z)
	);

};


LIBNOISE.module.transformer.RotatePoint = function(sourceModule, xAngle, yAngle, zAngle) {

	this.x1matrix       = null;
	this.x2matrix       = null;
	this.x3matrix       = null;
	this.y1matrix       = null;
	this.y2matrix       = null;
	this.y3matrix       = null;
	this.z1matrix       = null;
	this.z2matrix       = null;
	this.z3matrix       = null;
	this.sourceModule   = sourceModule  || null;
	this.xAngle         = xAngle        || LIBNOISE.module.transformer.RotatePoint.DEFAULT_ROTATE_X;
	this.yAngle         = yAngle        || LIBNOISE.module.transformer.RotatePoint.DEFAULT_ROTATE_Y;
	this.zAngle         = zAngle        || LIBNOISE.module.transformer.RotatePoint.DEFAULT_ROTATE_Z;

	this.calcMatrices();

};

LIBNOISE.module.transformer.RotatePoint.DEFAULT_ROTATE_X = 0.0;
LIBNOISE.module.transformer.RotatePoint.DEFAULT_ROTATE_Y = 0.0;
LIBNOISE.module.transformer.RotatePoint.DEFAULT_ROTATE_Z = 0.0;

LIBNOISE.module.transformer.RotatePoint.prototype = {

	get xAngle() {

		return this._xAngle;

	},

	set xAngle(v) {

		this._xAngle = parseFloat(v);

		this.calcMatrices();

	},

	get yAngle() {

		return this._yAngle;

	},

	set yAngle(v) {

		this._yAngle = parseFloat(v);

		this.calcMatrices();

	},

	get zAngle() {

		return this._zAngle;

	},

	set zAngle(v) {

		this._zAngle = parseFloat(v);

		this.calcMatrices();

	},

	calcMatrices: function() {

		var xCos = Math.cos(this.xAngle * LIBNOISE.MathConsts.DEG_TO_RAD);
		var yCos = Math.cos(this.yAngle * LIBNOISE.MathConsts.DEG_TO_RAD);
		var zCos = Math.cos(this.zAngle * LIBNOISE.MathConsts.DEG_TO_RAD);
		var xSin = Math.sin(this.xAngle * LIBNOISE.MathConsts.DEG_TO_RAD);
		var ySin = Math.sin(this.yAngle * LIBNOISE.MathConsts.DEG_TO_RAD);
		var zSin = Math.sin(this.zAngle * LIBNOISE.MathConsts.DEG_TO_RAD);

		this.x1matrix = ySin * xSin * zSin + yCos * zCos;
		this.y1matrix = xCos * zSin;
		this.z1matrix = ySin * zCos - yCos * xSin * zSin;
		this.x2matrix = ySin * xSin * zCos - yCos * zSin;
		this.y2matrix = xCos * zCos;
		this.z2matrix = -yCos * xSin * zCos - ySin * zSin;
		this.x3matrix = -ySin * xCos;
		this.y3matrix = xSin;
		this.z3matrix = yCos * xCos;

	},

	getValue: function(x, y, z) {

		if (!this.sourceModule) {

			throw new Error('Invalid or missing source module!');

		}

		return this.sourceModule.getValue(
			(this.x1matrix * x) + (this.y1matrix * y) + (this.z1matrix * z),
			(this.x2matrix * x) + (this.y2matrix * y) + (this.z2matrix * z),
			(this.x3matrix * x) + (this.y3matrix * y) + (this.z3matrix * z)
		);

	},

	setAngles: function(xAngle, yAngle, zAngle) {

		this.xAngle = xAngle;
		this.yAngle = yAngle;
		this.zAngle = zAngle;
	}

};
LIBNOISE.module.transformer.ScalePoint = function(sourceModule, xScale, yScale, zScale) {

	this.sourceModule   = sourceModule  || null;
	this.xScale         = xScale        || ScalePoint.DEFAULT_SCALE_POINT_X;
	this.yScale         = yScale        || ScalePoint.DEFAULT_SCALE_POINT_Y;
	this.zScale         = zScale        || ScalePoint.DEFAULT_SCALE_POINT_Z;

};

LIBNOISE.module.transformer.ScalePoint.DEFAULT_SCALE_POINT_X = 1.0;
LIBNOISE.module.transformer.ScalePoint.DEFAULT_SCALE_POINT_Y = 1.0;
LIBNOISE.module.transformer.ScalePoint.DEFAULT_SCALE_POINT_Z = 1.0;

LIBNOISE.module.transformer.ScalePoint.prototype.setScales = function(xScale, yScale, zScale) {

	xScale = parseFloat(xScale);
	yScale = parseFloat(yScale);
	zScale = parseFloat(zScale);

	this.xScale = xScale;
	this.yScale = yScale;
	this.zScale = zScale;
};

LIBNOISE.module.transformer.ScalePoint.prototype.getValue = function(x, y, z) {

	if (!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModule.getValue(
		x * this.xScale,
		y * this.yScale,
		z * this.zScale
	);

};

LIBNOISE.module.transformer.TranslatePoint = function(sourceModule, translateX, translateY, translateZ) {

	this.sourceModule   = sourceModule  || null;
	this.translateX     = translateX    || 0;
	this.translateY     = translateY    || 0;
	this.translateZ     = translateZ    || 0;

};

LIBNOISE.module.transformer.TranslatePoint.prototype.setTranslation = function(x, y, z) {

	this.translateX = x;
	this.translateY = y;
	this.translateZ = z;

};

LIBNOISE.module.transformer.TranslatePoint.prototype.getValue = function(x, y, z) {

	if(!this.sourceModule) {

		throw new Error('Invalid or missing source module!');

	}

	return this.sourceModule.getValue(
		x + this.translateX,
		y + this.translateY,
		z + this.translateZ
	);

};

