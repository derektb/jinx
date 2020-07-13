# Jinx 0.7 Guide

Jinx is a Twine 2 story format for making interactive comics.

## Introduction

Twine is software for creating interactive fiction for the web.  It may be used via a desktop application or in your browser, both available at [twinery.org](http://twinery.org/).

The basic unit of a Twine story is a Passage, which is a self-contained bit of text.  Twine is built for text, and has a lot of tools to minimize or eliminate the need for programming knowledge.

All Twine stories use a "story format", which is like an engine that runs your story.  A story format takes what's inside the passage and displays it on the page.  Many story formats have special markup and syntax for doing fancy code stuff without code knowledge, and they usually have their own basic opinions about how things should be structured and styled.  How all that works depends on what story format you use.

---

_In technical terms: you use the Twine app to write and organize passages for a Twine story, and eventually, to export your completed Story as a single HTML file.  The passages are stored as Twine-specific `<tw-passagedata>` tags within a Twine-specific `<tw-storydata>` tag located on the DOM; the entire story format is contained in its own `<script>` tag.  In general, a story format knows how to turn passages into data and how to parse the text of the passages.  It also decides how those passages should be rendered on the page._

## Jinx

Jinx is a story format built for making interactive comics in Twine, focusing primarily on making comics that display panels sequentially.  Panels can have multiple stages of panel art which can display sequentially in open-ended user-defined animations, allowing for many animatic-style animations to play within a given panel.

You can see example of Jinx comics at my website, [Wizard Town](http://www.wizard.town/).

---

_Jinx is based off Snowman, a minimal Twine story format originally created by Chris Klimas.  At present, the majority of Snowman's base functionality is included in Jinx.  The changes for Jinx are merely extensions of the base engine set out by Snowman; thus, you should still be able to write ordinary Snowman-compatible passages in Jinx._

## A Brief Disclosure Of Bias

I built the interactivity in Jinx to be, primarily, a new way of experiencing comics.  Frequently while reading comics, I would find myself literally only reading them: going from speech bubble to speech bubble, caption to caption, forgetting to stop and enjoy the art, seeing it go by in the periphery.  Jinx, then, is a way of creating comics with *positive friction*: comics which slow the reader down and give them a more temporal, more immersive, more delightful reading experience.

As such: Jinx features for making classical choose-your-own-adventure nonlinearity are, while planned, currently a little sparse.  It doesn't help that I am not overwhelmingly interested in branching narrative within my own work, and favor exploring perspective shifts and subtle variation more than Player Choices™️.

## Working With Jinx

Jinx currently relies on writing JavaScript, but is not meant to require robust programming knowledge; all you need to do to make a basic interactive comic is to follow the cookbook.  Hopefully, this document will guide you through the steps to use Jinx on a basic level.

---

_The Twine app is not a robust IDE; it lacks code hinting and syntax highlighting and all the quality of life stuff you'd want for writing a lot of raw JavaScript.  It can also be a bit hard to debug when your code throws errors._

_For this reason, I have taken to mostly writing comics in an external text editor (my preference is [Atom](https://atom.io/)) and compiling them using [Tweego](https://www.motoslave.net/tweego/), a command-line tool for building Twine games._

## Basic Panel

A Jinx panel is a special kind of passage.  When you visit a passage tagged "panel" for the first time, Jinx will "panelize" it, creating a new Jinx panel and adding it to the passage.  Then it will run whatever you've written inside the actual text of the passage as JavaScript.

Here is the simplest Jinx panel you can define:

```
p.art.assets(
  ["hello", "hello-world.png"]
)

p.art.layers("world")

p.step.create({
  art: "hello",
  layer: "world"
})

p.destination.to("[[next]]")
```

What we've got here is:

- the definition of a single art asset called "hello"
- the definition of a single art layer called "world"
- the creation of a single step of animation, which, when it plays, will render the asset "hello" onto the layer "world"
- and the definition of what passage will be displayed after this one.

`p` is the panel.  It's passed into the panelization function for you to reference: all of the methods to set up the panel's data are on the panel itself, and you'll be calling them to configure the panel.

`p.art.assets()` is the function to define the art assets on the panel.  The two-item array is the simplest way to define an art asset.  The first item, "hello", is the name of the art asset, and the name which will be referenced during your animation definition.  The second item, "hello-world.png", is the filepath of the actual image to use.

`p.art.layers(...)` defines the art layers your panel will use.  Each layer is a panel-sized div.  This can be useful for separating background assets from foreground assets, and in particular, for being able to manage foreground assets separately from speech bubbles and so on.

`p.step.create(...)` is the basic way you define animations for you panel.  A panel has an animation Sequence, composed of animation Steps, composed of step Beats.  When a panel displays, it plays its first Step automatically; when the Step ends, it waits for user interaction.  If it's the last Step, a click will transition to the next passage.  Otherwise, a click will cause the panel to play its next Step.  Thus, a panel with a single Step will appear, and when clicked, transition to a new panel.

The animation Beat API has a bevy of configuration options and best practices.  The only two things absolutely required are the name of an art asset and the name of a layer.  Jinx will assume you're trying to add that art asset to that layer, and will apply default positioning, timing, and effects.

`p.destination.to()` defines a linear destination for this panel; when it has played its last step, and the user clicks to advance, this is the name of the passage it will transition to.  This can be formatted either as a generic string ("next") or as a Twine passage link ("[[next]]"); the latter's benefit is that Twine will recognize the link syntax and visually link the two passages in the interface.

---

_Something to note about panelization.  In ordinary circumstances, panelize (and the code you write for it) is called only once.  It's the setup function for the panel, and as such, will only run the first time a passage is visited._



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

Here are nearly all

```
// verbose props
{
  art: "art",
  layer: "layer",
  effect: "fadeIn",
  apply: "add",
  sync: "with",
  delay: 100,
  duration: 400,
  xy: [100,100]
}

// concise props; identical to previous, just shorter
{
  a: "art",
  l: "layer",
  e: "fadeIn",
  p: "add",
  s: "with",
  d: 100,
  u: 400,
  xy: [100,100]
}

// special beat to execute code during step animation
{
  code: function() { console.log("Hello, world!") }
}
```

### Code

Code Beats are special beats to execute code during animation.  Beats that run code are stand-alone and not tied to art assets or layers.  If you _really_ want to run a function in the same beat where you're working with an art asset, include it in the effect via one of Snabbt's animation hooks.

### Effects

All Jinx animation effects are Snabbt animations.  Refer to documentation about Snabbt for information in how to write them.

#### Easing Functions
Jinx includes [a library for JavaScript easing functions](https://github.com/AndrewRayCode/easing-utils) which may be employed in writing effects.  These are accessible from `jinx.effects.easing.`

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
