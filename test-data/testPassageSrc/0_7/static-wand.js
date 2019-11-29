p.art.path("../")

p.art.assets(
  ["bg", "test-bg.png"],
  ["5", "numbers300/5.png"],
  ["3", "numbers300/3.png"],
  ["7", "numbers300/7.png"]
)

p.art.layers("art")

p.step.create(
  {
    code: function(){
      window.jinx.wand.mode("button");
    }
  },
  {
    art: "bg",
    layer: "art"
  },
  {
    art: "5",
    layer: "art",
    s: "after",
    u: 500,
  }
)

p.step.create(
  {
    art: "3",
    layer: "art",
    u: 500,
  }
)

p.step.create(
  {
    art: "7",
    layer: "art",
    u: 500,
  },
  {
    code: function(){
      $(document).one("hidepassage", ()=>{ window.jinx.wand.mode("panel") });
    },
    s: "after"
  },
)

p.destination.to("new-api");
