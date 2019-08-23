const STYLES_ID = 'custom-asset-classnames-styles';
if (!document.getElementById(STYLES_ID)) {
  var textStyling = document.createElement('style');
  textStyling.id = 'custom-asset-classnames-styles';
  textStyling.innerHTML = (`
  .passage--custom-asset-classnames .layer.text .asset {
    padding:10px;
    background-color:white;
    line-height: 1;
  }

  .passage--custom-asset-classnames .layer.text .asset.red-text-asset {
    color: #f00;
    background-color: #fcc;
  }

  .passage--custom-asset-classnames .layer.text .asset.blue-text-asset {
    color: #00f;
    background-color: #ccf;
  }
  `);
  $('body').append(textStyling);
}

p.addArtAssets(
  {
    name: 'red',
    type: 'text',
    classNames: ['red-text-asset'],
    text: "This text asset should be styled red from its custom class.",
    size: [280,0]
  },
  {
    name: 'blue',
    type: 'text',
    classNames: ['blue-text-asset'],
    text: "This text asset should be styled blue from its custom class.",
    size: [280,0]
  },
);
p.addLayers('text');

p.step.create(
  {p: 'add',     a: 'red',  l: 'text', xy: [10,10]},
  {p: 'add',     a: 'blue',  l: 'text', xy: [10,150]},
);

p.destination = { main: '[[->Start]]' };
