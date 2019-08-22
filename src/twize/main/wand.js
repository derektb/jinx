'use strict';
var $ = require('jquery');
var _ = require('underscore');

var Wand = function() {
  var wand = this;
  this._target = undefined;

  // HACK probably HACK
  $(document).on('panel-clicked', function(e, panel) {
    if(_.isEqual(wand._target, panel)){
      if (panel.__isComplete) {
        const wrappedPassageName = /(?:\[\[(?:->)?)(.+)(?:\]\])/;
        const passageNameMatch = panel.destination.main.match(wrappedPassageName);
        const passageName = passageNameMatch ? passageNameMatch[1] : panel.destination.main;
        window.story.show(passageName);
      } else {
        panel.advance();
      }
    }
  });

  $(document).on('panelized', function(e,panel){
    wand.over(panel);
  })

  this.over = function(panel) {
    $('.wand').removeClass('active').removeClass('wand');
    wand._target = panel;
    panel.$().addClass('wand');
  }

  this.getWandTarget = function() {

  }

  $(document).on('ended-playing-animation', function(e){
    wand.activate();
  });

  this.isActive = false;

  this.activate = function() {
    $('.wand').addClass('active');
    wand.isActive = true;
  }

  this.__minimumTimeForDeactivation = 200;

  $(document).on('animation-begun', function(e, stepAnimation){
    if(stepAnimation.timing.end > wand.__minimumTimeForDeactivation) {
      wand.deactivate();
    }
    wand.loading();
  });

  $(document).on('started-playing-animation', function(e, stepAnimation){
    wand.loaded();
  });

  this.deactivate = function() {
    $('.wand').removeClass('active');
    wand.isActive = false;
  }

  this.loading = function() {
    $('.wand').addClass('loading');
  }

  this.loaded = function() {
    $('.wand').removeClass('loading');
  }
}

module.exports = Wand;
