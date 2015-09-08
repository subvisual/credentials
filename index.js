'use strict';

var gm = require('gm');

gm('./template3.jpg')
  .fill('#414141')
  .font('./Futura Bold.ttf')
  .drawText(0, -50, 'PIOTR', 'Center')
  .font('./futura.ttf')
  .drawText(0, 50, 'SZOTKOWSKI', 'Center')
  .font('./Adobe Garamond Bold.ttf')
  .fill('#50ABF1')
  .drawText(0, 180, '@reblz', 'Center')
  .fontSize('70')
  .write('./test.png', function(error) {
    if (error) {
      return console.log(error);
    }
    else {
      return console.log('success');
    }
  });
