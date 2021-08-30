module.exports = {
  api: 'first-api',
  mocks: {
    'GET /bar': {
      status: 200,
      payload: {
        fake: 'true',
      },
      headers: {},
    },
    'POST /bar': (req, res) => {
      res.status(200);
      res.set('X-Mock-Server', 'true');
      res.json({ fake: 'true' });
    },
  },
};
