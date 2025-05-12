// const fs = require('fs');

// const a = fs.readFileSync('file.txt');
// console.log(a.toString());
// console.log("finished reading file");

const { link } = require('node:fs/promises');

(async function(path) {
  try {
    await link(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('file.txt');