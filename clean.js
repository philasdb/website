const fs = require('fs');
const path = require('path');

let distPath = path.join(__dirname,'dist'); 
let bulletinPath = path.join(distPath, 'bulletin');

fs.rmdirSync(distPath, {recursive: true, force: true});
fs.mkdirSync(distPath);
fs.mkdirSync(bulletinPath);