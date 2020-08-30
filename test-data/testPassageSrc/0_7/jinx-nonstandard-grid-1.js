p.grid = "#AZp1"; // hack

p.art.path("../")

p.art.assets(
  ["bg", "test-bg.png"],
  {
    name: "text",
    text: "Computes a nonstandard Jinx grid, then positions at AZ"
  }
)

p.art.layers("color-field", "art")

p.step.create(
  {
    code: function(){
      jinx.grid.write({
        square: [300,400],
        grid: [3,3],
        panels: jinx.grid.computePanels(3,3)
      })
    }
  },
  {
    art: "text",
    layer: "art",
    s: "after",
  }
)

p.destination.to("jinx-nonstandard-grid-2")
