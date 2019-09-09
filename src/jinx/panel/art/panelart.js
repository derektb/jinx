const $ = require('jquery');
const _ = require('underscore');
const ArtAsset = require('ArtAsset');

var PanelArt = function(panelName){
  const art = this;

  this.__ignoreRoot = false;
  this.ignoreRoot = function () {
    this.__ignoreRoot = true;
  }

  this.__path = "";
  this.path = function(p) {
    if(p) { // set path
      this.__path = p;
    } else { // get path
      return this.__path;
    }
  }

  // this.assets = {};
  this.assetStore = {};
  this._preloadingImages = []; // somewhere to persist the images that get preloaded

  this.artLayers = [];

  this.layers = function() {
    const layerNames = [...arguments];

    if (layerNames.length) {
      // setup layers
      this.artLayers = layerNames;
    } else {
      return [].concat(this.artLayers); // return a copy, not the actual thing.
    }
  }

  this.createAsset = function(data) {
    const useRootArtPath = !art.__ignoreRoot;
    var path;

    if (data.path === undefined) {
      path = art.path();
    } else if (!data.path) {
      path = "";
    } else {
      path = data.path;
    }

    data.path = path,
    data.useRoot = (data.useRoot === undefined) ? useRootArtPath : data.useRoot;

    this.assetStore[data.name] = new ArtAsset(data)
  }

  this.assets = function(){
    if (!arguments) {
      // return an array of all assets
      const assets = Object.keys(this.assetStore);
      const arrayOfAllAssets = assets.map(key=>{ return this.assetStore[key] });
      return arrayOfAllAssets;
    } else {
      // create assets from arguments
      const assetData = [...arguments];
      assetData.forEach(data=>{
        if (_(data).isArray()) {
          this.createAsset({
            name: data[0],
            src:  data[1]
          });
        } else {
          art.createAsset(data);
        }
      })
    }
  }

  this.getAsset = function(name) {
    return this.assetStore[name];
  }

  this.preloadAssets = function() {
    const assets = Object.keys(this.assetStore)
    assets.forEach(key=>{
      let img = new Image();
      const imgSrc = this.assetStore[key].path();
      img.src = imgSrc;
      this._preloadingImages.push(img);
    });
    // TODO: more support for
  }
}

module.exports = PanelArt;
