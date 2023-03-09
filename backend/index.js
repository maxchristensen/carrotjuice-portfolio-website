const express = require('express'); //include express into backend
const app = express(); //var of app to use express method
const cors = require('cors');
const bodyParser = require('body-parser'); //brings in body parser
const mongoose = require('mongoose'); //mongoose allows backend to talk to mongoDB
const bcrypt = require('bcryptjs');
const config = require('./config.json'); //get config.json information
const Portfolio = require('./models/portfolios');
const User = require('./models/user');

console.log(Portfolio);

const port = 8080; //sets which port number for our local server


app.use(bodyParser.json()); //calling body parser method
app.use(bodyParser.urlencoded({
    extended: false
}));

// when using express (talk to Database) we want to know what the request is and where the request has been sent to.
app.use((req, res, next) => {
    console.log(`${req.method} request ${req.url}`);
    next();
})

// tells express to use cors method
app.use(cors());

app.get('/', (req, res) => res.send("Hello from the backend. YAY")); // send to backend on request

// Setup Mongoose Connection to MongoDB
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('DB Connected'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    })

app.listen(port, () => console.log(`my fullstack app is listening on port ${port}`)) //sent to nodemon - checking serverclear

// ----------product endpoints---------

// Get all porfolios endpoint

app.get('/allPortfolios', (req, res) => {
    Portfolio.find().then(result => {
        res.send(result)
    })
})