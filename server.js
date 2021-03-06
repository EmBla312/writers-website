
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

var passwordHash = require('password-hash');

const date = new Date(); //for tracking dates of new created users

app.post('/signup-response', (req, res) => {

    console.log('Data: ', req.body.username, req.body.password, req.body.email);

    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) console.log('ERROR MONGODB: ', err, client);
        else {
            var db = client.db(dbname);  //get database object

            var users_collection = db.collection('users');  //get colleciton in database
            
            users_collection.find({ username: req.body.username }).toArray((err, res) => {
                if(err) throw err;
                console.log(res);    //res = an array of all objects/docs in db

                //if there is no existing user with the signup username
                if(res.length < 1) {
                    var userdoc = {
                        username: req.body.username,
                        password: passwordHash.generate(req.body.password),
                        email: req.body.email,
                        createDateTime: date,
                        lastlogin: date
                    }
    
                    users_collection.insertOne(userdoc);
                    console.log('sign up successful: user logged'); 
                    //console.log('password = ', userdoc.password); //check if password is being hashed


                }
                //if user already exists
                else {
                    console.log("username already exists: failed sign up");
                }
            });

        }
    });
});

app.post('/signin-response', (req, res) => {
    console.log('in signin app.post');
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) console.log('ERROR MONGODB: ', err, client);
        else {
            var db = client.db(dbname);  //get database object

            var users_collection = db.collection('users');  //get colleciton in database

            //console.log("Query: ", req.body.username); //check if query is grabbed
            //find how many times username is found within the data base
            var usersCursor = users_collection.find({
                username: req.body.username
            });

            usersCursor.forEach(document => {
                if(passwordHash.verify(req.body.password, document.password) == true){
                    console.log('login successful');
                    res.redirect("/index.html");
                }
                else {
                    console.log('login not successful');
                    
                }
            });

        }
    });
});



