var Sequence = require("Sequence");
var Twize = require("Twize");
var Seqel = require("Seqel");
var ShadowPanel = require("ShadowPanel");
var StepAnimation = require("StepAnimation");
var _ = require("underscore");

var seq, twize, stepAnimation;

QUnit.module("StepAnimation",
{
  beforeEach: function() {
    twize = window.twize = new Twize();
    seq = new Sequence();
    stepAnimation = new StepAnimation();
  },
  afterEach: function() {
    twize = window.twize = null;
  }
},

function() {
  QUnit.test("StepAnimation starts with an empty ShadowPanel which can be accessed and overridden via the same method", function(assert){
    var extantShadowPanel = new ShadowPanel().createLayerInstance("fizz").createAssetInstance("buzz");
    assert.ok(stepAnimation.panel, "StepAnimation initialized with a ShadowPanel, accessible via StepAnimation.panel");
    assert.deepEqual(stepAnimation.panel._layers, {}, "...And that ShadowPanel is empty");
    stepAnimation.panel = extantShadowPanel;
    assert.deepEqual(stepAnimation.panel, extantShadowPanel, "It can be replaced manually with a real one.")

    stepAnimation = new StepAnimation(undefined, extantShadowPanel);
    assert.deepEqual(stepAnimation.panel, extantShadowPanel, "It can also be fed to the constructor")
  })

  QUnit.test("Given a Seqel: add, get, and remove asset references from the Shadow Panel", function(assert){
    var seqel = new Seqel({a: "foo", l: "bar"});

    // adding

    var ref = stepAnimation.createRef(seqel);
    assert.ok(ref, "An asset reference can be created.")
    assert.ok(stepAnimation.panel.layer(seqel.layer), "Layer is created in shadow panel with correct name");
    var gottenAsset = stepAnimation.panel.layer(seqel.layer).asset(seqel.art);
    assert.ok(gottenAsset, "Asset is created in said layer with correct name");
    assert.deepEqual(ref, gottenAsset, "StepAnimation.createRef returns the same asset that we just got by hand.")

    // getting

    assert.deepEqual(stepAnimation.getRef(seqel), ref, "StepAnimation.getRef can get that reference via its seqel...");
    assert.deepEqual(stepAnimation.getRef(ref.id), ref, "...or via its id");

    // adding another asset

    seqel = new Seqel({a: "baz", l: "bar"});
    ref = stepAnimation.createRef(seqel);

    assert.ok(_(stepAnimation.panel._layers).hasOnly(["bar"]), "Adding another asset on the same layer does not create a duplicate layer reference");
    assert.equal(stepAnimation.panel.layer(seqel.layer)._assets.length, 2, "Second asset on the layer is added to the layer");

    stepAnimation.createRef(new Seqel({a: "biz", l: "bar"}));
    assert.equal(stepAnimation.panel.layer(seqel.layer)._assets.length, 3, "Third asset is added to the layer");
    stepAnimation.removeAsset(ref.id);

    assert.equal(stepAnimation.panel.layer(seqel.layer)._assets.length, 2, "Assets may be removed from layers");
    assert.notOk(stepAnimation.layer(seqel.layer).asset(ref.id), "Proper asset has been removed from the layer");

    stepAnimation.clearLayer(seqel.layer);

    assert.ok(stepAnimation.panel.layer(seqel.layer), "Clearing a layer in the StepAnimation does not delete the actual layer record.")
    assert.equal(stepAnimation.panel.layer(seqel.layer)._assets.length, 0, "Clearing a layer in the StepAnimation removes all asset sequence records from the layer.")
  });

  QUnit.test("Create an AssetAnimation from a Shadow Panel reference and a Seqel", function(assert){
    var seqel = new Seqel({art: "fizz", layer: "buzz", d: 500, u: 500})
    var step = [seqel];
    var panel = new ShadowPanel();
    var ref = panel.createLayerInstance(seqel.layer).createAssetInstance(seqel.art);
    stepAnimation = new StepAnimation([seqel], panel);

    var assetAnimation = stepAnimation.createAssetAnimation(ref, seqel.timing());

    assert.ok(assetAnimation, "Yes, one was created.")
    assert.deepEqual(assetAnimation.asset, ref, "Its asset is the same as the ref.")
    assert.ok(assetAnimation.beats[0], "Its first beat was created")
    assert.equal(assetAnimation.beats[0].startTime, 500, "...its startTime is correctly delayed...")
    assert.equal(assetAnimation.beats[0].duration, 500, "...its duration is correctly retained...")
    assert.equal(assetAnimation.beats[0].endTime, 1000, "...its endTime is correctly calculated.")
  });

  QUnit.test("AssetAnimation Creation Use Case: ADD ART TO LAYER", function(assert){
    var seqel = new Seqel({art: "fizz", layer: "buzz", d: 500, u: 500})
    stepAnimation = new StepAnimation();

    var assetAnimation = stepAnimation.addArtToLayer(seqel);

    assert.ok(assetAnimation, "Yes, one was created.")
    assert.ok(assetAnimation.beats[0], "Its first beat was created")
    assert.equal(assetAnimation.beats[0].startTime, 500, "...its startTime is correctly delayed...")
    assert.equal(assetAnimation.beats[0].duration, 500, "...its duration is correctly retained...")
    assert.equal(assetAnimation.beats[0].endTime, 1000, "...its endTime is correctly calculated.")
  });

  // QUnit.test("Compare Shadow Panel asset references with extant Asset Sequences and return those that do and don't exist", function(assert){
  // // deprecated test
  // });
});
