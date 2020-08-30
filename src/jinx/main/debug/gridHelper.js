function orderPanelNames(panelNames) {
  const names = [...panelNames].sort((a,b)=>{
  	const numberA = Number(a.match(/[0-9]+/));
    const numberB = Number(b.match(/[0-9]+/));
    return numberA - numberB
  });

	return names;
}

function renderPanelDisplay(dims) {
	const [width, height] = dims;

	const table = document.createElement("table");
  table.classList.add("panel-display");

  for (let r = 0; r < height; r++) {
  	const row = document.createElement("tr");
    for (let c = 0; c < width; c++) {
    	row.insertAdjacentHTML("beforeend", `<td></td>`);
    }
    table.append(row)
  }
  return table
}

function renderPanelDef(name,dims) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("panel-display-wrapper")
  wrapper.insertAdjacentHTML("beforeend", `<p class="panel-name">${name}</p>`)

  wrapper.append(renderPanelDisplay(dims));

  wrapper.insertAdjacentHTML("beforeend", `<p class="panel-dims">[${dims[0]},${dims[1]}]</p>`)

  return wrapper
}

function renderAllPanels(panels) {

  const mainDiv = document.createElement("div");
  mainDiv.id = "all-panels-display";

	const panelNames = orderPanelNames(Object.keys(panels));

  for (let i = 0; i < panelNames.length; i++) {
    const p = panelNames[i]
    const panelDisplay = renderPanelDef(p,panels[p]);
    const panelColor = (360/panelNames.length)*i;
    panelDisplay.setAttribute("style", `color: hsl(${panelColor}, 75%, 45%)`);
  	mainDiv.append( panelDisplay );
  }

	return mainDiv;
}

module.exports = renderAllPanels;
