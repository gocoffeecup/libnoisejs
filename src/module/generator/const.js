LIBNOISE.module.generator.Const = function(v) {

	this.value = v || LIBNOISE.module.generator.Const.DEFAULT_CONST_VALUE;

};

LIBNOISE.module.generator.Const.DEFAULT_CONST_VALUE = 0.0;

LIBNOISE.module.generator.Const.prototype.getValue = function() {

	return this.value;

};
