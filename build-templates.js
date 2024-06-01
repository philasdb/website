const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

function buildBulletinArchivePage() {

    let archiveTemplatePath = path.join(__dirname, 'src', 'templates','bulletin','archive.hbs')

    var template = fs.readFileSync(archiveTemplatePath, "utf8");

    var compiledTemplate = handlebars.compile(template);

    var targetDir = path.join(__dirname, 'src','bulletin');

    var files;
    try {
        files = fs.readdirSync(targetDir);
    } catch (error) {
        console.error(error);
        return;
    }

    var bulletins = []
    files.forEach(file => {
        if (!file.endsWith(".css") && !file.endsWith("index.html") && !file.endsWith("archive.html")) {
            bulletins.push(file);
        }
    });

    bulletins.reverse();

    var archiveDestinationPath = path.join(__dirname, 'src', 'bulletin', 'archive.html');

    console.log(archiveDestinationPath);

    fs.writeFileSync(archiveDestinationPath, compiledTemplate({bulletins}));

    console.log("Bulletin archive page built successfully.");

}

buildBulletinArchivePage();