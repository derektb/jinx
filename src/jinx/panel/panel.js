/**
--- TWIZE PANEL ---
 An object which stores the Panel information germane to Panel Passages.
 A Panel is created when a passage is tagged "panel" and configured inside the
 passage itself.

 @class Panel
 @constructor
**/

'use strict';
const $ = require('jquery');
const _ = require('underscore');
// var LZString = require('lz-string'); I do not know what this does :|
const Passage = require('Passage');
const Seqel = require('Seqel');
const Sequence = require('Sequence');
const StepCreator = require('StepCreator');
const PanelRenderer = require('PanelRenderer');
const PanelDestination = require('PanelDestination');
const PanelArt = require('PanelArt');
const ArtAsset = require('ArtAsset');
const Story = require('Story');

var Panel = function(name) {
  // ----- Basic Properties -----
  this.name = name;

  this.parentPassage = {
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

  this.isComplete = false;

  // --- ART ---

  this.art = new PanelArt(this.name);

  this.addArtAssets = function(){
    console.warn("p.addArtAssets has been deprecated.  Use p.art.assets()")
    this.art.assets.apply(this.art, [...arguments]);
  }
  this.addLayers = function(){
    console.warn("p.addLayers has been deprecated.  Use p.art.layers()")
    this.art.layers.apply(this.art, [...arguments]);
  }

  // --- RENDERER ---

  this.renderer = new PanelRenderer();
  // parent data down
  this.renderer.panel = this;
  this.renderer.panelArt = this.art;
  this.renderer.selectors = this.selectors;

  // --- SEQUENCE ---

  this.seq = new Sequence();
  this.step = new StepCreator();
  // parent data down
  this.step.seq = this.seq;

  // --- DESTINATIONS ---

  this.destination = new PanelDestination();

  //  -----  WORKHORSE METHODS  -----
  /**
    Having this as a naked function on the panel is starting to smell fishy,
    especially in light of how much the above has been tidied up and
    modularized.  Not sure where Advance goes to live if it ain't here.

    I mean, maybe it does live here, given how many of the panel's modules
    it touches.  I don't know.  Something to think about, though.
  **/
  this.advance = function() {
    const stepData = this.seq.getStepData();

    const step = stepData.step;
    const newPosIndex = stepData.data.lastIndex + 1;
    const isFinalStep = stepData.data.isFinalStep;
    const shouldAutoTransition = stepData.data.shouldAutoTransition;
    // The above is weird. Should be refactored to just use the StepData.
    const stepAnimation = this.renderer.createStepAnimation(step);
    // stepAnimation = this.renderer.createStepAnimation(stepData)

    this.renderer.animate(stepAnimation);

    // this should be evented somehow.  it temporarily fixes final advancement, though.
    this.seq.pos.index = newPosIndex;
    this.isComplete = isFinalStep;
    // possibly we do something like this
    if (isFinalStep) {
      if (this.destination.get() === -1) { // final panel
        $.event.trigger("jinx.panel.is-final-panel")
      } else {
        $.event.trigger("jinx.panel.will-transition")
      }
    }
    // hack for transition
    if (shouldAutoTransition) {
      // very much a hack
      $.event.trigger("jinx.panel.should-auto-transition");
    }
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

      $.event.trigger('panelized', panel); // regression
      $.event.trigger('jinx.panel.panelized', panel);
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
