var fs = require('fs');
var gm = require('gm');
var csv = require('csv-parser');

var fontSize = 100;
var fontSizeStaff = 120;
var fontSizeSpeaker = 120;
var outputPath = './output/';

var attendePostion = {
  firstName: { x: 100, y: 550 },
  lastName:  { x: 100, y: 650 }
}

var speakerPostion = {
  firstName: { x: 150, y: 610 },
  lastName:  { x: 150, y: 760 }
}

var staffPostion = {
  firstName: { x: 150, y: 610 },
  lastName:  { x: 150, y: 760 }
}

var staffTemplate = './images/staff.jpg';
var speakerTemplate = './images/speaker.jpg';
var attendeTemplate = './images/attende.jpg';

var color = { blue: '#50ABF1', black: '#414141', white: '#ffffff', pink: '#d42d4f' };

var futura = './fonts/futura.ttf';
var futuraBold = './fonts/futura_bold.ttf';
var garamondBold = './fonts/garamond_bold.ttf';
var montserratBold = './fonts/Montserrat-Bold.ttf';

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
  var fileName = person.firstName + '_' + person.id + '.jpg';

  gm(template)
    .fontSize(fontSizeStaff)
    .fill(color.black)
    .font(montserratBold)
    .drawText(staffPostion.firstName.x, staffPostion.firstName.y, person.firstName.toUpperCase(), 'Left')
    .drawText(staffPostion.lastName.x, staffPostion.lastName.y, person.lastName.toUpperCase(), 'Left')
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
      separator: ';',
      headers: ['id', 'firstName', 'lastName', 'twitter']
    }))
    .on('data', function(data) { //don't know why I cannot simply call like this: .on('data' credentials.push)
      credentials.push(data);
    })
    .on('end', createCredential.curry(template, outputFolder, credentials));
}

createCredentialsFromFile(staffTemplate, './staff.csv', 'staff');
// createCredentialsFromFile(speakerTemplate, './speakers.csv', 'speakers');
// createCredentialsFromFile(attendeTemplate, './attendes.csv', 'attendes');
