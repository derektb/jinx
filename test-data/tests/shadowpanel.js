var ShadowPanel = require("ShadowPanel");
var _ = require("underscore");

QUnit.module("ShadowPanel",
function() {
  QUnit.test("ShadowPanel public layer creation and access works", function(assert) {
    var sPanel = new ShadowPanel();
    var newLayer = sPanel.createLayerInstance("foo bar");
    assert.ok(newLayer, "New layer can be created via ShadowPanel.createLayerInstance(name)");
    assert.equal(sPanel.layer("foo bar"), newLayer, "New layer is publically accessible via ShadowPanel.layer(name)");
  });

  QUnit.test("ShadowPanel private layer constructor works", function(assert) {
    var sPanel = new ShadowPanel();
    var newLayer = sPanel._layerConstructor("foo");
    assert.ok(_(newLayer).isObject(), "Layer Constructor returns an object, the new layer");
    assert.ok(_(newLayer.asset).isFunction(), "... which has a public asset-accessing method, `asset`");
    assert.ok(_(newLayer._assets).isArray(), "... and a private asset-storing array, `_assets`");
  });

  QUnit.test("ShadowPanel public asset instantiation and removal works", function(assert) {
    var sPanel = new ShadowPanel();
    var newLayer = sPanel.createLayerInstance("foo bar");
    var newAsset = newLayer.createAssetInstance("fizz buzz");
    assert.equal(newAsset.name, "fizz buzz", "ShadowPanel layer objects can instantiate new asset records within themselves with `createAssetInstance(nameOrId)`");

    assert.ok(newAsset.id, "... and those assets are given thumbprinted (though technically non-unique) IDs.  This one's id is '"+newAsset.id+"'");
    assert.equal(sPanel.layer("foo bar").asset("fizz buzz"), newAsset, "Assets are accessible through layer objects' `asset` method, which can be gotten via chaining: ShadowPanel.layer(layerName).asset(assetName)");
    assert.equal(sPanel.layer("foo bar").asset(newAsset.id), newAsset, "... assets can be gotten via their asset name (less specific) or id (more specific)");
    assert.equal(sPanel.asset(newAsset.id), newAsset, "Assets can also be found globally through ShadowPanel.asset().  Best use ids for this only, SVP");

    sPanel.layer("foo bar").createAssetInstance("garf gorf");
    assert.equal(sPanel.layer("foo bar").assets().length, 2, "All of a layer's assets can be gotten through the `assets` method")

    sPanel.layer("foo bar").removeAssetInstance(newAsset.id);
    assert.notOk(sPanel.layer("foo bar").asset("fizz buzz"), "Asset instances can be removed via `removeAssetInstance(`nameOrId`)`")
  });

  QUnit.test("Thumbprinting works", function(assert) {
    var sPanel = new ShadowPanel();
    var tp = sPanel.thumbprint(2);
    assert.ok(_.isNumber(tp),"Thumbprinting outputs a number");
    assert.equal((""+tp).length, 2, "Thumprinting outputs a number of specified digits");

    var tps = [];
    while(tps.length > 50) {
      tps.push(sPanel.thumbprint(5));
    }
    var reliablyCorrectNumberOfDigits = _.every(tps, function(tp) { return (""+tp).length === 5 });

    assert.ok(reliablyCorrectNumberOfDigits, "... and that number of digits is probably reliably the number we want");
  })
});
