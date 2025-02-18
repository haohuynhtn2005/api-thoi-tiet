const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/indexRouter.js');
const mongoConnect = require('./common/mongoConnect.js');
const app = express();

console.log('\x1b[2J\x1b[3J\x1b[H');
// Connect to mongo
// Use CORS middleware
app.use(cors());
// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);

const port = 3000;
app.listen(port, async () => {
  await mongoConnect();
  console.log(`Serving: \x1b[35mhttp://localhost:${port}\x1b[0m`);
});
