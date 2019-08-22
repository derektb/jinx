var Sequence = require("Sequence");
var Jinx = require("Jinx");
var Seqel = require("Seqel");
var ShadowPanel = require("ShadowPanel");
var _ = require("underscore");

var seq, jinx;

QUnit.module("Sequence Tests | Animation",
{
  beforeEach: function() {
    jinx = window.jinx = new Jinx();
    seq = new Sequence();
  },
  afterEach: function() {
    jinx = window.jinx = null;
  }
},

function() {

  /* Methods used by Sequence.getAnimation() */

  QUnit.test("Sequence.getStepData() returns the array of Seqels corresponding to the current position held in Sequence.pos", function(assert) {
    assert.ok(seq.getStepData, "Sequence.getStepData exists.");

    seq.addStep( {a: "fee", l: "layer"}, {a: "fie", l: "layer"} );
    seq.addStep( {a: "foe", l: "layer"}, {a: "fum", l: "layer"} );

    assert.deepEqual(seq.pos, {index: 0, track: 'default'}, "(Sequence.pos has default settings upon a new Sequence)");

    var expectedStep = [
      new Seqel({a: "fee", l: "layer"}),
      new Seqel({a: 'fie', l: 'layer', flow: 'stop'})
    ];
    var stepData = seq.getStepData();

    assert.deepEqual(stepData.step, expectedStep, "getStepData() gets the expected step.")
    assert.equal(stepData.data.lastIndex, 1, "getStepData() returns the final index, for updatePos use later if the step is valid.")
    assert.equal(stepData.data.isFinalStep, false, "getStepData() recognizes and returns whether the step it just read is the last step in this track.")
    assert.deepEqual(seq.pos, {index: 0, track: 'default'}, "Sequence.pos is unchanged by the getting.");
    assert.deepEqual(stepData.step, expectedStep, "getStepData() will get the same step if run again.")
  });

  QUnit.module("createAssetAnimationsFromStep()", function(){

    QUnit.test("Returns a hash containing per-asset animation-description chains (AssetAnimations), an updated shadow panl (?), and some timing information.", function(assert) {
      var step, assetAnimations;
      var shadowPanel = new ShadowPanel();
      assert.ok(seq.createAssetAnimationsFromStep, "Sequence.createAssetAnimationsFromStep exists.")

      seq.addStep(
        {art: "foo", layer: "fizz"},
        {art: "bar", layer: "buzz"}
      );
      step = seq.getStepData().step;

      assetAnimations = seq.createAssetAnimationsFromStep(step, shadowPanel);
      var assets, panel;
      assets = assetAnimations.assets;
      panel = assetAnimations.panel;

      assert.ok(assetAnimations, "createAssetAnimationsFromStep returns an object")
      assert.deepEqual(_.keys(assetAnimations), ['assets', 'panel', 'timing'], "assetAnimations contains assets, the updated shadow panel information, and some timing data");

      assert.equal(assets.length, 2, "Test step of two art assets result in two assets stored inside assetAnimations.assets");
      assert.ok((panel.layer("fizz") && panel.layer("buzz")), "createAssetAnimationsFromStep returned an updated ShadowPanel with expected 2 new layers");

      // assert.ok(assetAnimations.animations, "That object intends to contain its animations within an animations property")
      // assert.deepEqual(_.keys(assetAnimations.animations), ["fee#0 layer", "fie#0 layer", "fee#1 layer", "foe#0 layer"], "the animations property stores animations on a per-art-asset basis, within art-asset-identifying keys");
      //
      // assert.equal(assetAnimations.animations["fee#0 layer"],
      //   [{startTime: 0, endTime: testDuration, snabbtProps: {duration: testDuration, fromOpacity: 0, opacity: 1}},
      //    {startTime: testDuration*2, endTime: testDuration*3, snabbtProps: {duration: testDuration, fromOpacity: 1, opacity: 0}}], "A given AssetAnimation contains properties which describe the salient points in this ArtAsset's lifetime.  Oh, by the way—this assert is kinda garbage.  Sorry!");

      // There's actually a lot of atomic functionality that needs to go into this function, so I'd best stop and go over the things:
      //    - getAssetAnimations has to *understand* (or delegate) what happens to an artAsset within the context of snabbt.  Basically all this means is:
      //      - When something start to happens to an art asset
      //      - When something is finished happening to an art asset
      //      - Making sure separate simultaneous things aren't happening to an art asset
      //      - What snabbt things are happening to an art asset.
      //  (everything else is probably not important)
      //  But then again, getAssetAnimations is the gatekeeper for all animations, so in theory, it has to be flexible, too.  Smart.  Delegating a lot.
    });

    QUnit.test("... This test specifically tests, rigorously, an ({add},{replace after}) step, of the sort that produced a bugs in Jinx 0.4, and which tests the ability for the 0.5 animation system to translate layer-wide effects into per-individual-asset effects", function(assert) {
      var step, assetAnimations;
      var shadowPanel = new ShadowPanel();
      seq.addStep(
        {art: "A", layer: "L", apply: "add", duration: 1000, sync: "with"},
        {art: "B", layer: "L", apply: "replace", duration: 1000, sync: "after"});
        step = seq.getStepData().step;
        assetAnimations = seq.createAssetAnimationsFromStep(step, shadowPanel);

        assert.equal(assetAnimations.assets.length, 2, "Both assets involved in this step have been added to the assetAnimations assets property");
        assert.equal(assetAnimations.assets[0].sequence.length, 2, "First asset has a sequence with two beats")
        assert.equal(assetAnimations.assets[0].sequence[0].action, "add", "... the first beat is the asset being 'added'.")
        assert.equal(assetAnimations.assets[0].sequence[1].action, "remove", "... the second beat is the asset being 'removed', when it is replaced by the second asset.")
        assert.equal(assetAnimations.assets[1].sequence[0]._startTime, 1000, "... the second asset is removed at _startTime === 1000.")
        assert.equal(assetAnimations.assets[1].sequence.length, 1, "Second asset has a sequence of one beat")
        assert.equal(assetAnimations.assets[1].sequence[0].action, "add", "... that beat is the asset being 'added' at the same time as the first asset is being 'removed'.")
        assert.equal(assetAnimations.assets[1].sequence[0]._startTime, 1000, "... the second asset is added at _startTime === 1000.")
      });

  });

  /* Sequence.getAnimation() */

  QUnit.test("Sequence.getAnimation() returns an Animation object which the Panel can get information from and decide what to do with.", function(assert) {
    var animation;

    assert.ok(Sequence.getAnimation, "Sequence.getAnimation exists.")

    seq.addStep( {a: "fee", l: "layer"}, {a: "fie", l: "layer"} );
    seq.addStep( {a: "foe", l: "layer"}, {a: "fum", l: "layer"} );

    animation = seq.getAnimation();

    assert.equal(seq.pos.index, 2, "Sequence.getAnimation updates the position")
    assert.notOk(animation.isLast, "Sequence.getAnimation knows whether this will be the final animation in this context (For this test, it won't be)")

    animation = seq.getAnimation();

    assert.ok(animation.isLast, "Sequence.getAnimation knows whether this will be the final animation in this context (For this test, it will be)")
  })
})
