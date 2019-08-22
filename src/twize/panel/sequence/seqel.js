var $ = require('jquery');
var _ = require('underscore');

/**
  An object which represents all the information for a given step of an
  iterative panel's Sequence.  More documentation is on the Trello.

  @module Seqel
  @class Seqel
  @constructor
**/
var Seqel = function(data, twize){
  var art, layer, effect, apply, sync, delay, flow, type, duration, xy, code;

  var twize = twize || window.twize;

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

  art = data.art || data.asset ||  data.a;
  layer = data.layer       ||  data.l;
  apply = data.apply       ||  data.p  ||  twize.getDefault('apply');
  sync = data.sync         ||  data.s  ||  twize.getDefault('sync');
  delay = data.delay       ||  data.d;
  duration = data.duration ||  data.u;
  flow = data.flow         ||  data.f  ||  twize.getDefault('flow');
  xy = data.xy;
  effect = data.effect     ||  data.e;
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
      effect = twize.effects.get('none');
    } else {
      effect = twize.getDefault(`${apply}Effect`);
    }
  }

  if (typeof effect === 'string') {
    effect = twize.effects.get(effect);
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
