'use strict';
require('dotenv').config({path: 'sample.env'});
const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const helmet            = require('helmet');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Helmet
app.use(helmet({
  referrerPolicy: { policy: "same-origin" },
  dnsPrefetchControl: {
    allow: false,
  },
  frameguard: {
    action: "sameorigin",
  }
}))

//Sample front-end
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});


// Database connection
const mongoose = require('mongoose');
const DB_OPTIONS = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
};
mongoose
    .connect(process.env.DB, DB_OPTIONS)
    .then(() => console.log('DB connection successful'))
    .catch((err) => console.log('Problem with database connection: ', err));

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
