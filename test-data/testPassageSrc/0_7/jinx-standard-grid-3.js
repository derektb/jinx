p.grid = "#CXp6";

p.art.path("../")

p.art.assets(
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
