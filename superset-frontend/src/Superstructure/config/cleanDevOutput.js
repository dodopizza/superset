/**
 * This script cleans the development output directory before each build
 * to prevent accumulation of old files.
 */
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { DEV_OUTPUT_FOLDER } = require('../webpackUtils/constants');

const outputDir = path.resolve(__dirname, '../../../', DEV_OUTPUT_FOLDER);

console.log(`Cleaning development output directory: ${outputDir}`);

// Check if directory exists
if (fs.existsSync(outputDir)) {
  // Remove all files except .gitkeep
  const files = fs.readdirSync(outputDir);

  files.forEach(file => {
    const filePath = path.join(outputDir, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      rimraf.sync(filePath);
      console.log(`Removed directory: ${file}`);
    } else {
      fs.unlinkSync(filePath);
      console.log(`Removed file: ${file}`);
    }
  });

  console.log('Output directory cleaned successfully.');
} else {
  // Create the directory if it doesn't exist
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory: ${outputDir}`);
}
