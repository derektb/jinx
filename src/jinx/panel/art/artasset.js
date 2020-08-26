const $ = require('jquery');
const _ = require('underscore');

var ArtAsset = function(data){
  const jinx = window.jinx;

  this.name = data.name;
  this.type = data.type;
  if (!this.type) {
    if (data.text) this.type = "text";
    else {
      this.type = "image"
    }
  }

  // image assets:
  if (_.or(this.type, "image", "asset")) {
    this.src = data.src;
    this.path = data.path;
    this.useRoot = data.useRoot;
  } else {
    this.text = data.text;
  }
  this.size = data.size;

  this.classNames = data.classNames;

  this.getSrc = function() {
    var root, path, filename;
    filename = this.src;
    path = this.path;
    root = (this.useRoot) ? jinx.settings.get("rootArtPath") : "";
    return root + path + filename;
  }
}

module.exports = ArtAsset;
