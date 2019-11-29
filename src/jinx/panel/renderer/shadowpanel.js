'use strict'
var _ = require('underscore');
const $ = require('jquery');
const ShadowAsset = require('ShadowAsset');
const ShadowLayer = require('ShadowLayer');

/**
 An object representing the state of displayed assets in the displayed panel.
 As assets are added and removed from the DOM Panel, assets are also added to
 and removed from the Shadow Panel.

 Relies on Shadow Layer and Shadow Asset modules.

 @class ShadowPanel
 @constructor
**/

var ShadowPanel = function(id) {
  /**
   @property _layers

   The private container in which the ShadowPanel's layer objects are stored
  **/

  this._layers = {};

  /**
   @property _loadingAssets

   A container for all the assets which have been instantiated but have not
   yet been loaded.
  **/

  this._loadingAssets = [];

  /**
   @property rendererId

   When a shadowPanel is created by the renderer, the renderer gives it its
   ID number, so that the ShadowPanel can send it smoke signals.
  **/

  this.rendererId = id;

  /**
   @method layer

   Gets a layer from the shadowPanel.
  **/

  this.layer = function(layerName) {
    var layer = this._layers[layerName];
    if(layer) {
      return layer;
    } else {
      return undefined;
    }
  }

  /**
   @method asset

   Finds the first instance of an asset matching the query param anywhere
   in the ShadowPanel.
  **/

  this.asset = function(assetNameOrId, includeLayer) {
    var asset, layer, results;

    layer = _.find(this._layers, function(l) {
      var foundAsset = l.asset(assetNameOrId);
      if(foundAsset) {
        asset = foundAsset;
        return true;
      } else {
        return false;
      }
    })

    if (includeLayer) {
      results = {asset: asset, layer: layer};
    } else {
      results = asset;
    }

    return results;
  }

  /**
   @method createLayerInstance

   Specialized layer creation.
  **/

  this.createLayerInstance = function(layerName) {
    if (!layerName) {
      throw new Error("A name must be defined for the layer to be created.")
    }
    if(this.layer(layerName)) {
      throw new Error("That layer already exists in the shadow panel.")
    }

    var newLayer;

    // newLayer = this._layerConstructor(layerName);
    newLayer = new ShadowLayer(layerName);
    this._layers[layerName] = newLayer;

    return newLayer;
  }

  this.assetInstantiated = function(ref) {
    ref.instantiated = true;
    this._loadingAssets.push(ref);
  }

  this.assetLoaded = function(ref) {
    ref.loaded = true;
    const withoutLoaded = _(this._loadingAssets).filter(function(item){
      return !item.loaded;
    });

    this._loadingAssets = withoutLoaded;

    this._completeLoading();
  }

  this.assetLoadError = function(ref) {
    this._loadingAssets = _(this._loadingAssets).without(ref);
    console.log("Asset \'"+ref.name+" ("+ref.id+")\' on layer "+ref.layer+" failed to load.")

    this._completeLoading();
  }

  this._completeLoading = function() {
    if(!this._loadingAssets.length) {
      return $(document).trigger('all-assets-loaded', {rendererId: this.rendererId});
    }
  }
}

module.exports = ShadowPanel;
