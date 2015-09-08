var fs = require('fs');
var gm = require('gm');
var csv = require('csv-parser');

var fontSize = '70';
var outputPath = './output/';
var template = './images/template.jpg';
var color = { blue: '#50ABF1', black: '#414141' };

var futura = './fonts/futura.ttf';
var futuraBold = './fonts/futura_bold.ttf';
var garamondBold = './fonts/garamond_bold.ttf';

Function.prototype.curry = function() {
    if (arguments.length < 1) {
      return this; //nothing to curry with - return function
    }
    var __method = this;
    var args = Array.prototype.slice.call(arguments);
    return function() {
      return __method.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
};

function onEnd(error) {
  if (error) {
    console.log(error);
  }
}

function draw(person) {
  var fileName = person.firstName + '_' + person.id + '.jpg';

  gm(template)
    .fontSize(70)
    .fill(color.black)
    .font(futuraBold)
    .drawText(0, -50, person.firstName, 'Center')
    .font(futura)
    .drawText(0, 50, person.lastName, 'Center')
    .font(garamondBold)
    .fill(color.blue)
    .drawText(0, 180, person.twitter, 'Center')
    .write(outputPath + fileName, onEnd);
}

function cleanTwitter(person) {
  person.twitter = person.twitter.replace('@', '');
  person.twitter = person.twitter.replace('-', '');

  if (person.twitter.length)
    person.twitter = '@' + person.twitter;

  return person;
}

function createCredential(credentials) {
  credentials = credentials.map(cleanTwitter);
  credentials.forEach(draw);
}

function createCredentialsFromFile() {
  var credentials = [];

  fs.createReadStream('./attendes.csv')
    .pipe(csv({
      strict: true,
      separator: ';',
      headers: ['id', 'firstName', 'lastName', 'twitter']
    }))
    .on('data', function(data) { //don't know why I cannot simply call like this: .on('data' credentials.push)
      credentials.push(data);
    })
    .on('end', createCredential.curry(credentials));
}

createCredentialsFromFile();
