p.art.path("../")

p.art.assets(
  ["bg", "test-bg.png"],
  ["5", "numbers300/5.png"]
)

p.art.layers("art")

p.step.create(
  {
    art: "bg",
    layer: "art"
  },
  {
    art: "5",
    layer: "art",
    s: "after",
  }
)

// p.destination.main = "[[Start]]" // regression
p.destination.to("[[Start]]")
