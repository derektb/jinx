const Utils = {
  unwrapLink: function(name) {
    const wrappedPassageName = /(?:\[\[(?:->)?)(.+)(?:\]\])/;
    const passageNameMatch = name.match(wrappedPassageName);
    const passageName = passageNameMatch ? passageNameMatch[1] : name;
    return passageName;
  }
}

module.exports = Utils;
