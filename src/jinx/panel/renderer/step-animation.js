'use strict'
var $ = require('jquery');
var _ = require('underscore');
const AssetAnimation = require('AssetAnimation');
const ShadowPanel = require('ShadowPanel');
const Seqel = require('Seqel');

var StepAnimation = function(step, shadowPanel) {
  var step = step; // this is an array of seqels
  var panel  = this.panel  = shadowPanel || new ShadowPanel();
  var timing = this.timing = {
    with: 0,
    after: 0,
    end: 0
  };
  var assets = this.assets = [];

  /** ASSETANIMATION MANAGEMENT **/

  var createAssetAnimation = this.createAssetAnimation = function(ref) {
    var assetAnimation;

    if (ref === "panel") {
      assetAnimation = new AssetAnimation("panel");
    } else {
      assetAnimation = new AssetAnimation(ref.name, ref.layer, ref.id)
    }

    assets.push(assetAnimation);

    return assetAnimation;
  }

  var getAssetAnimation = this.getAssetAnimation = function(ref) {
    var ref, seqel, timing, assetAnimation;

    if (ref === "panel") { // special case

      assetAnimation = _(assets).find(function(animationAssetRecord){
        return animationAssetRecord.asset === "panel";
      })
    } else { // usual case
      assetAnimation = _(assets).find(function(animationAssetRecord){
        return animationAssetRecord.asset.id === ref.id;
      })
    }

    if (!assetAnimation) {
      assetAnimation = createAssetAnimation(ref);
    }
    return assetAnimation
  }

  /*  */

  var addArtToLayer = this.addArtToLayer = function(seqel) {
    var ref, assetAnimation;
    ref = createRef(seqel);
    assetAnimation = createAssetAnimation(ref);
    addBeatTo(assetAnimation, seqel, "add");
    return assetAnimation;
  }

  var removeArtFromLayer = this.removeArtFromLayer = function(seqel) {
    var ref, assetAnimation;

    ref = getRef(seqel)
    assetAnimation = getAssetAnimation(ref);
    addBeatTo(assetAnimation, seqel, 'remove');
    removeRef(ref);
  }

  var removeAllArtFromLayer = this.removeAllArtFromLayer = function(seqel) {
    var refs, assetAnimations, i;

    refs = refsOnLayer(seqel.layer);
    assetAnimations = []
    _(refs).each(function(ref){
      assetAnimations.push(getAssetAnimation(ref));
    });
    for(i = 0; i < assetAnimations.length; i++) {
      var s = seqel;
      var assetAnimation;
      assetAnimation = assetAnimations[i]

      if(i>0) {
        s = _.clone(seqel);
        s.delay = 0;
        s.sync = 'with'
      }

      addBeatTo(assetAnimation, s, 'remove');
      removeRef(assetAnimation.asset);
    }
  }

  var effectArtOnLayer = this.effectArtOnLayer = function(seqel) {
    var ref, assetAnimation;
    ref = getRef(seqel);
    assetAnimation = getAssetAnimation(ref);
    addBeatTo(assetAnimation, seqel, "effect");
    return assetAnimation;
  }

  var codeBeat = this.codeBeat = function(seqel) {
    var assetAnimation = getAssetAnimation("panel");
    addBeatTo(assetAnimation, seqel, "code");
  }

  /** BEAT MANAGEMENT **/

  var addBeatTo = this.addBeatTo = function(assetAnimation, seqel, action) {
    var delay, duration;
    // okay, *I* like this solution?
    // But I KNOW it's bad and not where this should happen.
    if ( !(delay = seqel.delay ? seqel.delay : undefined) ) {
      delay = seqel.effect.delay ? seqel.effect.delay : jinx.getDefault('delay');
    }
    if ( !(duration = seqel.duration ? seqel.duration : undefined) ) {
      duration = seqel.effect.duration ? seqel.effect.duration : jinx.getDefault('duration');
    }
    // I'm just doing my best here.

    var startAnimating = getBeatSync(seqel.sync) + delay;
    var endAnimating = startAnimating + duration;

    var hash = {
      action: action,
      startTime: startAnimating,
      endTime: endAnimating,
      duration: duration
    }
    assetAnimation.addBeat(hash, seqel);
    if (seqel.sync != 'async'){
      updateTiming(startAnimating,endAnimating);
    }
  }

  var getBeatSync = this.getBeatSync = function(sync) {
    var beginning;

    if (sync === "async") {
      beginning = 0;
    } else {
      beginning = timing[sync];
    }

    return beginning;
  }

  var updateTiming = this.updateTiming = function(newWith,newAfter) {
    timing.with = newWith;
    timing.after = newAfter;

    if (newAfter > timing.end) {
      timing.end = newAfter;
    }
  }

  /** REF MANAGEMENT **/

  var getRef = this.getRef = function(param) {
    var assetId, seqel, art, layer, assetLayer, results;

    if(_(param).isNumber()) {
      assetId = param;
      results = panel.asset(assetId);
    } else {
      if (_(param).hasAll(["art","layer"])) {
        seqel = param;
      } else {
        return undefined;
      }

      art   = seqel.art;
      layer = seqel.layer;
      assetLayer = panel.layer(layer);

      if (!assetLayer) {
         createRef(seqel);
      } else {
        results = assetLayer.asset(seqel.art) || assetLayer.createAssetInstance(seqel.art);
      }
    }

    return results;
  }

  var refsOnLayer = this.refsOnLayer = function(layer) {
    var assetLayer, results;

    assetLayer = panel.layer(layer);
    results = assetLayer.assets();

    return results;
  }

  var createRef = this.createRef = function(seqel) {
    var ref, refLayer;

    refLayer = panel.layer(seqel.layer) || panel.createLayerInstance(seqel.layer);
    ref = refLayer.createAssetInstance(seqel.art);

    return ref;
  }

  var removeRef = this.removeRef = function(ref) {
    var layer, id;
      layer = ref.layer;
      id = ref.id;

    panel.layer(layer).removeAssetInstance(id);
  }

  /* MAIN CONSTRUCTION */

  _(step).each(_(function(seqel){
    if(seqel.apply === "effect") {
      this.effectArtOnLayer(seqel);
    } else if(seqel.apply === "code") {

      this.codeBeat(seqel);
    } else if(seqel.apply === "add") {
      this.addArtToLayer(seqel);
    } else if (seqel.apply === "remove") {
      if(seqel.art) {
        this.removeArtFromLayer(seqel);
      } else {
        this.removeAllArtFromLayer(seqel);
      }
    } else if (seqel.apply === "replace") {
      var removeSeqel = _.clone(seqel);
      removeSeqel.effect = seqel.effect[0]
      var addSeqel = _.clone(seqel)
      addSeqel.effect = seqel.effect[1];
      addSeqel.delay = 0;
      addSeqel.sync = 'with';

      this.removeAllArtFromLayer(removeSeqel);
      this.addArtToLayer(addSeqel);
    }
  }).bind(this));
}

module.exports = StepAnimation;
