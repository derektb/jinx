function orderPanelNames(panelNames) {
  const names = [...panelNames].sort((a, b) => {
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
  if (dims[0] % 1) table.classList.add("half-right");
  if (dims[1] % 1) table.classList.add("half-bottom");

  for (let r = 0; r < height; r++) {
    const row = document.createElement("tr");
    for (let c = 0; c < width; c++) {
      row.insertAdjacentHTML("beforeend", `<td></td>`);
    }
    table.append(row)
  }
  return table
}

function renderPanelDef(name, dims) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("panel-display-wrapper")
  wrapper.insertAdjacentHTML("beforeend", `<p class="panel-name">${name}</p>`)

  wrapper.append(renderPanelDisplay(dims));

  wrapper.insertAdjacentHTML("beforeend", `<p class="panel-dims">[${dims[0]},${dims[1]}]</p>`)

  return wrapper
}

function filterObject(obj, predicate) {
	let newObj = {}
  for (let k in obj) {
  	if (predicate(obj[k])) {
      newObj[k] = obj[k];
    }
  }
  return newObj;
}

function renderAllPanels(panels) {

  const mainDiv = document.createElement("div");
  mainDiv.id = "all-panels-display";
  const wholePanels = filterObject(panels, d => !!(!(d[0]%1) && !(d[1]%1)))
  const halfPanels = filterObject(panels, d => !!(d[0]%1 || d[1]%1))
  const panelNames = orderPanelNames(Object.keys(wholePanels)).concat(orderPanelNames(Object.keys(halfPanels)));

  for (let i = 0; i < panelNames.length; i++) {
    const p = panelNames[i]
    const panelDisplay = renderPanelDef(p, panels[p]);
    const panelColor = (360 / panelNames.length) * i;
    panelDisplay.setAttribute("style", `color: hsl(${panelColor}, 75%, 45%)`);
    mainDiv.append(panelDisplay);
  }

  return mainDiv;
}

function renderAllPositions(width, height) {
  const rows = "ABCDEFGHIJKLM"
  const cols = "NOPQRSTUVWXYZ"

  const mainDiv = document.createElement("div");
  mainDiv.id = "all-grid-positions";

  const table = document.createElement("table")
  table.classList.add("grid-display")

  for (let r = 0; r < height; r++) {
    const row = document.createElement("tr");
    for (let c = 0; c < width; c++) {
      const cell = document.createElement("td");
      row.append(cell);
      const R = rows[r];
      const C = cols[cols.length - width + c];

      const positionTable = document.createElement("table");
      positionTable.classList.add("grid-display-cell-positions")
      const r1 = document.createElement("tr");
      const c1 = document.createElement("td");
      c1.innerHTML = `<span>${R}${C}</span>`
      const c2 = document.createElement("td");
      c2.innerHTML = `<span>${R}${C}h</span>`
      const r2 = document.createElement("tr");
      const c3 = document.createElement("td");
      c3.innerHTML = `<span>${R}h${C}</span>`
      const c4 = document.createElement("td");
      c4.innerHTML = `<span>${R}h${C}h</span>`
      r1.append(c1, c2);
      r2.append(c3, c4);
      positionTable.append(r1, r2);
      cell.append(positionTable);
    }
    table.append(row)
  }

  mainDiv.append(table)

  return mainDiv;
}

module.exports = {renderAllPanels, renderAllPositions};
