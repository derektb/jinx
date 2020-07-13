// twize 0.6.7 documentation panel

p.art.path('./art/') // path to prepend to src of all assets defined in this panel

p.addArtAssets(
  ["name1", "src.png"], // SIMPLE ART ASSET (array)
  ["frame", "frame.png"]
  {
    name: "name2",      // COMPLEX ART ASSET (hash)
    src: "src2.png",
    type: "asset",     // "asset" type wraps img inside a div
    size: [100,100]    //  explicit set size (h,w).  falsy values are unset
  },
  {
    name: "text",
    type: "text",      // "text" type renders HTML rather than an image
    text: "Lorem ipsum <br> dolor sit amet"
  }
)

p.addLayers("art", "text", "frame") // layer names must be valid css classes

p.step.create(
  {art: "name1", layer: "art"}, // SIMPLE SEQUENCE ELEMENT (SEQEL):
  {asset: "text", l: "text"}    // all of these will add art to a layer by default.
  {a: "frame", l: "frame"}      // usually we use single-letter property names
);

p.step.create(
  {                // FULL SEQEL:
    a: "name2",    // art (or asset): name of asset, as defined above
    l: "art",      // layer: name of layer asset should be / already is
                   //
    u: 500,        // duration: of animation
    d: 200,        // delay: before animation starts
                   //        (start point defined by sync property)
    p: "add",      // apply: add|remove|replace|effect|code
    s: "after",    // sync: with|after|async
    e: "fadeIn",   // effect: can be name of predefined effect, a hash, or one of
                   //         twize.effects's methods, which also return a hash
    xy: [100,100], // xy: position of asset within the panel
    code: null,    // code: a function to be run after delay, used in code seqels
  }
)

p.destination.main = "[[Name of Next Passage]]" // at present, only main is used
