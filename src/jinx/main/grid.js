// imported directly from the gridhack I've been using for the past few comics.
// pretty old code and not reconsidered in a while.  adding it for refactoring.

function sizeCss(square, unit) {
  let css = '';
  const sizes = {
    p1:  [1, 1],
    p15: [1.5, 1],
    p5:  [1, 0.5],
    p5v: [0.5, 1],
    p2:  [2, 1],
    p2v: [1, 2],
    p3:  [3, 1],
    p3v: [1, 3],
    p4:  [2, 2],
    p6:  [3, 2],
    p6v: [2, 3],
    p9:  [3, 3],
    p12: [3, 4]
  };

  const labels = Object.keys(sizes);

  labels.forEach(function(p){
    const width = square[0]*sizes[p][0]
    const height = square[1]*sizes[p][1]
    let rule = (
    `.passage.${p} .panel {
      width: ${width}${unit};
      height: ${height}${unit};
    }`)

    css += rule;
  })

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

function positionCss(square, unit, grid) {
  let css = '';
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const rows = alphabet.slice(0, grid[1]).split(/\s*/);
  const columns = alphabet.slice(-1*grid[0]).split(/\s*/);

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

function writeGridCss(hash = {}){
  const square = hash.square || [300,300];
  const unit = hash.unit || "px"
  const grid = hash.grid || [3,4];

	const sizeClasses = sizeCss(square,unit);
  const posiClasses = positionCss(square,unit,grid);
  const gridClass = gridSizeCss(square,unit,grid);
  const css = (sizeClasses + posiClasses + gridClass);

  let gridStyles = document.getElementById("jinx-grid-classes");
  if (!gridStyles) {
    gridStyles = document.createElement('style');
    gridStyles.id = "jinx-grid-classes"
    document.querySelector('body').append(gridStyles);
    document.querySelector('#passages').className += "page";
  }

  gridStyles.innerHTML = css;
}

/* PUBLIC EXPORT */

// gridhack application listener
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

const Grid = function() {
  this.write = writeGridCss;
  this.erase = function(){
    let gridStyles = document.getElementById("jinx-grid-classes");
    if (gridStyles) {
      gridStyles.innerHTML = "";
    }
  }
}

module.exports = Grid
