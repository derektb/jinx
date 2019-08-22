const _ = require('underscore');
const ShadowAsset = require('ShadowAsset');

var ShadowLayer = function(name) {
  var newLayerObject = {};

  this.name = name;
  this._assets = [];

  this.asset = function(assetNameOrId) {
    var asset, assetByName, assetById;

    // by id
    asset = _.find(this._assets, function(asset) { return asset.id === assetNameOrId });
    if (!asset){
      // by name
      asset = _.find(this._assets, function(asset) { return asset.name === assetNameOrId });
    }

    return asset;
  }

  this.assets = function() {
    return this._assets;
  }

  this.createAssetInstance = function(assetName) {
    var tp = assetName+"__"+_.thumbprint(7);
    var newAsset = new ShadowAsset(assetName, this.name, tp);

    this._assets.push(newAsset);

    return newAsset;
  }

  this.removeAssetInstance = function(assetNameOrId) {
    this._assets = _(this._assets).without(this.asset(assetNameOrId));

    return this;
  }
}

module.exports = ShadowLayer;
