const _ = require('underscore');

var Effects = function(){
  this.get = function(name){
    if (_(this.library).has(name)) {
      var hash = this.library[name]
      return this.instantiate(hash);
    } else {
      console.log(`No such effect named "${name}"`);
      return null;
    }
  }

  this.create = function(name, hash){
    this.library[name] = hash;
    return this.instantiate(hash);
  }

  this.remove = function(name){
    this.library[name] = null;
  }

  this.extend = function(name) { // (name, hash) || (name, newName, hash)
    var newName, hash, baseHash, newHash;
    // newName or hash:
    if (typeof arguments[1] === 'string') {
      newName = arguments[1];
      hash = arguments[2];
    } else {
      hash = arguments[1];
    }

    baseHash = this.get(name);
    newHash = baseHash;

    // merge new effect props into old effect
    _(Object.keys(hash)).forEach(function(prop) {
      newHash[prop] = hash[prop];
    })

    // if given name, save new effect to library
    if (newName) {
      return this.create(newName, newHash);
    }

    return this.instantiate(newHash);
  }

  this.library = { };

  this.instantiate = function(hash) {
    var newHash = _.deepClone(hash);
    // reinstate all functions lost through deep cloning;
    newHash.easing = hash.easing;
    newHash.valueFeeder = hash.valueFeeder;
    newHash.start = hash.start;
    newHash.update = hash.update;
    newHash.complete = hash.complete;
    newHash.allDone = hash.allDone;

    return newHash
  };

  // ----------  SETUP  ----------
  // default effects;

  this.create("fadeIn", {
    fromOpacity: 0,
    opacity: 1,
    easing: function easeOutCubic(t) { return 1+(--t)*t*t }
  });
  this.create("fadeOut", {
    fromOpacity: 1,
    opacity: 0,
    easing: function easeOutCubic(t) { return 1+(--t)*t*t }
  });
  this.create("none", {});
  this.create("hidden", {
    fromOpacity: 0,
    opacity: 0
  });
  this.create("hiddenGif", {
    fromOpacity: 0.001,
    opacity: 0.001
  });
}

module.exports = Effects;
