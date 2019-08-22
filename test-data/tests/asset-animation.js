var AssetAnimation = require("AssetAnimation");
var ShadowPanel = require("ShadowPanel");
var _ = require("underscore");

var seq, jinx;

QUnit.module("AssetAnimation",
{
  beforeEach: function() {
    // jinx = window.jinx = new Jinx();
    // passage = new Passage();
  },
  afterEach: function() {
    // jinx = window.jinx = null;
  }
},

function() {
  QUnit.test("AssetAnimation creation works", function(assert) {
    var test = new AssetAnimation("name","layer",12345);
    assert.deepEqual(test.asset, {name: "name", layer: "layer", id: 12345}, "asset properties are get set by constructor");
    assert.equal(test.beats.length, 0, "asset beats property is created and is by default empty");

    assert.throws(function(){new AssetAnimation()}, Error, "AssetAnimation throws an error if no arguments are passed to it");
    assert.throws(function(){new AssetAnimation("foo")}, Error, "...and if only the first argument is passed");
    assert.throws(function(){new AssetAnimation("foo", "bar")}, Error, "...and if only the first two arguments are passed");
  });

  QUnit.test("AssetAnimation.addBeat beats creation works", function(assert) {
    var assetAnimation = new AssetAnimation("name","layer",12345);
    var newBeat = {
      action: "add"
      , duration: 1000
      , _startTime: 0
      , _endTime: 1000
    };

    assetAnimation.addBeat(newBeat);
    assert.deepEqual(assetAnimation.beats[0], newBeat, "First beat is pushed to the beats for this asset")

    var cleanData = assetAnimation.beats.slice();
    assert.throws(function(){assetAnimation.addBeat(newBeat)}, Error, "Pushing a beat whose timing would conflict with a previous beat results in an error")
    assetAnimation.beats = cleanData;

    var newBeat = {
      action: "add"
      , duration: 1000
      , _startTime: 1000
      , _endTime: 2000
    };
    assetAnimation.addBeat(newBeat);
    assert.deepEqual(assetAnimation.beats[1], newBeat, "Second beat is pushed to the beats for this asset")
    assert.throws(function(){ assetAnimation.addBeat({action: "foo", duration: "1000"}) }, Error, "AssetAnimation.addBeat throws an error if not passed required properties.");
  })

  QUnit.module("AssetAnimation \\ ShadowPanel Interaction",
  function() {
    QUnit.test("Creating an asset in the ShadowPanel and giving it to the AssetAnimation constructor results in expected behavior", function(assert){
      var panel, panelLayer, panelAsset,
      assetAnimation, asset, beats,
      foundPanelLayer, foundPanelAsset;

      panel = new ShadowPanel();
      panelLayer = panel.createLayerInstance("layer")
      panelAsset = panelLayer.createAssetInstance("art");
      assetAnimation = new AssetAnimation(panelAsset.name, panelLayer.name, panelAsset.id);
      asset = assetAnimation.asset;
      beats = assetAnimation.beats;

      assert.equal(asset.name, panelAsset.name, "AssetAnimation's asset art name is the same");
      assert.equal(asset.layer, panelLayer.name, "AssetAnimation's asset layer name is the same");
      assert.equal(asset.id, panelAsset.id, "AssetAnimation's asset id is the same");

      foundPanelLayer = panel.layer(asset.layer);
      assert.equal(foundPanelLayer, panelLayer, "AssetAnimation's asset layer can be used to find the layer record in the ShadowPanel")
      foundPanelAsset = panel.asset(asset.id);
      assert.equal(foundPanelAsset, panelAsset, "AssetAnimation's asset id can be used to find the asset record in the ShadowPanel");
    })
  });
});
