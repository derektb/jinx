# Jinx 0.7 Documentation

## Packages Included

- Jinx uses [Underscore](https://underscorejs.org/) for templating and utility methods.
- Jinx uses [Snabbt](https://daniel-lundin.github.io/snabbt.js/) for JavaScript animations.

## Art Asset Definitions

Art Assets are defined within the panelization definition (conventionally, at the start) and displayed as instances of the definition via Steps.

The simplest form of an Art Asset is an `<img>` tag rendered on a particular layer `<div>`.  More complicated Art Asset instances are usually `<div>`s

```
p.art.assets(
// basic
  ["foo", "foo.png"],

// object literal version, identical to previous asset
  {
    name: "foo-2",
    src: "foo.png"
  },

// useRoot: false will escape usual pathing, and use
// the src as its full path
  {
    name: "baz",
    src: "http://baz.biz/images/baz.png",
    useRoot: false
  },

// "asset" type — will wrap <img> inside of a <div>
  {
    name: "bar",
    src: "bar.png",
    type: "asset"
  }

// assets with classNames will have class names appended
// to top-level element, either the <img> or the <div>
  {
    name: "fizz",
    src: "fizz.png",
    classNames: ["foo", "bar", "baz"]
  },

// Assets with a "size" property will have their size
// explicitly defined.  0 for a dimension will be `auto`.
// Useful for text assets!
  {
    name: "buzz",
    src: "buzz.png"
    size: [200,0]   // in pix
  },

// text type asset will render as an asset <div> with the
// contents of the "text" property rendered as HTML.
// ArtAsset with text is auto-detected as `type: "text"`
  {
    name: "lipsum",
    type: "text", // not strictly necessary
    text: "Lorem ipsum dolor sit <em>amet</em>."
  },

// Animated Sprite assets will be covered in their
// own section further down.
  {
    name: "sprite",
    type: "sprite", // not strictly necessary
    sprite: { /* see below */ }
  }
);

p.art.path("panel-folder/")
// ^ panel-specific sub-path for these art assets, added
//   after jinx's rootArtPath and before asset's `src`

// "!!SPECULATIVE" Art Asset Instance Control

p.step.create(
// adds an instance of the "foo" asset
   to layer "default"
  {
    art: "foo", l: "default"
  },
// adds instances of the "foo" asset named
// "foo#1" and "foo#2" to that layer
  {
    art: "foo#1", l: "default"
  },
  {
    art: "foo#2", l: "default"
  },
// removes the asset "foo#1" from the layer
  {
    art: "foo#2", l: "default", p: "remove"
  },
// removes all instances of "foo" asset from
// that layer
  {
    art: "foo", l: "default", p: "remove"
  },
)
```

Art asset names may not contain # characters, since they are reserved for instance control.  Trying to define an art asset with # will throw an error.

### Art Asset Pathing

Art assets' paths are constructed from the root art path defined for this Jinx, the path defined for a panel, and the path of the actual art asset.

You set up the first during the Jinx setup method:

```
jinx.setup({ rootArtPath: "http://foo.bar/comic/images/" })
```

And the latter two on the actual panel:

```
p.art.path("panel-hello-world/")

p.art.assets({
  ["hello","hello-world.png"]
})
```

When the asset "hello" is rendered as an `img` tag, its src will be: `http://foo.bar/comic/images/panel-hello-world/hello-world.png`

### Sprite ArtAssets

**_!!SPECULATIVE!! This functionality has not been implemented_**

If you want to have a short frame-by-frame animation in your comic, creating a sprite is a more controlled, performant, and data-efficient route than using an animated GIF.

Jinx, in its current form, expects its spritesheets to be a grid of same-size frames which are read sequentially right-to-left and top-to-bottom.  I personally have used the [ImageMagick](http://www.imagemagick.org/) CLI image editing tool in its [Montage Concatenate Mode](http://www.imagemagick.org/Usage/montage/#concatenate).

```
p.art.assets(
// BASIC SPRITE
// By default, sprites are looping, and will begin
// animating when added to the panel.
//   frameWidth/Height: pixel dimensions of the frame.
//   gridWidth/Height: the number of frames the
//     spriteSheet contains in each row, and how many
//     rows there are.
//   fps: the rate at which frames should display, in
//     frames per second.
//   frames: (optional) the number of frames in the
//     spritesheet.  by default this will be gridW*gridH,
//     so define frames if you have fewer than that.
  {
    name: "sprite",
    sprite: {
      frameWidth: 100,
      frameHeight: 100,
      gridWidth: 5,
      gridHeight: 5,
      fps: 12,
      frames: 24
    },
  },

// TRIGGERED SPRITE
// By default, sprites will begin playing their animation
// when they are added. A non-autoplay sprite will start
// off at frame 1 and wait to be activated
// via a beat.
// looping behavior con also be disabled.
// non-looping sprites by default end on their last
// frame.  sprites that are `return: true` will return
// to their first frame and end there.
  {
    name: "triggered-sprite",
    sprite: {
      frameW: 100, // short forms also accepted
      frameH: 100,
      gridW: 5,
      gridH: 5,
      fps: 12,
      looping: false,
      autoplay: false,
      return: true,
    },
)
```

---

_A word of caution: keep the size of your full spritesheet in mind when implementing sprites.  Aside from loading and data use practicalities, a particularly large spritesheet will visibly take time for the browser to render, even if you're only displaying the one frame.  This will cause lag as the spritesheet loads in, and may introduce unsightly hiccups in your final panel animation._

_It is therefore recommended that you maintain an inverse proportion between the size of sprite and number of frames.  Viz: **if you want a big sprite, use few frames.  If you want a lot of frames, use a small sprite.**  Keep in mind a spritesheet is effectively being rendered full-size on the page, so you can ask yourself whether your size of image would cause problems as-is._

## Step Definition

A Jinx **Step** defines what happens when a player advances the panel.  It is the place where animations are written.  A Panel that behaves like a normal comic panel, with no interactivity or fancy animations, is a Jinx panel with a single Step defined.

A step is composed of individual **Beats**.  In general, a Beat defines one thing happening to one art asset on one layer.  In our hypothetical normal panel, the one Step will add one art asset to one layer.  That's the bare minimum you need to define for a panel to render.

For Steps with multiple Beats, remember that animations are defined sequentially, in a naturalistic way.  When writing an animation, think "this happens, then this happens after that, then this happens at the same time as that..."

Here are the props used in Beat definitions:

```
// verbose props
{
  art: "art",
  layer: "layer",
  apply: "add",
  delay: 100,
  duration: 400,
  sync: "with",
  effect: "fadeIn",
  xy: [100,100]
}

// concise props; identical to previous, just shorter
{
  a: "art",
  l: "layer",
  p: "add",
  d: 100,
  u: 400,
  s: "with",
  e: "fadeIn",
  xy: [100,100]
}

// special beat to execute code during step animation
{
  code: function() { console.log("Hello, world!") }
}
```

### Required and Default Props

Except for [special circumstances](#code), `art` and `layer` are required.

Jinx will supply default values for `apply`, `sync`, `duration`, and `delay`.  It will also apply a different `effect` per the beat's `apply` type _(an `addEffect` or a `removeEffect`)_.  These defaults can all be configured in `jinx.setDefaults({ apply: "add", sync: "with", ...})`.

By default, all art assets are positioned at `xy: [0,0]`, which is to say, the top left corner of the layer.

#### Art Asset Instancing

**_!!SPECULATIVE!! This functionality has not been implemented_**

Multiple instances of an art asset can be added to a single layer.  By default, however, you won't be able to work intelligently with them, such as removing or applying effects to them individually, by name.

When you want to do this, you can explicitly name instances of these art assets to be able to reference them later on:

```
p.step.create(
  {
    a: "asset#foo",     // add an instance of "asset" named "foo"
    l: "art"            // to layer "art"
  },
  {
    a: "asset#bar",     // add another instance of "asset", this one
    l: "art"            // named bar, to layer "art"
  }
);

p.step.create(
  {
    p: "effect",
    e: "bounceVert",    // apply the effect bounceVert to "foo"
    a: "asset#foo",
    l: "art"
  },
  {
    p: "effect",
    e: "bounceHoriz",   // apply a different effect bounceHoriz to "bar"
    a: "asset#foo",
    l: "art"
  }
);
```

### Apply

Apply defines what Jinx should do with the art asset in question:

* `apply: "add"` — adds an instance of the asset to the layer
* `apply: "remove"` - removes an instance of that art asset from the layer
* `apply: "replace"` - removes everything from the layer, then adds an instance of that art asset to the layer.

### Timing and Sync

`duration` is how long the animation defined by this Beat's [effect](#effects) will last.  `delay` is the amount of time to wait before starting that animation.

`sync` defines the timing relationship this Beat has to the one immediately before it.

* `sync: "after"` — this beat's timing starts from when the previous beat has finished playing: i.e. after its **duration** is over.
* `sync: "with"` - this beat's timing starts from when the previous beat has started playing: i.e. after its **delay** is over.
* `sync: "async"` - this beat's timing starts from the beginning of the panel, and beats after it will not sync to it.

```
adding three assets to the panel:
synced "with":
1: [   delay   |---duration---]
2:             [---duration---]
3:             [   delay   |---duration---]

synced "after":
1: [   delay   |---duration---]
2:                            [---duration---]
3:                                           [   delay   |---duration---]

synced "async":
1: [   delay   |---duration---]
2: [---duration---]
3: [   delay   |---duration---]
```

Take care with your timing and sync definitions.  Beats on different assets may, of course, overlap, but multiple Beats on the same asset must be sequential:

```
adding and removing an asset:
OK:
  add: [   delay   |---duration---]
  rem:                             [---duration---]


ERROR:
  add: [   delay   |---duration---]
  rem:                     [---duration---]
```

### Effects

All Jinx animation effects are Snabbt animations.  Refer to documentation about Snabbt for information in how to write them.

#### Easing Functions
Jinx includes [a library for JavaScript easing functions](https://github.com/AndrewRayCode/easing-utils) which may be employed in writing effects.  These are accessible from `jinx.effects.easing.`

### XY

The XY property defines where the art asset will be placed within its layer.  By default, this is at `xy: [0,0]`, the top left corner.  `xy` definition is in pixels.

Helpfully, [effects](#effects) defined with `positionFrom` and `position` will use those coordinates as **local with respect to their `xy` position**.  This means you can have an effect defined for an asset to fade in and slide down, and Jinx will animate that the way you'd expect:

```
{
  a: "hello", l: "world",
  e: {
    opacityFrom: 0,
    opacity: 1,
    positionFrom: [0, -50, 0],  // -50 from its final y value.
    positionTo: [0,0,0]         // at its final xy position
  }
  xy: [150, 150]                // its final xy position
}

// as you might expect, this asset will slide down
// from [150, 100] to [150, 150]
```

### Code

Code Beats are special beats to execute code during animation.  Beats that run code are stand-alone and not tied to art assets or layers.  If you _really_ want to run a function in the same beat where you're working with an art asset, include it in the effect via one of Snabbt's animation hooks.

## Destinations

```
// TO: linear destination
p.destination.to("[[next-passage]]");       // no logic. goes directly
                                            // to named passage.
// VAR: variable destination
p.destination.var("passageNameOnState");    // gets name of passage from
                                            // state[theArgument]

// IF: binary destination
p.destination.if(                           // gets boolean value from named
  "propOnState",                            // property on state.
  "[[true-passage]]", "[[false-passage]]");

p.destination.if(                           // can also be given a function
  function() {                              // to evaluate.
    return story.state.propOnState
  },
  "[[true-passage]]", "[[false-passage]]");

// SWITCH: nonlinear destination
p.destination.switch({
  check: "propOnState",                     // value of property from state
  foo: "[[foo-passage]]",                   // mapped to keys
  bar: "[[bar-passage]]",
  baz: "[[baz-passage]]",
  default: "[[next-passage]]"
});

p.destination.switch({
  check: function() {                       // like destination.if, can also
    return _(["foo","bar","baz"]).sample()  // use a callback rtrtn a
  },                                        // state property
  foo: "[[foo-passage]]",
  bar: "[[bar-passage]]",
  baz: "[[baz-passage]]",
  default: "[[next-passage]]"
});
```

## Interactivity

**_!!SPECULATIVE!! This functionality has not been implemented_**

Interactions are defined on art assets via the "interaction" or "i" property on a given beat.  It can be defined on an existing art asset, or it can create an interactive asset.  Personally, I recommend placing interaction assets in their own dedicated layer at the top of the rest of your layers.


```
p.art.assets(
  ["look-me",  "look-me.png"],
  ["click-me", "click-me.png"]
)
p.art.layers( "art", "interact" );

p.step.create(
  {
    a: "look-me", l: "art"
  }
);
```

## Cookbook

### A Reusable One-Art Panel Builder

If your comic has a lot of straightforward one-art one-layer panels, and/or you want to build out a comic pretty quickly, you can write a function that

```
:: In Your Story Javascript:
window.basicPanel = function(p, artPath, assetPath, destination) {
  p.art.path(artPath);

  p.art.assets(
    ["art", assetPath]
  )

  p.layers("art")

  p.step.create({
    a: "art",
    l: "art"
  });

  p.destination.to(destination);
}

:: Your Panel
basicPanel(p, "panel-folder/", "panel-art.png", "[[next-passage]]")
```

### Writing a CSS Background Using An Asset's Computed Path

This is a way to generate CSS on the fly that leverages your existing file structure and Jinx / panel settings, and doesn't require you to write static CSS that you'll need to change when moving from a local working copy to your final published version on the web.

```
p.art.assets(
  ["foo", "bar.png"]
);

const fooPath = p.art.asset('foo').path();
const style = document.createElement('style');
style.innerHTML(
`.foo-background { background-url: url('${fooPath}'); }`
)
```
