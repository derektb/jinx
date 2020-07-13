// a panel constructor which only has one art asset

function simplePanel(p, src, link) {
  p.addArtAssets(
    ["art", src]
  );

  p.addLayers("art");

  p.step.create({
    a: "art",
    l: "layer",
    p: "add"
  })

  p.destination.main = link
}

// note: we could add this to a twize.panels object
//       KEEP IN MIND that should we do this we may run into closure issues
//       Although I suppose that problem is Solved with our instantiate method
// note: we could also create a twize.assets object for building assets
// note: same deal for steps I reckon lol
