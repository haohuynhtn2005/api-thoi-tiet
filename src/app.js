console.log('\x1b[2J\x1b[3J\x1b[H');
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/indexRouter.js');
const mongoConnect = require('./common/mongoConnect.js');
const staffRouter = require('./routes/staffRouter.js');
const app = express();
const fileUpload = require('express-fileupload');
const path = require('path');
const adminRouter = require('./routes/adminRouter.js');
const admin = require('firebase-admin');


// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-admin.json");
const News = require('./models/News.js');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to mongodb
mongoConnect();
// Use CORS middleware
app.use(
  fileUpload({
    createParentPath: true,
  })
);
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

app.use('/public', express.static(path.join(`${__dirname}/public`)));
// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use cookie parser
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/staff', staffRouter);
app.use('/admin', adminRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Serving: \x1b[35mhttp://localhost:${port}\x1b[0m`);
});
