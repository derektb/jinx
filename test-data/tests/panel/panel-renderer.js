// var Panel = require("Panel");
const PanelRenderer = require("PanelRenderer");
const ShadowPanel = require("ShadowPanel");
const Sequence = require("Sequence")
const StepAnimation = require('StepAnimation');
const AssetAnimation = require('AssetAnimation');
// var Passage = require("Passage");
const Jinx = require("Jinx");
const _ = require("underscore");

var seq, jinx, renderer;

QUnit.module("PanelRenderer",
{
  beforeEach: function() {
    jinx = window.jinx = new Jinx();
    renderer = new PanelRenderer();
  },
  afterEach: function() {
    jinx = window.jinx = null;
  }
},

function() {
  QUnit.test("PanelRenderer initializes correctly", function(assert) {
    assert.deepEqual(renderer.assetRecords, new ShadowPanel(), "Renderer initializes with an empty shadow panel")
  });

  QUnit.test("PanelRenderer manages assetRecords correctly", function(assert){
    var newShadowPanel = new ShadowPanel();
    newShadowPanel.createLayerInstance("foo").createAssetInstance("bar");
    renderer.updateAssetRecords(newShadowPanel);
    assert.deepEqual(renderer.assetRecords, newShadowPanel, "A whole ShadowPanel can be fed to updateAssetRecords to replace extant assetRecords.");
    assert.throws(function(){ renderer.updateAssetRecords("foo bar") }, Error, "updateAssetRecords throws an error when you try to pass it something that isn't a ShadowPanel.")
  })

  QUnit.test("PanelRenderer.createStepAnimation gets back the StepAnimation it expects", function(assert){
    var seq = new Sequence();
    seq.addStep(
      {a: "foo", l: "bar"}
      , {a: "fizz", l: "buzz"}
    );
    var step = seq.getStepData().step;

    var stepAnimation = renderer.createStepAnimation(step);
// This stuff ripped from another location, so it may be terrible
    var assets, panel;
    assets = stepAnimation.assets;
    panel = stepAnimation.panel

    assert.ok(stepAnimation instanceof StepAnimation, "returns a StepAnimation")
    assert.ok(_.hasAll(stepAnimation, ['assets', 'panel', 'timing']), "StepAnimation contains assets, the updated shadow panel information, and some timing data");
    assert.equal(assets.length, 2, "Correct number of AssetAnimations have been created");
  })

  QUnit.module("Animation Functions",
  {
    beforeEach: function() {
      jinx = window.jinx = new Jinx();
      renderer = new PanelRenderer();
    },
    afterEach: function() {
      jinx = window.jinx = null;
      renderer = null;
    }
  },

  function() {
    QUnit.test("getArtElement from an AssetAnimation", function(assert) {
      var assetAnimation = new AssetAnimation("testArt", "testLayer", 12345);
      assetAnimation.addBeat({
        action: "add",
        startTime: 500,
        endTime: 1500,
        duration: 1000
      }).addBeat({
        action: "remove",
        startTime: 2000,
        endTime: 3000,
        duration: 1000
      });
    });

    QUnit.test("createSnabbtSequence from an AssetAnimation", function(assert) {
      var assetAnimation = new AssetAnimation("testArt", "testLayer", 12345);
      assetAnimation.addBeat({
        action: "add",
        startTime: 500,
        endTime: 1500,
        duration: 1000
      }).addBeat({
        action: "remove",
        startTime: 2000,
        endTime: 3000,
        duration: 1000
      });

      var element = document.createElement('img');
      var sequence = renderer.createSnabbtSequence(assetAnimation, element);

      assert.ok(_(sequence).isArray(), 'returns an array');
      assert.equal(sequence.length, 2, 'array has two items');
      assert.equal(sequence[0][0] && sequence[1][0], element, 'sequence uses the element passed to it (the DOM-instantiated art asset)')
      var firstItem = sequence[0][1];
        assert.equal(firstItem.delay, 500, 'first item delay correct')
        assert.equal(firstItem.duration, 1000, 'first item duration correct')
        assert.equal(firstItem.fromOpacity, 0, 'first item fromOpacity correct')
        assert.equal(firstItem.opacity, 1, 'first item opacity correct')
      var secondItem = sequence[1][1];
        assert.equal(secondItem.delay, 500, 'second item delay correct')
        assert.equal(secondItem.duration, 1000, 'second item duration correct')
        assert.equal(secondItem.fromOpacity, 1, 'second item fromOpacity correct')
        assert.equal(secondItem.opacity, 0, 'second item opacity correct')
    })
  });
});
