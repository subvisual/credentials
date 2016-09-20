const fs = require('fs');
const gm = require('gm');
const csv = require('csv-parser');

const outputPath = './output/';

const colors = {
  pink: '#d4224f',
  blue: '#50ABF1',
  black: '#414141',
  white: '#ffffff',
};

const staffTemplate = './images/staff.jpg';
const speakerTemplate = './images/speaker.jpg';
const attendeTemplate = './images/attende.jpg';

const futura = './fonts/futura.ttf';
const futuraBold = './fonts/futura_bold.ttf';
const garamondBold = './fonts/garamond_bold.ttf';
const montserratBold = './fonts/Montserrat-Bold.ttf';

const attendeDefs = {
  font: montserratBold,
  fontSize: 100,
  color: colors.white,
  firstName: { x: 100, y: 550 },
  lastName:  { x: 100, y: 650 },
  textAlign: 'Left',
  colorSpace: 'CMYK'
}

const speakerDefs = {
  font: montserratBold,
  fontSize: 120,
  color: colors.white,
  firstName: { x: 150, y: 610 },
  lastName:  { x: 150, y: 760 },
  textAlign: 'Left',
  colorSpace: 'CMYK'
}

const staffDefs = {
  font: montserratBold,
  fontSize: 120,
  color: colors.pink,
  firstName: { x: 150, y: 610 },
  lastName:  { x: 150, y: 760 },
  textAlign: 'Left',
  colorSpace: 'CMYK'
}

const onEnd = error => {
  if (error) console.log(error);
}

const draw = (template, outputFolder, defs) => person => {
  const fileName = `${person.firstName}_${person.id}.jpg`;

  gm(template)
    .colorspace(defs.colorSpace)
    .fontSize(defs.fontSize)
    .fill(defs.color)
    .font(defs.font)
    .drawText(defs.firstName.x, defs.firstName.y, person.firstName.toUpperCase(), defs.textAlign)
    .drawText(defs.lastName.x, defs.lastName.y, person.lastName.toUpperCase(), defs.textAlign)
    .write(`${outputPath}${outputFolder}/${fileName}`, onEnd);
}

const cleanTwitter = person => {
  person.twitter = person.twitter.replace('@', '');
  person.twitter = person.twitter.replace('-', '');

  if (person.twitter.length) person.twitter = '@' + person.twitter;

  return person;
}

const createCredential = (template, outputFolder, credentials, defs) => () => {
  credentials = credentials.map(cleanTwitter);
  credentials.forEach(draw(template, outputFolder, defs));
}

const createCredentialsFromFile = (template, file, outputFolder, defs) => {
  const credentials = [];
  const csvOptions = {
    separator: ';',
    headers: ['id', 'firstName', 'lastName', 'twitter']
  };

  fs.createReadStream(file)
    .pipe(csv(csvOptions))
    .on('data', data => credentials.push(data))
    .on('end', createCredential(template, outputFolder, credentials, defs));
}

// createCredentialsFromFile(staffTemplate, './staff.csv', 'staff', staffDefs);
// createCredentialsFromFile(speakerTemplate, './speakers.csv', 'speakers', speakerDefs);
createCredentialsFromFile(attendeTemplate, './attendes.csv', 'attendes', attendeDefs);
