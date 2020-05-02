module.exports = {
  client: {
    service: {
      name: 'focaccia-server',
      url: 'http://localhost:3001/graphql'
    },
    includes: ["./components/**/*.tsx"],
  }
};