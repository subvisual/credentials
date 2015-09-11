var fs = require('fs');
var gm = require('gm');
var csv = require('csv-parser');

var fontSize = 70;
var outputPath = './output/';

var staffTemplate = './images/staff.png';
var speakerTemplate = './images/speaker.png';
var attendeTemplate = './images/attende.png';

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

function draw(template, outputFolder, person) {
  var fileName = person.firstName + '_' + person.id + '.png';

  gm(template)
    .fontSize(fontSize)
    .fill(color.black)
    .font(futuraBold)
    .drawText(0, -50, person.firstName, 'Center')
    .font(futura)
    .drawText(0, 50, person.lastName, 'Center')
    .font(garamondBold)
    .fill(color.blue)
    .drawText(0, 180, person.twitter, 'Center')
    .write(outputPath + outputFolder + '/' + fileName, onEnd);
}

function cleanTwitter(person) {
  person.twitter = person.twitter.replace('@', '');
  person.twitter = person.twitter.replace('-', '');

  if (person.twitter.length)
    person.twitter = '@' + person.twitter;

  return person;
}

function createCredential(template, outputFolder, credentials) {
  credentials = credentials.map(cleanTwitter);
  credentials.forEach(draw.curry(template, outputFolder));
}

function createCredentialsFromFile(template, file, outputFolder) {
  var credentials = [];

  fs.createReadStream(file)
    .pipe(csv({
      strict: true,
      separator: ';',
      headers: ['id', 'firstName', 'lastName', 'twitter']
    }))
    .on('data', function(data) { //don't know why I cannot simply call like this: .on('data' credentials.push)
      credentials.push(data);
    })
    .on('end', createCredential.curry(template, outputFolder, credentials));
}

// createCredentialsFromFile(staffTemplate, './staff.csv', 'staff');
// createCredentialsFromFile(speakerTemplate, './speakers.csv', 'speakers');
createCredentialsFromFile(attendeTemplate, './attendes.csv', 'attendes');
