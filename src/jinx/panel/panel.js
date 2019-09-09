/**
--- TWIZE PANEL ---
 An object which stores the Panel information germane to Panel Passages.
 A Panel is created when a passage is tagged "panel" and configured inside the
 passage itself.

 @class Panel
 @constructor
**/

// Klembot included this stuff in the other files.
'use strict';
const $ = require('jquery');
const _ = require('underscore');
// var LZString = require('lz-string'); I do not know what this does :|
const Passage = require('Passage');
const Seqel = require('Seqel');
const Sequence = require('Sequence');
const PanelRenderer = require('PanelRenderer');
const PanelArt = require('PanelArt');
const ArtAsset = require('ArtAsset');
const Story = require('Story');

var Panel = function(name) {
  // ----- Basic Properties -----
  this.name = name;

  this.__parentPassage = {
    name: "",
    id: undefined
  }
  this.selectors = {
    passage: "",
    panel: ""
  }
  this.$ = function(){
    return $(this.selectors.panel);
  }

  this.__isComplete = false;

  // --- ART ---

  this.art = new PanelArt(this.name);

  // --- RENDERER ---

  this.renderer = new PanelRenderer();
  this.renderer.panel = this;
  this.renderer.panelArt = this.art;
  this.renderer.selectors = this.selectors;

  // maybe this.layers = new PanelLayers
  // this.layers.add(layer, layer, ...)
  // note: var args = [...arguments];

  this.addLayer = function __Panel__addLayer (name) {
    var newLayerName;

    if ( (!name) || (typeof name !== "string") ) {
      throw new Error("Panel.addLayer: Bad argument passed to addLayer. Please give addLayer a string. Value:" + name)
    }

    newLayerName = _.wiz_validCssName(name);

    if( _.find(this.layers, function(existingLayer, proposedNewLayer) { return existingLayer == proposedNewLayer; }) ) {
      throw new Error("Panel.addLayer: The layer you're trying to add either has literally the same name as another layer, or does so when it gets processed into a CSS-friendly name. Sorry!\n\nProblem Name: " + newLayerName)
    } else {
      this.layers.push(newLayerName);
    }
  }

  this.addLayers = function __Panel__addMultipleLayers() {
    const layers = Array.from(arguments);

    _.each(layers, (layerName)=> {
      this.addLayer(layerName);
    })
  }

  // --- SEQUENCE ---

  this.seq = new Sequence();
  // TODO: This below sucks.  Possibly: this.step = StepCreator(this.seq);
  // or this.step = new StepCreator(); this.step.seq = this.seq;
  this.step = {};
  this.step.create = _.bind(this.seq.addStep, this.seq);

  // --- DESTINATIONS ---

  // TODO: an actual Destination module!  with nonlinear destinations!  exciting!
  this.destination = {};
  this.destination.main = ""; // a Twine 2 syntax link

  //  -----  WORKHORSE METHODS  -----


  this.advance = function() {
    var stepData, stepAnimation,
    step, newPosIndex, isFinalStep;

    stepData = this.seq.getStepData();
      step = stepData.step;
      newPosIndex = stepData.data.lastIndex + 1;
      isFinalStep = stepData.data.isFinalStep;
    stepAnimation = this.renderer.createStepAnimation(step);

    this.renderer.animate(stepAnimation);

    // this should be evented somehow.  it temporarily fixes final advancement, though.
    this.seq.pos.index = newPosIndex;
    this.__isComplete = isFinalStep;
  }

  this.refresh = function(){
    this.seq.updatePos(0, "default");
    this.renderer.refresh();
  }
}

// Some Jinx-Specific extensions to the Passage

_.extend(Passage.prototype, {
  // TODO: Panelize should be broken apart to some degree
  panelize: function(initializeData){
    var panel = this.panel;
    var passageSelector, panelSelector;

    const isLivePanel = this.tags.includes("live-panel");
    const isPreloading = window.jinx._isPreloading;

    if(panel && !isLivePanel) {
      panel.refresh();
    }
    else {
      this.panel = new Panel(this.name);
      panel = this.panel;

      if (initializeData) {
        if (typeof initializeData !== "function") {
          throw new Error(
            'Panel.panelize(): Panelize only takes a function as a param.  You passed a param of type "' + (typeof initializeData) + '".'
          );
        } else {
          initializeData(panel);
        }
      } else {
        throw new Error(
          'No initialization function given to Panel.panelize()'
        )
      }
    }

    if (!isPreloading) {
      // Render Panel In Passage

      panel.selectors.passage = `.${this.passageDomName()}[historyIndex='${window.story.history.length-1}']`;
      panel.selectors.panel = `${panel.selectors.passage} .panel`;

      panel.renderer.setupStructure(panel.selectors.passage); // creates "panel" div within rendered passage div
      panel.renderer.setupLayers();

      /**
        listener for this panel click --- probably shouldn't be here, and instead
        be set up by the wand in respone to "panelized" event **/
      $.event.trigger('panelized', panel);
      $(document).on("click", panel.selectors.panel+".wand.active", function() {
        panel.$().trigger('panel-clicked', panel);
      })

      // initial advance -- possibly also refactor to give to the wand.
      panel.advance();
    }

    return panel;
  },

  /**
	 A helper function which will output the standard CSS identifier for this
   passage, or for another passage that exists.

	 @method passageDomName
   @param otherPassage { Object } [optional] A passage other than this one.
   @returns A string with a standardized name for this passage.
	**/

  passageDomName: function(otherPassage) {
    var prefix, passageName, suffix,
        validPassageName;

    prefix = "passage--";
    passageName = (otherPassage) ? otherPassage.name : this.name;
    suffix = "";

    validPassageName = _.wiz_validCssName(passageName);

    return prefix + validPassageName + suffix;
  }
});

module.exports = Panel;
