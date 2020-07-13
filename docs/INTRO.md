# Jinx 0.7 Guide

Jinx is a Twine 2 story format for making interactive comics.

What follows is a high-level overview of Jinx, the system.  If you're looking for the documentation, [it's here](./DOCS.md).

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

---

[To Documentation >](./DOCS.md)
