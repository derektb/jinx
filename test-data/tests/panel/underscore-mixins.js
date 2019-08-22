var Panel = require("Panel");
var _ = require("underscore");

QUnit.module("Underscore Mixins", function() {
  QUnit.test("hasAll mixin works", function(assert) {
    var object = {foo: "", bar: "", baz: "", fizz: "", buzz: ""};
    var requiredProps  = ["foo","bar"];

    assert.ok(_(object).hasAll(requiredProps), "_.hasAll passes with some of its props")

    requiredProps = ["foo","bar","baz","fizz","buzz"];

    assert.ok(_(object).hasAll(requiredProps), "_.hasAll passes with all of its props")

    requiredProps = ["foo","bar","baz","fizz","buzz","garf","gorf"];

    assert.notOk(_(object).hasAll(requiredProps), "_.hasAll fails with all of its props plus some erroneous ones")

    requiredProps = ["garf","gorf"];

    assert.notOk(_(object).hasAll(requiredProps), "_.hasAll fails with only erroneous props")
  })

  QUnit.test("hasOnly mixin works", function(assert){
    var object = {foo: "", bar: "", baz: "", fizz: "", buzz: ""};
    var requiredProps  = ["foo","bar"];

    assert.notOk(_(object).hasOnly(requiredProps), "_.hasOnly fails with only some of its props")

    requiredProps = ["foo","bar","baz","fizz","buzz"];

    assert.ok(_(object).hasOnly(requiredProps), "_.hasOnly passes with all of its props")

    requiredProps = ["foo","bar","baz","fizz","buzz","garf","gorf"];

    assert.notOk(_(object).hasOnly(requiredProps), "_.hasOnly fails with all of its props plus some erroneous ones")

    requiredProps = ["garf","gorf"];

    assert.notOk(_(object).hasOnly(requiredProps), "_.hasOnly fails with only erroneous props")
  })
});
