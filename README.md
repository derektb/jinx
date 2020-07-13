# Jinx

Jinx is a Twine 2 story format for building and running interactive comics in Twine.  It uses sequentially-displayed panels and animated, layer-based, multi-stage panel art to create a more measured, time-based, and delightful reading experience.

It is originally based off the Snowman story format created by Chris Klimas, and is developed maintained by me, Derek Timm-Brock.  Comics I've made with Jinx can be viewed at [wizard.town](http://wizard.town).

## Documentation

...is currently underway.  Sorry!  This is not a public release.

Build from source and look at the `build/format-test.html` to see a variety of test passages, whose source you can view in `test-data/testPassageSrc`.  Panels from version 0.5 onward are considered relatively modern.

If you don't mind incomplete documentation, [here is some incomplete documentation](./docs/INTRO.md).

## Building From Source

Run `npm install` to install dependencies. `grunt` or `grunt build` will create a testing version of the format at `format-test.html`, and `grunt package` will build a release version ready to be used in Twine under `dist/`.

## See Also

- [Snowman](https://github.com/videlais/snowman)
