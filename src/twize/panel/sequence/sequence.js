
var $ = require('jquery');
var _ = require('underscore');
var Seqel = require('Seqel');
const AssetAnimation = require('AssetAnimation');

/**
I don't feel like explaining right this second, woof.

@module Sequence
@class Sequence
@constructor
**/
var Sequence = function(){
  /**
  The sequence's tracks represent both the composition and "animation" of a
  Panel: in addition to describing the order, timing, and placement of art in an
  'iterative panel', they also describe the setup and placement of multi-layer
  static panel art.

  In nonlinear or varying-perspective panels, multiple tracks will be used. When no track is specified in step or seqel construction, the default track ("default") will be used

	 @property tracks {object} Tracks are referenced by name.  The default track is `default` (natch), which is an Array that holds seqels.
	**/
  this.tracks = {
    default: []
  };

  this.getTrack = function(trackname) {
    var requestedTrack = this.tracks[trackname];

    if (requestedTrack) {
      return requestedTrack
    } else {
      throw new Error("No track by the name '"+trackname+"' could be found in this sequence")
    }
  }

  this.addSeqelToTrack = function(seqel,track) {
    var destination = track ? this.tracks[track] : this.tracks.default;

    // should probably ensure that the thing being passed is indeed a seqel

    destination.push(seqel);
  }

  /**
   The Position object holds the information about where we are, in linear
   terms, within the Panel's Sequence.

   Important: Sequence.pos.index will always refer to the index of the
   Seqel we will next attempt to work on.  At the beginning of Panel.run() we
   read sequence.pos and attempt to show that Seqel, then move to the next one.
   If it exists, we run again.

   The default track is "steps".

   @property pos (position)
   @type PlainObject
     @property track {String} which sequence Track we are on
     @property index {Integer} the index of our position within the track
  **/

  this.pos = {
    track: "default",
    index: 0
  };

  this.updatePos = function __Sequence__updatePos(index, track) {
    if (!index && index !== 0) {
      throw new Error("Sequence.updatePos must at least get one argument—the new index for Sequence.pos")
    }

    this.pos.index = index;
    if (track) {
      this.pos.track = track;
    }
  }

  /**
   Possibly a bad idea, but a property which states that if a Seqel references
   a layer that the Panel doesn't know about, the Panel can just go ahead and
   create a new layer.

	 @property addUnknownLayers
	 @type Boolean
	**/

  this.addUnknownLayers = false;

  // --- ANIMATION FUNCTIONS ---

  this.getStepData = function() {
    var step = [], data = {},
    pos, index, track;

    pos = this.pos;
    index = pos.index;
    track = this.getTrack(pos.track);

    var i = index;
    var reading = true;

    while (reading && i < track.length) {
      var seqel = track[i]
      step.push(seqel);
      if (seqel.flow === 'stop' || seqel.flow === 'end') {
        reading = false;
      } else {
        i += 1;
      }
    }

    data = {
      lastIndex: i,
      isFinalStep: (i+1 >= track.length)
    }

    return {step: step, data: data};
  }

  this.createAssetAnimationsFromStep = function(step, shadowPanel) {
    var assets = [];
    var panel = shadowPanel;
    var timing = {startTime: 0, endTime: 0};

    _.each(step, function(seqel) {
      var assetInstance, assetAnimation, layer, layerAssets;
      var action, duration, startTime, endTime;

      // --- GET OR CREATE LAYER Instance
      layer = panel.layer(seqel.layer) ?
              panel.layer(seqel.layer) :
              panel.createLayerInstance(seqel.layer);

      // --- DETERMINE ACTION AND ASSET CREATION / REMOVAL / MANIPULATION
      /* please for the love of christ turn this into smaller atomic methods afterwards */
      /* I'm going to just leave this in a steaming pile for someone else to fix later */
      /* sorry, future derek */
      switch (seqel.apply) {
        case "add":
          assetInstance = layer.createAssetInstance(seqel.art);
          assetAnimation = new AssetAnimation(asset.name, layer.name, asset.id);
          // assetAnimation.newBeat( uhhhhhhhh the params )
          // timing = updateTiming(timing, seqel.sync, seqel.duration)
          assets.push(assetAnimation);
          break;
        case "remove":
          if (seqel.art && seqel.layer) {
            assetInstance = panel.layer(seqel.layer).asset(seqel.art)
            // assetAnimation = go find it
          } else if (seqel.layer) {
            /* all the remove stuff I was working on down there */
          } else { /* you're a naughty boy */ }
          break;
        case "replace":
          // find all asset instance records on specified layer
          layerAssets = layer.assets();
          _.each(layerAssets, function(assetRecord) {
            var foundAsset = _(assets).find(function(assetAnimation) {
              return assetAnimation.asset.id === assetRecord.id
            });

            if(foundAsset) {
              foundAsset.newBeat(/* puh puh params */);
            }
          })
          break;
        default:

      }
    });

    return {assets: ourAssets, panel: panel, timing: timing}
  }

  // --- SEQEL CONSTRUCTORS ---
  /**
	 Creates a new Seqel object and adds it to this.steps.  For alternate
   StepHoards, use newStepOn, which

	 @method addSeqel
   the Seqel constructor takes variable arguments, so this basic Seqel-maker
   does too.
   --- 2 arguments: ---
   @arg art {String} The name of the art asset to display on this Step
   @arg layer {String} The name of the layer on which to display said art
   --- 5 arguments: ---
   @arg art
   @arg layer
   @arg effect {String} The name of the Effect to apply when showing this art.
   @arg apply {String} (add|remove|replace) Whether to do any of those to the
                       specified art asset on the specified layer.
   @arg flow
	**/

  // This is extremely bad, and I want to refactor it, but I'm also worried about my own backwards compatibility.  So I'm just going to have Sequence.addStep know about the new way of making seqels and have done with it.

  this.addSeqel = function(){
    var art, layer, effect, apply, flow, ns;

    // varying numbers of arguments
    if (arguments.length == 2) {
      art =     arguments[0];
      layer =   arguments[1];
    } else if (arguments.length == 3) {
      art =     arguments[0];
      layer =   arguments[1];
      flow =    arguments[2];
    } else if (arguments.length == 4) {
      art =     arguments[0];
      layer =   arguments[1];
      apply =   arguments[2];
      flow =    arguments[3];
    } else if (arguments.length == 5) {
      art =     arguments[0];
      layer =   arguments[1];
      effect =  arguments[2];
      apply =   arguments[3];
      flow =    arguments[4];
    }

    ns = new Seqel({art: art, layer: layer, effect: effect, apply: apply, flow: flow});

    this.addSeqelToTrack(ns);
  }

  /**
   Sequence.addStep(), or as it's known in the panel, step.create(), is the preferred method for creating the sequence.  It adds  multiple seqels at a time
  **/

  this.addStep = function(){
    var seqels, setupSeqel, steps;

    seqels = Array.from(arguments);

    setupSeqel = function(hash, index) {
      var newSeqel;
      // I'm just gonna get cowboy on this motherfucker, I dunno if we need to play it safe with these heifers or what.  The seqel now knows what it needs, so like, fuck it, right?
      if (index+1 == seqels.length) {
        // Automatically sets the last seqel's flow property to "stop" if it wasn't defined.  I should just rely on falsiness, but I dunno what you kids will get up to in the future
        if((hash.flow !== 'stop') || (hash.flow !== "end")) {
          hash.flow = "stop";
        }
      }

      newSeqel = new Seqel(hash);
      this.addSeqelToTrack(newSeqel);
    };
    setupSeqel = _.bind(setupSeqel, this);

    var results = _.each(seqels, setupSeqel);
  }
}

module.exports = Sequence;
