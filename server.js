
/********** Server Setup ******************* */
const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 8000;

//app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'pages'))); //this sets a static path -> for serving static pages

// app.get('/', (req, res) => {
//     res.sendFile(path.join(_dirname));
// }); // this is done for a single page

app.listen(PORT, () => {
    console.log('Server is starting on PORT, ', PORT);




})
/****************************************** */

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI; //to reset => $env:MONGODB_URI='<insert uri>'
const dbname = 'writeweb-db';

app.use(express.json()); //handle json format?
app.use(express.urlencoded({ extended: true })); //retrieve form data in url?

//so app.post('<insert path>', (callback)), in the <insert path> section, you need to place where the form is.

const date = new Date(); //for tracking dates of new created users

app.post('/signup.html', (req, res) => {

    console.log('Data: ', req.body.username, req.body.password, req.body.email);

    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) console.log('ERROR MONGODB: ', err, client);
        else {
            var db = client.db(dbname);  //get database object

            var users_collection = db.collection('users');  //get colleciton in database

            var usersCursor = users_collection.find({
                username: req.body.username
            });

            usersCursor.forEach(document => {
                if(document.username === req.body.username) {
                    console.log('sign up successful');
                }
                else {
                    var userdoc = {
                        username: req.body.username,
                        password: req.body.password,
                        email: req.body.email,
                        createDateTime: date,
                        lastlogin: date
                    }
        
                    users_collection.insertOne(userdoc);
                }
            });
            
        }
    });
});

app.post('/signin.html', (req, res) => {
    console.log('in signin app.post');
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) console.log('ERROR MONGODB: ', err, client);
        else {
            var db = client.db(dbname);  //get database object

            var users_collection = db.collection('users');  //get colleciton in database

            console.log("Query: ", req.body.username);
            //find how many times username is found within the data base
            var usersCursor = users_collection.find({
                username: req.body.username
            });

            usersCursor.forEach(document => {
                if(document.password === req.body.password) {
                    console.log('login successful');
                }
                else {
                    console.log('login not successful');
                }
            });

        }
    });
});



