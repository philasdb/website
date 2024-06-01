const fs = require('fs');
const path = require('path');

let distPath = path.join(__dirname,'dist'); 
let bulletinPath = path.join(distPath, 'bulletin');

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true });
}

fs.mkdirSync(distPath);
fs.mkdirSync(bulletinPath);
console.log('Cleaned dist folder');