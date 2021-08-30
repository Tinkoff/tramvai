module.exports = {
  collector: {
    collect({ test }) {
      process.stdout.write(`Received ${test}`)
      return {
        allPkgs: [],
        affectedPkgs: []
      }
    },
    cliOpts: [
      {
        name: 'test',
        description: 'Test option'
      }
    ]
  }
}
