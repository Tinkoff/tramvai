function isRemotePath(path) {
  return path.startsWith('https');
}

module.exports = isRemotePath;
