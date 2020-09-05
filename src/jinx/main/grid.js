// imported directly from the gridhack I've been using for the past few comics.
// pretty old code and not reconsidered in a while.  adding it for refactoring.

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function panelDefCss(square, unit, panelDefs) {
  let css = '';

  for (let p in panelDefs) {
    const width = square[0] * panelDefs[p][0];
    const height = square[1] * panelDefs[p][1];
    let rule = (
    `.passage.${p} .panel {
      width: ${width}${unit};
      height: ${height}${unit};
    }`)

    css += rule;
  }

  return css;
}

function gridSizeCss(square, unit, grid) {
  const width = square[0]*grid[0];
  const height = square[1]*grid[1];
  let css = `#passages.page {
		position: relative;
    width: ${width}${unit};
    height: ${height}${unit};
  }`;

  return css;
}

function panelPositionCss(square, unit, grid) {
  let css = '';
  const rows = ALPHABET.slice(0, grid[1]).split(/\s*/);
  const columns = ALPHABET.slice(-1*grid[0]).split(/\s*/);

  function halver(n){ return [n, n+"h"] }
  function reducer(r,e){
    r.push(e[0], e[1]);
    return r;
  }

  const halfRows = rows.map(halver).reduce(reducer);
  const halfColumns = columns.map(halver).reduce(reducer);

  halfRows.forEach((row, rowOffset)=> {
    halfColumns.forEach((column, columnOffset)=> {
      const left = square[0]*(columnOffset/2);
      const top = square[1]*(rowOffset/2)
      let rule = (
      `.passage.${row}${column} {
        position: absolute;
        top: ${top}${unit};
        left: ${left}${unit};
      }`);

      css += rule;
    })
  })

  return css;
}

function compileGridCss(hash) {
  const {square, unit, grid, panels} = hash;

	const sizeStyles = panelDefCss(square, unit, panels) || "";
  const posiStyles = panelPositionCss(square, unit, grid) || "";
  const gridStyles = gridSizeCss(square, unit, grid) || "";

  return sizeStyles + posiStyles + gridStyles;
}

function writeGridCss(css) {
  let gridStyles = document.getElementById("jinx-grid-classes");
  if (!gridStyles) {
    gridStyles = document.createElement('style');
    gridStyles.id = "jinx-grid-classes"
    document.querySelector('body').append(gridStyles);
    document.querySelector('#passages').className += "page";
  }

  gridStyles.innerHTML = css;
}

function makePanelLabel(number) {
  if (!number) return "p0";

  let numberString = ""+number;
  if (numberString.indexOf(".") !== -1) {
    numberString = numberString.split("").filter(c=>c!==".").join("")
  }

  return `p${numberString}`
}

function computePanelsFromGrid(width=3, height=4, shouldHalve) {
	let panels = {};
  let conflicts = {};

  const pL = makePanelLabel;

  function addPanel(pId,dim) {
  	if (!panels[pId]) {
      	panels[pId] = dim
      } else {
      	if (panels[pId][0] === dim[0] && panels[pId][1] === dim[1]) return;
      	if (!conflicts[pId]) conflicts[pId] = [dim]
        else conflicts[pId].push(dim);
      }
  }

  // compute squares
  for (let w = 1; w <= width; w++) {
    addPanel(pL(w*w),[w,w]);
  }

  const inc = shouldHalve ? 0.5 : 1

  // compute pure horizontals
  for (let w = inc; w <= width; w += inc) {
  	for (let h = inc; h <= w; h += inc) {
      addPanel(pL(w*h),[w,h]);
    }
  }

  // compute pure verticals
  if (height > width) {
  	for (let h = width + inc; h <= height; h += inc) {
    	for (let w = inc; w <= width; w += inc) {
	      addPanel(pL(w*h),[w,h]);
      }
    }
  }

  // resolve conflicts
  for (let p in conflicts) {
    for (let i = 0; i < conflicts[p].length; i++) {
      // any letter except v for exception naming
      panels[`${p}${"abcdefghijklmnopqrstuwxyz"[i]}`] = conflicts[p][i];
    }
  }

  // compute verticalized horizontals
  for (let p in panels) {
    const dim = panels[p];
    if (dim[0] !== dim[1] && dim[1] < width) {
      addPanel(`${p}v`, [dim[1],dim[0]]);
    }
  }

	return panels;
}

/* *** PUBLIC EXPORT **** */

function noGridDataFound() {
  console.log("No grid data found");
  return {};
}

const Grid = function() {
  this.data = noGridDataFound;

  this.write = function(data = {}) {
    const gridData = {
      square: data.square || [300,300],
      unit: data.unit || "px",
      grid: data.grid || [3,4],
      panels: data.panels || {
        p1:  [1, 1],
        p15: [1.5, 1],
        p15v: [1, 1.5],
        p5:  [1, 0.5],
        p5v: [0.5, 1],
        p25:  [0.5, 0.5],
        p2:  [2, 1],
        p2v: [1, 2],
        p3:  [3, 1],
        p3v: [1, 3],
        p4:  [2, 2],
        p4v:  [1, 4],
        p6:  [3, 2],
        p6v: [2, 3],
        p8:  [2, 4],
        p9:  [3, 3],
        p12: [3, 4]
      }
    }

    const css = compileGridCss(gridData)
    this.data = ()=> gridData;

    writeGridCss(css);
  };

  this.erase = function(){
    let gridStyles = document.getElementById("jinx-grid-classes");
    if (gridStyles) {
      gridStyles.innerHTML = "";
    }
    this.data = noGridDataFound
  }

  this.computePanels = function(width, height, shouldHalve) {
    const panels = computePanelsFromGrid(width, height, shouldHalve);
    return panels;
  }

  // gridhack application listener
  /*
     applies grid definitions upon panel rendering.  this should probably be
     moved to panel rendering or passage creation or something.
  */
  $(document).on('jinx.panel.panelized', function(e, data){
    const panelDefFinder = /(\d)?#([A-M]h?[N-Z]h?)(p\d+v?)/
    // find panel definition from passage name
  	let panelDef = passage.name.match(panelDefFinder);

  	if (!panelDef) {
      // if not found, find it in the passage's tags
  		const tagDef = _(passage.tags).find((tag)=>{ return tag[0] === "#" })
  		panelDef = tagDef ? tagDef.match(panelDefFinder) : null;
  	}
    if (!panelDef && passage.panel.grid) {
      // more of a hack for testing, but possibly also a good way of doing it
      panelDef = passage.panel.grid.match(panelDefFinder);
    }
    //
  	if (panelDef) {
  		const [str, page, position, size] = panelDef;
  		const $p = $(passage.panel.selectors.passage);
  		if (position && size) {
        // jinx grid computes classes for position and size
  			$p.addClass(position).addClass(size);
  		}
  	}
  })
}

module.exports = Grid
