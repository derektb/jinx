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

  /**
	 Stores parent passage information

	 @property _parentPassage
	 @type PlainObject
	**/
  this.__parentPassage = {
    name: "",
    id: undefined
  }

  /**
	 Stores the CSS selectors relevant to this particular panel, so that in-panel
   jQuery can know about it.  Set up in Panelize.

	 @property _selectors
	 @type PlainObject
	**/
  this.__selectors = {
    passage: "",
    panel: ""
  }
  this.$ = function(){
    return $(this.__selectors.panel);
  }


  /* remembers whether the panel is complete; possibly spurious */
  this.__isComplete = false;

  // --- ART ---

  this.art = new PanelArt(this.name);
  var art = this.art;

  // DEPRECATING:

  // this.addArt = function(key,path,filename) {
  //   var data;
  //
  //   if (this.art[key]) {
  //     throw new Error (
  //       'There is already an art asset in this panel with the name "' + key + '"'
  //     );
  //   } else {
  //     data = {
  //       name: key,
  //       type: "image"
  //     };
  //
  //     if (filename && path) {
  //       data.useRoot = false;
  //       data.src = path + filename;
  //     } else {
  //       data.useRoot = true;
  //       data.src = path;
  //     }
  //
  //     this.art[key] = new ArtAsset(data);
  //   }
  // }

  this.addArtAssets = function __Panel__addArtAssets () {
    var assets;

    assets = Array.from(arguments);

    _.each(assets, function(asset) {
      if(_(asset).isArray()) {
        var assetName, assetPath;
        assetName = asset[0];
        assetPath = asset[1];

        art.createAsset({
          name: assetName,
          src: assetPath
        });
      } else {
        if(_(asset).isObject()) {
          art.createAsset(asset);
        }
      }
    })
  }

  // --- RENDERER ---

  this.renderer = new PanelRenderer();
  this.renderer.panelArt = this.art;
  this.renderer._parentPanel = this;

  // --- LAYERS ---

  this.layers = [];

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

  /**
   Embarrassingly similar to Panel.addArtAssets, Panel.addLayers is an expedient way to add a bunch of layers at once.  It expects an indefinite number of strings as arguments.
  **/

  this.addLayers = function __Panel__addMultipleLayers() {
    var p = this;
    var layers;
    layers = Array.from(arguments);

    _.each(layers, function(layerName) {
      p.addLayer(layerName);
    })
  }

  // --- SEQUENCE ---

  this.seq = new Sequence();

  this.step = {};
  this.step.create = _.bind(this.seq.addStep, this.seq);

  // --- DESTINATIONS ---

  this.destination = {};
  this.destination.main = ""; // a Twine 2 syntax link

  //  -----  WORKHORSE METHODS  -----
  /**
   (Setup Method)
	 The method which sets up initial DOM structure for a panel.

	 @method setupStructure
   @param passage {String} the selector for the passage in which the panel will
          be created.
   @returns the newly-created div.panel within the panel object
	**/

  this.setupStructure = function(passage) {
    var panelDiv;

    if (!passage) {
      throw new Error(
        "Panel.setupStructure(): No Parameter supplied.  Panel.setupStructure() must take the selector of the DOM element in which the panel elements will be created."
      );
    }

    panelDiv = document.createElement('div');
    panelDiv.className = "panel";

    if ($(passage).length == 0) {
      throw new Error( "Panel.setupStructure: No passage div can be found in the DOM that maches the passed selector: " + passage+ ".\n\n(Panels selector errors may be caused by Panelizing before the document is ready.  Try wrapping your Panelize in Snowman's $() helper )" );
    } else {
      $(passage).append(panelDiv);
    }
  };

  /**
	 The method which creates art layers within a panel.

	 @method layerize
   @param specificLayer {String} a specific layer to layerize, rather than all layers at once.
	**/

  this.layerize = function(specificLayer) {
    var layers, $panel;
    var createLayer;

    $panel = this.__selectors.panel;
    layers = this.layers;

    if ($($panel).length == 0) {
      throw new Error( "Panel.layerize(): No panel can be found that maches the passed selector: " + $panel + ".\n\n(Panels selector errors may be caused by Panelizing before the document is ready.  Try wrapping your Panelize in Snowman's $() helper )" );
    }

    createLayer = function __layerize__createLayer(name) {
      var newLayer, layerExists;

      newLayer = document.createElement("div");
      newLayer.className = "layer " + name;

      layerExists = $($panel + " .layer." + name).length;
      if (!layerExists) {
        $($panel).append(newLayer);
      }
    }

    if(specificLayer) {
      createLayer(specificLayer)
    } else {
      if(layers.length == 0) {
        layers.push("default");
      }

      _.forEach(layers, _.bind(function(layerName) {
          createLayer(layerName);
        }, this)
      );
    }

    // console.log(this.art.__displayedAssets)
  };

  /**
	 The method which manages the Wand.  If it can't find a wand, it creates one;
   otherwise, it moves the existing wand from wherever it is to the
   active panel.
   Possibly someday this also adds all kinds of listeners and whatnot, but for
   now it just does what I said it does.
     I briefly considered calling this method "Ollivander"

	 @method wandize
	**/

  this.wandize = function() {
    var wand, wandExists, latestInstance;

    latestInstance = window.story.history.length - 1; // the dumb version.
    // it's also true, though.  That will probably always be correct?  But it smells funny to assume so.

    // latestInstance = _.wiz_findInHistory() // exists but isn't a thing yet.

    wand = $("#wand");
    wandExists = wand.length; // semantics!

    if(wandExists) {
      wand.appendTo(".passage.active[historyIndex="+latestInstance+"] .panel");
    } else {
      wand = document.createElement("div")
      wand.id = "wand"

      var latestPanel = $(".passage.active[historyIndex="+latestInstance+"] .panel")
      if (latestPanel.length) {
        latestPanel.append(wand);
      } else {
        throw new Error("Wandize couldn't find an active passage of history index "+latestInstance+" bearing a panel.  Sorry!")
      }
    }

    // this next bit is all highly suspect
    if(this.__isComplete) {
      if(!this.destination.main) {
        throw new Error("No main destination set.")
      }
      // this part immediately transforms the wand into a link to the next passage by Passage.render()-ing the passage link string stored in the destination
      $("#wand").html(Passage.render(this.destination.main)).removeClass("incomplete").addClass("complete");;
      $("#wand a").unwrap(); // removes vestigial p tag that accompanies this
    } else {
      // this, I assure you, is the most suspect of all
      $('#wand').html("<a href='javascript:void(0)' onClick='window.passage.panel.advance()'></a>").removeClass("complete").addClass("incomplete");
      // the onclick is moderately naughty.
    }
  };

  /**
	 Advance is the workhorse for handling sequential action in a Panel.  in 0.5, Advance delegates its behaviors among its children, and basically just oversees everything and makes sure nobody gets too big for their britches.  As such, it's quite lean.

	 @method advance
	**/

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
  /**
	 The function which creates a panel on a passage object.  For the moment, I'm
   going to advocate calling this

	 @method panelize
   @param initializeData { Function }  [optional] A function which initializes panel
   data.  This function is provided the newly-created Panel as a param.
   @returns the panel object.
	**/

  panelize: function(initializeData){
    var panel, passageSelector, panelSelector;

    if(this.panel) {
      // check to see if this passage already has a panel
      panel = this.panel;
      panel.refresh();
    }
    else {
      // begin panel creation:
      // (if we don't have a panel, we make a new one)
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
        console.log( "Panel.panelize(): You Panelized the panel of Passage \"" + this.name + "\" without passing a function to set up its data.  This is allowed, but not recommended; a Panel's data should be set up in its entirety during Panelization.")
      }

      // create default info?  This really depends on how static panels are, and whether you're going to be configuring them some more later on
    }

    // Render Panel In Passage

    // panel.__selectors.passage = passageSelector = ".passage.active." + this.passageDomName() + "[historyIndex=\'"+(window.story.history.length-1)+"\']";
    // panel.__selectors.panel = panelSelector = passageSelector + " .panel";
    panel.__selectors.passage = passageSelector = "."+this.passageDomName() + "[historyIndex=\'"+(window.story.history.length-1)+"\']";
    panel.__selectors.panel = panelSelector = passageSelector + " .panel";
    panel.renderer.selectors = panel.__selectors;

    panel.setupStructure(passageSelector);
    panel.layerize();
    // stick the wand on the panel, or create one.
    panel.advance();

    $.event.trigger('panelized', panel);
    $(document).on("click", panelSelector+".wand.active", function() {
      panel.$().trigger('panel-clicked', panel);
    })
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
