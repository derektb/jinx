p.art.path("../")

p.art.assets(
  ["bg", "test-bg.png"],
  ["5", "numbers300/5.png"],
  ["3", "numbers300/3.png"],
  {
    type: "text",
    name: "text",
    text: "This is the penultimate step.  When it's done it should indicate the panel will transition"
  }
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
    u: 500,
    s: "after",
  }
)

p.step.create(
  {
    art: "3",
    layer: "art",
    u: 500,
    s: "after",
  },
  {
    art: "text",
    layer: "art",
    u: 500,
    s: "after"
  }
)

p.step.transition(
  {
    a: "5", l: "art",
    p: "remove",
    u: 500
  },
  {
    a: "3", l: "art",
    p: "remove",
    u: 500,
    d: 200,
    s: "with"
  },
  {
    a: "text", l: "art",
    p: "remove",
    u: 500,
    d: 200,
    s: "with"
  },
  {
    a: "bg", l: "art",
    p: "remove",
    u: 500,
    d: 200,
    s: "with"
  }
)

// p.destination.main = "[[Start]]" // regression
p.destination.to("[[Start]]")
