console.log('\x1b[2J\x1b[3J\x1b[H');
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/indexRouter.js');
const mongoConnect = require('./common/mongoConnect.js');
const app = express();

// Connect to mongodb
mongoConnect();
// Use CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use cookie parser
app.use(cookieParser());

app.use('/', indexRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Serving: \x1b[35mhttp://localhost:${port}\x1b[0m`);
});
