/*  gridder hack: js */

function sizeCss(square, unit) {
  let css = '';
  const sizes = {
    p1: [1,1],
    p5: [1,0.5],
    p5v: [0.5,1],
    p2: [2,1],
    p2v: [1,2],
    p3: [3,1],
    p3v: [1,3],
    p4: [2,2],
    p6: [3,2],
    p6v: [2,3],
    p9: [3,3],
    p12: [3,4]
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

twize.grid = function(hash = {}){
  const square = hash.square || [300,300];
  const unit = hash.unit || "px"
  const grid = hash.grid || [3,4];

	const sizeClasses = sizeCss(square,unit);
  const posiClasses = positionCss(square,unit,grid);
  const gridClass = gridSizeCss(square,unit,grid);
  //const css = (sizeClasses + posiClasses + gridClass).replace(/\s/g,""); // BUG this strips essential whitespace

  let style = document.createElement('style');
  style.innerHTML = css;
  document.querySelector('body').append(style);
  document.querySelector('#passages').className += "page";
}

twize.grid()
