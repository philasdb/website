const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

function build() {

    let archiveTemplatePath = path.join('.', 'templates', 'archive.html')

    var template = fs.readFileSync(archiveTemplatePath, "utf8");

    var compiledTemlate = handlebars.compile(template);

    var targetDir = path.join(__dirname, './bulletin');

    fs.readdir(targetDir, (error, files) => {
        if (error) {
            console.error(error);
        }
        var bulletins = []
        files.forEach(file => {
            if (!file.endsWith(".css") && !file.endsWith("index.html")) {
                bulletins.push(file);
            }
        });

        bulletins.reverse();

        console.log(compiledTemlate({bulletins}))

        archiveDestionation = path.join('..' , 'dist', 'bulletin', 'archive.html')

        fs.writeFileSync(archiveTemplatePath,compiledTemlate({bulletins}));

    });
}

build();



