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
