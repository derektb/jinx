var _ = require('underscore');
const Wand = require('Wand');
const Passage = require('Passage');
const Effects = require('Effects');
const Debug = require('Debug');
const Settings = require('Settings');

var Twize = function(){
  this.setup = function(hash) {
    if(this.getSetting("isSetUp") && !hash.override) {
      throw new Error("You have already set up this Twize. If you want to run setup again—well, I don't know why you would, but if you really do, please include 'override: true' in your setup parameters.")
    }

    for (var prop in hash) {
      if (prop === "defaults") {
        this.setDefaults(hash.defaults);
      } else {
        this.setSetting(prop, hash[prop]);
      }
    }

    this.setSetting("isSetUp", true);
  }

  this.effects = new Effects();
  this.createEffect = _(this.effects.create).bind(this.effects); // alias

  this.settings = new Settings();
  this.getSetting = _(this.settings.get).bind(this.settings); // alias
  this.setSetting = function __twize__setSetting(property, value) {
    if (_.has(this.settings, property)) {
      if (typeof this.settings[property] === typeof value) {
        this.settings[property] = value;
      } else {
        throw new Error(`Twize.setSetting: Type of new value does not match type of old value for Twize's "${property}" setting`)
      }
    } else {
      throw new Error(`Twize.setSetting: No such property "${property}" exists as a Twize setting.`)
    }
  }

  this.getDefault = function __twize__getDefault(property) {
    if(_.has(this.settings.defaults, property)) {
      return(this.settings.defaults[property])
    } else {
      console.log("Twize.getDefault: No such property '"+property+"' exists within this Twize's defaults.")
    }
  }
  this.setDefaults = function(hash) {
    if(hash.resetDefaults == true) {
      _.each(this.settings.defaults, function(v,key,defaults) {
        defaults[key] = undefined;
      });
    }
    _.each(hash, this.__setDefaults_iterateOverProps);
  }
  this.__setDefaults_iterateOverProps = function(prop, key) {
    if(_.has(twize.settings.defaults, key)) {
      twize.settings.defaults[key] = prop;
    }
  }

  this.debug = this.debugMode = function() {
    // twize.debug replaces itself with the debug object
    this.debug = new Debug();
  }

  this.wand = new Wand();
}

_.mixin({
  wiz_validCssName: function(name) {
    var nonValidCharacters, validatedName;

    if (name && typeof name === "string") {
      nonValidCharacters = /([^a-zA-Z-_0-9])/g;
      validatedName = name.replace(nonValidCharacters, "-");
      return validatedName;
    } else {
      new Error( "_.wiz_validCssName requires that you pass a string to it, dummy!  Duh!" )
    }
  },

  wiz_findInHistory: function(passageId, how) {
    var method, historySet, found;
    method = how || "last"; // || "first"
    historySet = window.story.history;

    if (method == "last") {
      found = _.lastIndexOf(historySet, passageId);
    } else if (method == "first") {
      found = _.indexOf(historySet, passageId);
    } else throw new Error("_.wiz_findInHistory recieved a bad type of find: has '"+method+"', expects 'last' or 'first'.")

    return found;
  },

  or: function(premise) {
    var result = false;
    for (var i = 1; i < arguments.length; i++) {
      result = (premise === arguments[i]) ? true : result;
    }
    return result;
  },

  xor: function(a,b){
    if ( ( a && !b ) || ( !a && b ) ) {
      return true;
    } else {
      return false;
    }
  },

  hasAll: function(object, array) {
    return _(array).all(function(prop) {
      return _(object).has(prop);
    })
  },

  hasOnly: function(object, array) {
    var objectKeys = _(object).keys().sort();
    return _(objectKeys).isEqual(array.sort());
  },

  isPojo: function(object) {
    if( _.isObject(object) ) {
      return !(
        _.isArray(object) ||
        _.isFunction(object) ||
        _.isDate(object) ||
        _.isArguments(object)
      );
    } else {
      return false;
    }
  },

  deepClone: function(o) {
    return JSON.parse(JSON.stringify(o));
  },

  thumbprint: function(x, b) {
    var tp = [];
    var b = b+""
    var characters = base[b] || base["32"]

    for(var i = 0; i < x; i++) {
      tp.push(_.sample(characters));
    }

    return tp.join("");
  }
});

var base = {
  "10": _("0123456789").toArray(),
  "16": _("0123456789ABCDEF").toArray(),
  "32": _("abcdefghijklmnopqrstuvwxyz234567").toArray(),
  "64": _("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/").toArray()
};

module.exports = Twize;
