const express = require('express');
// const compression = require('compression');
const expressStaticGzip = require('express-static-gzip');

const app = express();
// app.use(compression());

app.use('/', expressStaticGzip('../dist'));
// app.use(express.static('../dist'));

const port = 8090;

app.listen(port, (err) => {
  if (err) {
    return;
  }
  console.log(`trace-management is started at http://127.0.0.1:${port}`);
});
