p.grid = "#CXp1"; // hack

p.art.path("../")

p.art.assets(
  ["bg", "test-bg.png"],
  {
    name: "text",
    text: "Positions the panel at CX"
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

p.step.transition(
  {
    code: function(){
      jinx.grid.erase()
    }
  }
)

p.destination.to("[[Start]]")
