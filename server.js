// server.js (replace the single route with this auto-loader)
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const apiDir = path.join(__dirname, 'api');
fs.readdirSync(apiDir).forEach(file => {
  if (!file.endsWith('.js')) return;
  const route = '/api/' + file.replace(/\.js$/, ''); // hello.js -> /api/hello
  const mod = require(path.join(apiDir, file));
  const handler = mod.default || mod; // support default export too

  app.all(route, async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  });

  console.log(`Mounted ${route}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
