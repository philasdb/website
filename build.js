
import Handlebars from 'handlebars';
import fs from 'fs'
import path from 'path';
import { format, parseISO } from 'date-fns';

import hymnals from './src/data/hymnals.json'  with { type: "json" };
import * as bible from './bible.js';



const partialsDir = path.join(import.meta.dirname, './src/templates/partials');
const partialFiles = fs.readdirSync(partialsDir);
partialFiles.forEach(file => {
    const name = path.basename(file, '.hbs');
    const template = fs.readFileSync(path.join(partialsDir, file), 'utf8');
    Handlebars.registerPartial(name, template);
});

Handlebars.registerHelper('song', function (data, options) {

    if (data.title) {
        const song = { hymnNumber: data.hymnNumber, title: data.title, url: data.url, hymnal: data.hymnal, artist: data.artist, additionalInfo: data.additionalInfo };
        const template = Handlebars.compile(Handlebars.partials['song']);
        return new Handlebars.SafeString(template(song));
    }
    else if (data.hymnNumber && data.hymnalCode) {
        const hymn = hymnals.find(h => h.Code === data.hymnalCode).Hymns.find(h => h.Number === parseInt(data.hymnNumber));
        if (hymn) {
            const song = { hymnNumber: hymn.Number, title: hymn.Title, url: hymn.Url, hymnal: data.hymnal };
            const template = Handlebars.compile(Handlebars.partials['song']);
            return new Handlebars.SafeString(template(song));
        }
    }
    else {

        const song = { hymnNumber: data };

        if (song.hymnNumber) {
            const hymn = hymnals[0].Hymns.find(h => h.Number === parseInt(song.hymnNumber));
            if (hymn) {
                song.title = hymn.Title;
                song.url = hymn.Url;
                song.hymnal = "Hymns of Faith";
            }
        }

        const template = Handlebars.compile(Handlebars.partials['song']);
        return new Handlebars.SafeString(template(song));
    }
});

Handlebars.registerHelper('encode', function (reference) {
    return encodeURIComponent(reference)
});

Handlebars.registerHelper('formatDate', function (date, formatString) {
    return format(parseISO(date), formatString);
});

Handlebars.registerHelper('scriptureText', function (reference, options) {
    const scriptureMap = options.data.root.scriptureMap;
    let data = scriptureMap.get(reference);
    let verses = data.verses.map(v => `<sup>${v.verse}</sup>${v.text}`).join('');
    let text = `<em>${verses}</em>`;
    return new Handlebars.SafeString(text);
});

async function buildBulletin(data, targetPath) {

    let bulletinTemplatePath = path.join(import.meta.dirname, './src/templates/bulletin.hbs');

    var template = fs.readFileSync(bulletinTemplatePath, "utf8");

    const compiled = Handlebars.compile(template);

    // Fetch the Bible passages
    const scriptureMap = new Map();
    let references = [data.thoughtOfTheDay, data.scriptureReading];
    for (let reference of references) {
        if (scriptureMap.has(reference)) {
            continue;
        }
        let passage = await bible.getPassage(reference);
        scriptureMap.set(reference, passage);
    }

    data.scriptureMap = scriptureMap;
    const result = compiled(data);
    fs.writeFileSync(targetPath, result);
    console.log(`Bulletin ${parsedData.date} built successfully.`);
}

// get argument first argument passed to the script and use it as the data path
const args = process.argv.slice(2);

const dataPath = args[0];
const baseFileName = path.basename(dataPath, '.json');
const data = fs.readFileSync(dataPath, 'utf8');
const parsedData = JSON.parse(data);
//const targetPath = path.join(__dirname, 'src', 'bulletin', `${baseFileName}.html`);

let date = format(parseISO(baseFileName), 'MM-dd-yyyy');
const targetPath = path.join(import.meta.dirname, 'src', 'bulletin', `${date}.html`);

buildBulletin(parsedData, targetPath)
    .then(() => {
        let indexPath = path.join(import.meta.dirname, 'src', 'bulletin', 'index.html')
        fs.copyFileSync(targetPath, indexPath);
        console.log('Build complete.');
    })
    .catch((error) => {
        console.error(error);
    });
