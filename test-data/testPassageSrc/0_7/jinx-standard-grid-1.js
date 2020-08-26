p.grid = "#AZp1"; // hack

p.art.path("../")

p.art.assets(
  ["bg", "test-bg.png"],
  {
    name: "text",
    text: "Computes the default styles for Jinx grid, then positions at AZ"
  }
)

p.art.layers("art")

p.step.create(
  {
    code: function(){
      jinx.grid.write()
    }
  },
  {
    art: "bg",
    layer: "art"
  },
  {
    art: "text",
    layer: "art",
    s: "after",
  }
)

p.destination.to("jinx-standard-grid-2")
