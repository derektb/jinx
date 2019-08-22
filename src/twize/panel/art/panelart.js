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
    // couldn't find a good regex for this on short notice so we just trust you
    if(p) {
      this.__path = p;
    } else {
      return this.__path;
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

    this.assets[data.name] = new ArtAsset(data)
  }
  this.assets = {};
}

module.exports = PanelArt;
