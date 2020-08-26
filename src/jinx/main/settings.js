const Settings = function(){
  this.get = function(prop) {
    if (_(this).has(prop)) {
      return this[prop];
    } else {
      return console.log(`No such setting found: "${prop}"`)
    }
  }

  this.isSetUp = false;

  this.rootArtPath = '';
  this.autoReplace = false;
  this.autoPanelize = false;

  this.defaults = {
    addEffect: 'fadeIn',
    removeEffect: 'fadeOut',
    replaceEffect: ['fadeOut','fadeIn'],
    apply: 'add',
    sync: 'with',
    delay: 0,
    duration: 100,
    flow: 'on',
    easing: function easeOutCubic(t) { return 1+(--t)*t*t }
  };
}

module.exports = Settings;
