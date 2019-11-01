var $ = require('jquery');
var _ = require('underscore');

/* TODO: Renaming: this is a BEAT, not a SEQEL.
    a SEQEL is NOTHING.  The Sequence is a Sequence
    of Steps and each Step is a series of Beats.
*/
var Seqel = function(data, jinx){
  var art, layer, effect, apply, sync, delay, flow, type, duration, xy, code;

  var jinx = jinx || window.jinx;

  // setup property values with defaults
  /* if (data.type) {
    type = data.type;
  } else {
    if ((art && layer) ||
        (!art &&
          (layer &&
            (
              (apply === "remove" ) || (apply === "replace")
            )
          )
        )
      ) {
      type = "art"
    } else if (effect) {
      type = "effect"
    }
  } */

  art = data.art           ||  data.asset ||  data.a;
  layer = data.layer       ||  data.l;
  delay = data.delay       ||  data.d;
  duration = data.duration ||  data.u;
  apply = data.apply       ||  data.p     ||  jinx.getDefault('apply');
  sync = data.sync         ||  data.s     ||  jinx.getDefault('sync');
  flow = data.flow         ||  data.f     ||  jinx.getDefault('flow');
  effect = data.effect     ||  data.e; // ||  jinx.getDefault(`${apply}Effect`)
  xy = data.xy;
  code = data.code;
  if(code) {
    apply = 'code';
  }
  type = data.type         ||  data.t;
  if (!type) {
    type = code ? 'code' : 'art';
  }

  // autofilling empty effects

  if(!effect) {
    if (apply === 'code') {
      effect = jinx.effects.get('none');
    } else {
      effect = jinx.getDefault(`${apply}Effect`);
    }
  }

  if (typeof effect === 'string') {
    effect = jinx.effects.get(effect);
  }

  if ( (apply === 'replace') && !(_.isArray(effect)) ) {
    throw new Error ("Replace seqels must define effects as a two-item array [removeEffect, addEffect]");
  }

  // ensuring xy format

  if(xy) {
    if (!_.isArray(xy) || xy.length < 2) {
      throw new Error( 'Defined XY property must be an array of two (2d) or three (3d) numbers!' );
    }
  }

  if( (type === "art") || ((type === 'apply') && (apply === 'replace')) ) {
    if (!art) {
      if (layer && (apply === 'remove')) {
        type = "apply"
      } else {
        throw new Error ("Seqel[type: "+type+"] constructor: Must have at least an art asset to render defined!")
      }
    }
    if (!layer) {
      throw new Error ("Seqel[type: "+type+"] constructor: Must have a layer defined!")
    }
  } /* else if (type == 'apply') {
    if (!apply) {
      throw new Error("Seqel[type: apply] constructor: Type of application has not been ")
    }
    if ((apply == "remove" && (!layer && !art))  ) {
      throw new Error ("Seqel[type: apply] constructor: Seqel is defined te remove something, but nothing is specified to remove.")
    }
  }*/ // that's all a little spurious

  // setup seqel properties
  this.type = type;

  this.art = art;
  this.layer = layer;
  this.effect = effect;
  this.apply = apply;
  this.sync = sync;
  this.delay = delay;
  this.duration = duration;
  this.flow = flow;
  this.xy = xy;
  this.code = code;

  // seqel property slicer

  this.asset = function() {
    return {art: this.art, layer: this.layer};
  }

  this.timing = function() {
    return {sync: this.sync, delay: this.delay, duration: this.duration};
  }
}

module.exports = Seqel;
