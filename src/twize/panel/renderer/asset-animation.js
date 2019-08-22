var $ = require('jquery');
var _ = require('underscore');

var AssetAnimation = function(name, layer, id) {
  // CONSTRUCTOR ERRORS
  if (name === "panel") {

    this.asset = "panel";
  } else if (!name || !layer || !id) {
    throw new Error("AssetAnimation must be created with (assetName, layerName, assetId) specified.  You passed: "+name+", "+layer+", "+id+".")
  } else {
    this.asset = {
      name: name,
      layer: layer,
      id: id
    }
  }

  this.shouldRemove = false; // will be set to true if asset should be removed at end

  this.beats = [];

  this.addBeat = function(hash, seqel) {
    var requiredProperties = ["startTime","endTime","action","duration"]
    var hasRequiredProperties = _(hash).hasAll(requiredProperties);

    if (hasRequiredProperties) {
      if(hash.action === "remove") {
        // may as well consign this asset to its fate
        this.shouldRemove = true;
      }

      // get effect from seqel: this is the basis of the new beat
      var newBeat = this.getSeqelEffect(seqel);

      // calculate timing for the new beat
      if (this.beats.length) {
        var finalBeat = _(this.beats).last();
        // if this is a subsequent beat, then we calculate its time relatively:
        var relativeStart = hash.startTime - (finalBeat.absoluteEndTime);

        if (relativeStart < 0) {
          throw new Error(`New beat for asset ${this.asset.name}[${this.asset.id}] begins before the previous beat has ended.  This is probably due to a bad animation sync configuration leading to two simultaneous effects.`)
        }

        newBeat.delay =     relativeStart;
        newBeat.duration =  hash.duration;
      } else {
        newBeat.delay =     hash.startTime;
        newBeat.duration =  hash.duration
      }
      newBeat.absoluteEndTime = hash.endTime;

      // xy
      // effect position is relative, seqel.xy is absolute
      if (_.isArray(newBeat.fromPosition)) {
        if(newBeat.fromPosition.length === 2) {
          newBeat.fromPosition.push(0);
        }
      } else {
        newBeat.fromPosition = seqel.xy ? [0,0,0] : undefined;
      }
      if (_.isArray(newBeat.position)) {
        if(newBeat.position.length === 2) {
          newBeat.position.push(0);
        }
      } else {
        newBeat.position = seqel.xy ? [0,0,0] : undefined;
      }

      if(seqel.xy) {
        _(seqel.xy).each(function(val,i) {
          newBeat.position[i] += val;
          newBeat.fromPosition[i] += val;
        })
      }

      // code
      if(hash.action === "code") {
        newBeat.start = seqel.code;
      }

      this.beats.push(newBeat);
    } else {
      throw new Error("Required properties not passed to AssetAnimation.addBeat.  These properties are required: "+requiredProperties);
    }
  }

  this.getSeqelEffect = function(seqel) {
    let effect = seqel.effect;

    if ( _.isString(effect) ) {
      return twize.effects.get(effect)
    } else if ( _.isPojo(effect) ) {
      return twize.effects.instantiate(effect); // otherwise we'll be manipulating the seqel's effect directly :X
    }
  }
}

module.exports = AssetAnimation;
