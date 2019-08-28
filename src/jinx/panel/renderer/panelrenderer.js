var $ = require('jquery');
var _ = require('underscore');
const ShadowPanel = require('ShadowPanel');
const StepAnimation = require('StepAnimation');
const ShadowAsset = require('ShadowAsset');

/**
 @module PanelRenderer
 @class PanelRenderer
 @constructor
*/
var PanelRenderer = function() {
  var _renderer = this;

  this.id = _.thumbprint(10);
  this.panel = undefined; // bequeathed by panel when renderer created
  this.panelArt = undefined; // ditto, the panel's PanelArt object
  this.selectors = undefined; // ditto

  this.assetRecords = new ShadowPanel(this.id);
  this.refresh = function() {
    this.assetRecords = new ShadowPanel(this.id);
  }

  this.updateAssetRecords = function(shadowPanel) {
    if (panel instanceof ShadowPanel) {
      this.assetRecords = shadowPanel;
    } else {
      throw new Error("updateAssetRecords must be passed a ShadowPanel")
    }
  }

  /* SETUP */

  // TODO: This should be a part of the Renderer, not a part of the Panel
  this.setupStructure = function(passageSel) {
    var panelDiv;

    if (!passageSel) {
      throw new Error(
        "Panel.setupStructure(): No Parameter supplied.  Panel.setupStructure() must take the selector of the DOM element in which the panel elements will be created."
      );
    }

    panelDiv = document.createElement('div');
    panelDiv.className = "panel";

    if ($(passageSel).length == 0) {
      throw new Error( "Panel.setupStructure: No passage div can be found in the DOM that maches the passed selector: " + passage+ ".\n\n(Panels selector errors may be caused by Panelizing before the document is ready." );
    } else {
      $(passageSel).append(panelDiv);
    }
  };

  // TODO: Renderer
  this.setupLayers = function(specificLayer) {
    var layers, panelSel;
    var createLayer;

    panelSel = this.selectors.panel;
    layers = this.panel.layers;

    if ($(panelSel).length == 0) {
      throw new Error( "Panel.layerize(): No panel can be found that maches the passed selector: " + panelSel + ".\n\n(Panels selector errors may be caused by Panelizing before the document is ready.  Try wrapping your Panelize in Snowman's $() helper )" );
    }

    createLayer = function __layerize__createLayer(name) {
      var newLayer, layerExists;

      newLayer = document.createElement("div");
      newLayer.className = "layer " + name;

      layerExists = $(panelSel + " .layer." + name).length;
      if (!layerExists) {
        $(panelSel).append(newLayer);
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
  };

  /* DOM MANIPULATION */

  this.getArtAsset = function(ref) {
    var name = (ref instanceof ShadowAsset) ? ref.name : ref;
    return this.panel.art.assets[name];
  }

  this.getArtElement = function(ref){
    var rName, rLayer, rId, sEl, element;

    if (ref === "panel") {

      return document.querySelector(this.selectors.panel);
    }

    if (_(ref).hasAll(["name","layer","id"])) {
      rName = ref.name;
      rLayer = ref.layer;
      rId = ref.id;
    }

    sEl = `${this.selectors.panel} .asset[assetId='${rId}']`;
    element = document.querySelector(sEl);

    if(!element && (rName && rLayer && rId)) {
      element = this.createArtElement(ref);
    }

    return element;
  }

  this.createArtElement = function(ref) {
    var artAsset = this.getArtAsset(ref.name);
    var element, image, layerSel;

    switch (artAsset.type) {
      case 'image':
        element = document.createElement('img');
        element.setAttribute('draggable', "false");
        image = element;
        break;
      case 'asset':
        element = document.createElement('div');
        // if artAsset.tags has "css" then we do a css background, otherwise:
        image = document.createElement('img');
        image.setAttribute('draggable', "false");
        element.appendChild(image);
        break;
      case 'text':
        element = document.createElement('div');
        element.innerHTML = _.unescape(artAsset.text);
        break;
      default:
        throw new Error("Unknown type of art asset: '"+artAsset.type+"'");
    }
    // we could refactor ^^^ this to:
    // var [element, image] = this.createArtElementTags(artAsset); // where that obv returns an array

    element.setAttribute('assettype', artAsset.type);
    element.setAttribute('assetid', ref.id);
    element.setAttribute('assetname', ref.name);

    // the following we could refactor into a set of methods contained in a renderer.assetCreator module

    if (artAsset.size && artAsset.size.length === 2) {
      var explicitDimensions = "";
      var explicitWidth = artAsset.size[0];
      var explicitHeight = artAsset.size[1];
      if (explicitWidth) {
        explicitDimensions += "width:" + (typeof explicitWidth === "number" ? explicitWidth+"px" : explicitWidth) + ";";
      }
      if (explicitHeight) {
        explicitDimensions += "height:" + (typeof explicitHeight === "number" ? explicitHeight+"px" : explicitHeight) + ";";
      }
      element.setAttribute('style', explicitDimensions)
    }

    const needsToLoad = !!(image);

    if (needsToLoad) {
      image.setAttribute('src', artAsset.getSrc());
      this.imageLoadHandler(element, image, ref);
    }

    element.className = "asset";
    if (artAsset.classNames && artAsset.classNames.length) {
      const customClassNames = artAsset.classNames.join(" ")
      element.className = `${element.className} ${customClassNames}`;
    }

    layerSel = this.selectors.panel + " .layer."+ref.layer;
    $(layerSel).append(element);
    _renderer.assetRecords.assetInstantiated(ref);

    if (!needsToLoad) {
      element.setAttribute('loaded','loaded');
      _renderer.assetRecords.assetLoaded(ref);
    }

    return element;
  }

  this.destroyArtElement = function(element) {
    // console.log("Removing element:",element);
    element.parentNode.removeChild(element);
    element = null; // unknown if this is actually how to do it, unknown if memory will leak with this.
    // console.log(element);
  }

  this.imageLoadHandler = function(element, image, ref){
    var loadHandler = function(e){
      console.log("loaded:", ref)
      image.removeEventListener("load", loadHandler);
      image.removeEventListener("error", loadErrorHandler);

      element.setAttribute('loaded','loaded');
      _renderer.assetRecords.assetLoaded(ref);
    }

    var loadErrorHandler = function(e){
      console.log("not loaded:", ref)
      image.removeEventListener("load", loadHandler);
      image.removeEventListener("error", loadErrorHandler);

      _renderer.assetRecords.assetLoadError(ref);
    }

    image.addEventListener("load", loadHandler);
    image.addEventListener("error", loadErrorHandler);
  }

  /* ANIMATION PIPELINE FUNCTIONS */


  this.animate = function(stepAnimation) {
    var sequences = [];
    $(document).trigger("animation-begun", stepAnimation);

    // hydrate assetAnimation with real assets and add to sequences
    _(stepAnimation.assets).each(_(function(assetAnimation) {
      var element, sequence;
      element = this.getArtElement(assetAnimation.asset);
      sequence = this.createSnabbtSequence(assetAnimation, element);
      sequences.push(sequence);
    }).bind(this));

    // HACK:
    var loads = _renderer.assetRecords._loadingAssets.length ? true : false; // this is just a quick fix

    // play all snabbt sequences
    function playAnimation() {
      $(document).trigger("started-playing-animation");
      // console.log("all assets have loaded", Date.now(), _renderer.assetRecords)
      // HACK: Refactor this to be an actual function
      _(sequences).each(function(sequence) {
        snabbt.sequence(sequence);
      })
      setTimeout(function() { $(document).trigger("ended-playing-animation"); }, stepAnimation.timing.end) // HACK: don't like setTimeout for this

      $(document).one("ended-playing-animation", function() {
        _renderer.postAnimationCleanup(stepAnimation);
      })
    }

    var handler = function(e,data) {
      if (data.rendererId === _renderer.id) {
        playAnimation();
        $(document).off('all-assets-loaded', handler)
      }
    }

    // console.log("assets are created but not loaded yet", Date.now(), _renderer.assetRecords)
    if (loads) {
      $(document).on('all-assets-loaded', handler)
    }  else {
      playAnimation();
    }
  }

  this.createStepAnimation = function(step) {
    var stepAnimation;
    var panel = this.assetRecords;

    stepAnimation = new StepAnimation(step, this.assetRecords);

    return stepAnimation;
  }

  this.createSnabbtSequence = function(assetAnimation, element) {
    var beats, sequence, i;

    sequence = [];
    beats = assetAnimation.beats;

    for (i = 0; i < beats.length; i++) {
      var beat = beats[i];
      sequence.push([element, beat]);
    }

    return sequence;
  }

  this.postAnimationCleanup = function(stepAnimation) {
    _(stepAnimation.assets).each(function(assetAnimation) {
      if (assetAnimation.shouldRemove) {
        var element = _renderer.getArtElement(assetAnimation.asset);
        _renderer.destroyArtElement(element);
      }
    })
  }
}

module.exports = PanelRenderer;
