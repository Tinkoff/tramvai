module.exports = {
  extends: ['./base.config.js'],
  collector: {
    collect({ test }) {
      process.stdout.write(`Received ${test}`)
      return {
        allPkgs: [],
        affectedPkgs: []
      }
    },
  }
}
