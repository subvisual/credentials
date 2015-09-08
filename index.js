'use strict';

var gm = require('gm');

var fontSize = '70';
var outputPath = './output/';
var template = './images/template.jpg';
var color = { blue: '#50ABF1', black: '#414141' };

var futura = './fonts/futura.ttf';
var futuraBold = './fonts/futura_bold.ttf';
var garamondBold = './fonts/garamond_bold.ttf';

function onEnd(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log('Success');
  }
}

function test() {
  var fileName = 'test.jpg';

  gm(template)
    .fill(color.black)
    .font(futuraBold)
    .drawText(0, -50, 'PIOTR', 'Center')
    .font(futura)
    .drawText(0, 50, 'SZOTKOWSKI', 'Center')
    .font(garamondBold)
    .fill(color.blue)
    .drawText(0, 180, '@reblz', 'Center')
    .fontSize(fontSize)
    .write(outputPath + fileName, onEnd);
}

test();
