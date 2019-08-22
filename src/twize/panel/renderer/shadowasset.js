const _ = require('underscore');

var ShadowAsset = function(assetName, layerName, id) {
  if (!(name && layer && id))

  this.name = assetName;
  this.layer = layerName;
  this.id = id;

  this.instantiated = false;
  this.loaded = false;
}

module.exports = ShadowAsset
