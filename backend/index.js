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

// ----------portfolio endpoints---------

//-------------all portfolios----------------
app.get('/allPortfolios', (req, res) => {
    Portfolio.find().then(result => {
        res.send(result)
    });
});
app.get('/allUsers', (req, res) => {
    User.find().then(result => {
        res.send(result)
    });
});
// -----------end of all portfolios--------------

// --------------single portfolio by id-----------------
app.get('/singlePortfolio/:id', (req,res) => {
    const idParam = req.params.id;
    Portfolio.findById(idParam).then(result => {
        res.send(result)
    });
});
// ---------end of single portfolio---------------



// -----------add new portfolio from front end form---------------
app.post('/addPortfolio', (req, res) => {
    const dbPortfolio = new Portfolio({
        _id: mongoose.Schema.Types.ObjectId,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        siteUrl: req.body.siteUrl,
        creationDate: req.body.creationDate,
        user_id: req.body.user_id,
        author: req.body.author
    });
    dbPortfolio.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err))
})
// ----------------add new portfolio from frontend end-------------

// ------------------edit portfolio-----------------
app.patch('/updatePortfolio/:id', (req, res) => {
    const idParam = req.params.id;
    Portfolio.findById(idParam, (err, portfolio) => {
        const updatedPortfolio = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            siteUrl: req.body.siteUrl,
        }
        Portfolio.updateOne({
            _id: idParam
        }, updatedPortfolio).
        then(result => {
            res.send(result)
        }).catch(err => res.send(err))
    })
})
//------------end of edit

// ---------------delete portfolio
app.delete('/deletePortfolio/:id', (req, res) => {
    const idParam = req.params.id;
    Portfolio.findOne({
        _id: idParam
    }, (err, portfolio) => {
        if (portfolio) {
            Portfolio.deleteOne({
                _id: idParam
            }, err => {
                console.log('deleted on backend request');
            });
        } else {
            alert('Not found');
        }
    }).catch(err => res.send(err));
}) //-------------end of delete portfolio--------------

// -----------------------------LOGIN USER-------------------
app.post('/loginUser', (req, res) => {
    User.findOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }, (err, userResult) => {
        if (userResult) {
            if (bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('not authorised');
            }
        } else {
            res.send('user not found. Please contact site administrator');
        } 
    }); 
});
// ---------------end of login-----------------

app.get('/singleUser/:id', (req,res) => {
    const idParam = req.params.id;
    User.findById(idParam).then(result => {
        res.send(result)
    });
});