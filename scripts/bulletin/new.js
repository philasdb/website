
import fs from 'fs'
import path from 'path';

function copyLatestFileSync(dirPath, destDirPath, newFileName) {
  try {
    const files = fs.readdirSync(dirPath);

    if (files.length === 0) {
      console.log('No files found in the directory.');
      return;
    }

    const filePaths = files.map(file => path.join(dirPath, file));

    const latestFile = filePaths.reduce((latest, current) => {
      const latestStats = fs.statSync(latest);
      const currentStats = fs.statSync(current);
      return latestStats.mtimeMs > currentStats.mtimeMs ? latest : current;
    });

    const destFilePath = path.join(destDirPath, newFileName);

    fs.mkdirSync(destDirPath, { recursive: true }); // Ensure destination directory exists

    fs.copyFileSync(latestFile, destFilePath);
    console.log(`Copied latest file to: ${destFilePath}`);

  } catch (err) {
    console.error(`Error copying latest file: ${err}`);
  }
}

function getNextSaturday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    
    // Calculate days until next Saturday
    let daysUntilNextSaturday = (6 - dayOfWeek + 7) % 7;
    
    // If today is Saturday (daysUntilNextSaturday would be 0), 
    // set it to 7 to get next Saturday instead of today
    if (daysUntilNextSaturday === 0) {
        daysUntilNextSaturday = 7;
    }
    
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilNextSaturday);
    return nextSaturday;
}

function formatWithLeadingZero(number) {
    return String(number).padStart(2, '0');
  }

var nextSaturday = getNextSaturday();

var month = formatWithLeadingZero(nextSaturday.getMonth() + 1);
var day = formatWithLeadingZero(nextSaturday.getDate());

const filename = `${nextSaturday.getFullYear()}-${month}-${day}.json`;

copyLatestFileSync('src/data/bulletins', 'src/data/bulletins', filename);