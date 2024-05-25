const fs = require('fs');
const path = require('path');




function buildArchive() {


    var f = fs.re

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

        bulletins.sort();


        bulletins.forEach(bulletin => console.log(bulletin));


    });

}



