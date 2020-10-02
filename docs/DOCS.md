# Jinx 0.7 Documentation

Contents:

* [Packages Included](#packages-included)
* [Jinx](#jinx)
  * [Setup](#jinx-setup)
    * [Debug Mode](#debug-mode)
  * [The Wand](#the-wand)
  * [The Jinx Panel Passage](#the-jinx-panel-passage)
    * [Jinx Panel Rendering](#jinx-panel-rendering)
  * [Jinx Events](#jinx-events)
  * [Jinx Grid](#jinx-grid)
* [Panel Definition](#panel-definition)
  * [Art Assets](#art-assets)
    * [Art Asset Pathing](#art-asset-pathing)
    * [Sprite Assets](#sprite-assets)
  * [Steps](#step-definition)
    * [Required and Default Props](#required-and-default-props)
      * [Art Asset Instancing](#art-asset-instancing)
    * [Apply](#apply)
    * [Timing and Sync](#timing-and-sync)
    * [Effects](#effects)
    * [Code](#code)
  [Destinations](#destination-definition)

## Packages Included

- Jinx uses [Underscore](https://underscorejs.org/) for templating and utility methods.
- Jinx uses [Snabbt](https://daniel-lundin.github.io/snabbt.js/) for JavaScript animations.

# Jinx

Jinx is a singleton object that handles all the stuff relevant to Jinx.

## Jinx Setup



```
jinx.setup({
  rootArtPath: "./art/",
  defaults: {
    duration: 250
  }
})
```

### Debug Mode

By calling `jinx.debug()` you will permanently enter debug mode in the comic.  This will allow you to access the debug panel, which may be toggled open and closed via the tilde/backtick key.

The debug panel:
* Allows you to display any passage in the story at will.
* Allows you to output any passage's src to the console.
* If you have a grid defined, will display helpers to visualize options for that grid.

## The Wand

The Wand represents the user's linear interaction with a Jinx comic.

Typically, The Wand sits on the active panel.  When a user clicks on the panel, it will **advance** the panel to its next [step](#step-definition).  If there isn't one, it will **transition** to that panel's [destination](#destination-definition).

## The Jinx Panel Passage

A Jinx Panel is just a Twine Passage that has been given panel-rendering superpowers.

Passages serving as Jinx Panels are tagged with `panel`.

Passages tagged with `replace` will clear all rendered passages before rendering.

Passages named with a Jinx panel definition are rendered with proper dimensions and page positioning.  If you don't want to name your passage a panel definition, you can include the panel definition in a tag.

## Jinx Panel Rendering

This is a Jinx panel definition, and how that Jinx panel's Twine passage will render to the page:

```

:: Name Of Passage [panel AXp1]
  p.art.assets(
    ["hello", "hello.png"]
  )

  p.layers("world")

  p.step.create(
    {
      art: "hello",
      layer: "world"
    }
  )

  p.destination.to()

<div id="passages" class="page">
  <div class="passage passage--Name-Of-Passage AX p1" historyindex="1">
    <div class="panel wand active will-transition">
      <div class="layer world">
        <img
          assettype="image"
          assetid="hello__rc5qccl"
          assetname="hello"
          src="hello.png"
          class="asset"
          loaded="loaded"
          style="transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); opacity: 1;"
        />
      </div>
    </div>
  </div>
</div>
```
## Jinx Events

Documentation of jinx event system

### Snowman Events

Jinx is built off of Snowman, and retains the set of snowman events related to passage rendering and state:

* `startstory`
* `hidepassage` - triggered when a passage is about to be hidden.  includes passage to be hidden as data
* `showpassage` - triggered immediately before rendering a passage.  includes passage to be shown as data.
* `showpassage:after` - triggered immediately after a new passage is rendered.  includes that passage as data.
* `checkpoint`
* `save`
* `restore`
* `restore:after`

### Jinx Events

Jinx events have to do with panel activity, animation, and interaction.

#### Panel Lifecycle

* `jinx.panel.panelized` - called after passage has completed panelization: panel has been defined by user-supplied function, and panel structure itself has been rendered to dom.  includes panel as data.
* `jinx.panel.advance` - called by Wand to instruct the active panel to advance; typically a response to user interaction.

#### Panel Animations

* `jinx.animation.started` - fires when animation setup begins. typically, the panel will be non-interactive after this point.
* `jinx.animation.playing.begun` - fires when all setup is complete and the animation begins actually playing.
* `jinx.animation.playing.ended` - fires when the animation ends playing. Technically, this fires when the expected synchronized time for the animation has elapsed. If any assets are `sync: "async"`, it will by design fire before they are finished animating.
* `jinx.animation.finished` - fires when the teardown is complete after the end of the animation itself.  Typically, the panel remains non-interactive until this event fires.

#### Internal Events

Should these be in the public docs?  Probably not!  But they are useful to me for now, and good to include for that reason alone.

* `jinx.panel.should-auto-transition`
* `jinx.panel.will-transition`
* `jinx.panel.is-final-panel`
* `all-assets-loaded` - called by shadowpanel when all assets have successfully loaded on the panel; indicates the panel animation is ready to begin

## Jinx Grid

Though it is not strictly required, Jinx assumes you will want to make comics on a strict grid system with standardized panel sizes.  This grid is built by means of `jinx.grid`:

```
// set up your grid as part of initial jinx setup:

jinx.grid.write({
  square: [300,300],    // the dimensions for the grid's 1x1 unit "square"
  unit: "px",           // the css units with which to define the square
  grid: [3,4]           // dimensions (width x height in squares) of the grid
  panels: {
    p1: [1,1],          // panel labels and dimensions (in grid squares)
    p15: [1.5, 1],
    p5:  [1, 0.5],
    p5v: [0.5, 1],
    p2:  [2, 1],
    p2v: [1, 2],
    p3:  [3, 1],
    p3v: [1, 3],
    p4:  [2, 2],
    p6:  [3, 2],
    p6v: [2, 3],
    p9:  [3, 3],
    p12: [3, 4]
  }
})

// remove the grid definition you set up
jinx.grid.erase()

```

The above properties are alse the default values for `jinx.grid.write()`; any values not specified will be filled in with them.

Grid properties can be assigned to panels in one of three ways: as the name of the passage, as a tag on the passage, or as a `p.grid` property defined in the panel definition.

#### Auto-Generation

If you don't want to write your own set of panel sizes, you can generate one from grid size with `jinx.grid.computePanels()`, which takes the arguments `gridWidth` and `gridHeight` (the grid's dimensions in squares), as well as the optional property `shouldHalve`.

If `shouldHalve === true`, panels of half-dimension size will be generated

### Conventions

Panel identities (grid position + panel size) are defined by a a string of pattern `#[grid position][panel size]`.  With default values, a 1x1 panel in the top left corner of the grid is defined as `#AXp1`.

If you're not interested how grid position and panel size labels are generated, just check the debug menu and it'll show you all the options.  Plug those into the `#` + `position` + `size` pattern and you're good to go.

#### Label Names

Panel labels are of format `/p[0-9]+[a-z]*`.  In lay-terms, they are the letter p followed by at least one number and any amount of lowercase letters.

By default (i.e. when auto-generating panel sizes) panel labels are numbered by the product of their dimensions: thus, a [2, 1] panel is a `p2`; a [2, 2] panel is a `p4`; a [3, 2] panel is a `p6`.  Any same-product naming conflicts are postfixed with a letter (e.g., [2, 2] === "p4"; [4, 1] === "p4a").  Panel labels are generated in the following order:

* Generate numbered square panels
* Generate numbered horizontal panels
* Generate vertical versions of horizontal panels; these have the same name as their horizontal versions postfixed with `v`
* Generate numbered vertical panels that are horizontally impossible

If generating half-dimension panels, panel numbering will be the integer product with the decimal place removed (e.g., [1, 0.5] === p05, [0.5, 0.5] === p025, [2.5, 3.5] === p875).

#### Grid Positions

Grid positions are defined as `[Uppercase Row Letter][Uppercase Column Letter]`.

Row letters are assigned sequentially top to bottom from the start of the alphabet.  For the standard 3x4 grid, these are `A B C D`.

Column letters are assigned sequentially right to left from the end of the alphabet.  For the standard 3x4 grid, these are `X Y Z`.

Thus, the full standard 3x4 grid is:

```
[AX][AY][AZ]
[BX][BY][BZ]
[CX][CY][CZ]
[DX][DY][DZ]
```

Jinx also defines half-positions after each letter.  These are assigned with a lowercase `h`.  So a position halfway down from `A` is `Ah`; a position halfway right of `X` is `Xh`.  These are assigned the same way as you would assign a single-letter position, so `AhX`, `AXh`, and `AhXh` are all valid.

# Panel Definition

## Art Assets

Art Assets are defined within the panelization definition (conventionally, at the start) and displayed as instances of the definition via Steps.

The simplest form of an Art Asset is an `<img>` tag rendered on a particular layer `<div>`.  More complicated Art Asset instances are usually `<div>`s

```
p.art.assets(
// basic
  ["foo", "foo.png"],

// object version, identical to previous asset
  {
    name: "foo-2",
    src: "foo.png"
  },

// useRoot: false will escape usual pathing, and use
//   the src as its full path
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
//   to top-level element, either the <img> or the <div>
  {
    name: "fizz",
    src: "fizz.png",
    classNames: ["foo", "bar", "baz"]
  },

// Assets with a "size" property will have their size
//   explicitly defined.  0 for a dimension will be `auto`.
//   Useful for text assets!
  {
    name: "buzz",
    src: "buzz.png"
    size: [200,0]   // in px
  },

// text type asset will render as an asset <div> with the
//   contents of the "text" property rendered as HTML.
//   ArtAsset with text is auto-detected as `type: "text"`
  {
    name: "lipsum",
    type: "text", // not strictly necessary
    text: "Lorem ipsum dolor sit <em>amet</em>."
  },

// Animated Sprite assets covered in their
//   own section further down.
  {
    name: "sprite",
    type: "sprite", // not strictly necessary
    sprite: { /* see below */ }
  }
);
```

Art asset names may not contain # characters, since they are reserved for instance control.  Trying to define an art asset with # in the name will throw an error.

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

### Sprite Assets

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

## Layer Definition

Jinx layers are

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

All Jinx animation effects are [Snabbt](https://daniel-lundin.github.io/snabbt.js/) animations.  Refer to Snabbt's documentation for information on how to write them.

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

## Destination Definition

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
