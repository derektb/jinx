'use strict';
var $ = require('jquery');
var _ = require('underscore');

const Utils = require('Utils');

const Wand = function() {
  const wand = this;
  // _target might be tightly coupled with a panel-wand paradigm
  this._target = undefined;
  // state props
  this.isActive = false;
  wand.expectTransition = false;
  wand.shouldAutoTransition = false;

  this.minimumTimeForDeactivation = 100;
  // HACK: wand mode.  should go through jinx?  should detect when mode changes?
  this.wandMode = `panel`; // panel | button
  this.mode = function(which) {
    if (![`panel`, `static`].includes(which)) {
      throw new Error(`Invailid wand mode specified: "${which}"`);
    }

    if (which === `panel`) {
      this.destroyButtonWand();
      wand.over(wand._target);
    } else if (which === `static`) {
      wand.away();
      this.createButtonWand();
    }

    this.wandMode = which;
  }

  this.createButtonWand = function() {
    const button = document.createElement("button");
    button.classList.add("wand");
    button.id = "wand";
    document.getElementById("passages").insertAdjacentElement("afterend", button);
  }
  this.destroyButtonWand = function() {
    document.getElementById("wand").remove();
  }

  /* MAIN EVENTS */

  $(document).on(`click`, `.wand.active`, function(){
    /*
      this is kind of a hack, but the wand should listen
      for the jinx event and not the regular click event
    */
    $(this).trigger(`jinx.panel.advance`)
  })

  $(document).on(`jinx.panel.advance`, function(e) {
    const panel = window.passage.panel;

    if (!_.isEqual(wand._target,panel)) {
      throw new Error("Wand's target does not match")
    }

    if (panel.__isComplete) {
      const passageName = Utils.unwrapLink(panel.destination.get())
      window.story.show(passageName);
    } else {
      panel.advance();
    }
  });

  $(document).on('hidepanel', function(){
    wand.away(); // hack 19 SEP 9
  })

  $(document).on('jinx.panel.panelized', function(e,panel){
    wand.clearState();
    wand.away();
    wand.over(panel);
    panel.advance(); // initial panel advance
  })

  this.away = function() {
    const existingWand = $('.wand');
    existingWand.removeClass("active");
    if (this.wandMode === "panel") {
      existingWand.removeClass('wand');
    }
  }

  this.over = function(panel) {
    wand._target = panel;
    if (this.wandMode === "panel") {
      panel.$().addClass('wand');
    }
  }

  this.activate = function() {
    $('.wand').addClass('active');
    wand.isActive = true;
  }

  this.deactivate = function() {
    wand.clearStyling();
    wand.clearState();
  }

  this.clearState = function(){
    wand.isActive = false;
    wand.expectTransition = false;
    wand.shouldAutoTransition = false;
  }

  /* PANEL-WAND STATE COMMUNICATION */

  $(document).on("jinx.panel.should-auto-transition", function(){
    wand.shouldAutoTransition = true;
  })

  $(document).on('jinx.animation.started', function(e, stepAnimation){
    console.log("wand saw animation start");
    const minimumTimeForDeactivation = wand.minimumTimeForDeactivation;

    debugger
    if(stepAnimation.timing.end > minimumTimeForDeactivation) {
      wand.deactivate();
    }
    wand.loading();
  });

  $(document).on('jinx.animation.playing.begun', function(e){
    console.log("wand saw animation begin playing");
    wand.loaded();
    wand.startedPlaying()
  });

  $(document).on('jinx.animation.playing.ended', function(e){
    console.log("wand saw animation end playing");
    wand.endedPlaying()
  });

  $(document).on('jinx.animation.finished', function(e){
    console.log("wand saw animation finish");
    const panel = window.passage.panel;
    let willTransition, isFinalPanel;
    const shouldAutoTransition = wand.shouldAutoTransition

    if (panel.__isComplete) {
      const dest = panel.destination.get();
      if (dest === -1) {
        isFinalPanel = true;
      } else if (dest) {
        willTransition = true;
      } else if (dest === undefined) {
        console.warn("No destination was found for this panel.")
        isFinalPanel = true;
      }
    }

    if (isFinalPanel) {
      wand.away();
    } else {
      if (shouldAutoTransition) { // hack zone
        $(document).trigger("jinx.panel.advance")
      } else {
        wand.activate();
        if (willTransition) {
          wand.willTransition();
        }
      }
    }
  });

  /* WAND STATE VISUALIZATION */

  this.clearStyling = function() {
    $('.wand').
      removeClass('active').
      removeClass('loading').
      removeClass('playing').
      removeClass('will-transition')
  }

  this.loading = function() {
    $('.wand').addClass('loading');
  }

  this.loaded = function() {
    $('.wand').removeClass('loading');
  }

  this.startedPlaying = function() {
    $('.wand').addClass('playing');
  }

  this.endedPlaying = function() {
    $('.wand').removeClass('playing');
  }

  this.willTransition = function() {
    $('.wand').addClass('will-transition');
  }
}

module.exports = Wand;
