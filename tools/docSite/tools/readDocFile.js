const fs = require('fs-extra');
const fetchFileContent = require('./fetchFileContent');
const isRemotePath = require('./isRemotePath');

function readDocFile(path) {
  return isRemotePath(path) ? fetchFileContent(path) : fs.readFile(path, 'utf-8');
}

module.exports = readDocFile;
