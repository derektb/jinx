p.grid = "#BYp1"; // hack

p.art.path("../")

p.art.assets(
  ["bg", "test-bg.png"],
  {
    name: "text",
    text: "Positions the panel at BY"
  }
)

p.art.layers("color-field", "art")

p.step.create(
  {
    art: "text",
    layer: "art",
    s: "after",
  }
)

p.destination.to("jinx-nonstandard-grid-3")
