
/********** Server Setup ******************* */
const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 8000;

//app.use(express.urlencoded());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname));
});

app.listen(PORT, () => {
    console.log('Server is starting on PORT, ', PORT);
    console.log('MONGODB_URI: ', process.env.MONGODB_URI);
    add_user();

})
/****************************************** */


const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI; //to reset => $env:MONGODB_URI='<insert uri>'
const dbname = 'writeweb-db';

function add_user() {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) console.log('ERROR MONGODB: ', err, client);
        else {
            var db = client.db(dbname);  //get database object

            var users_collection = db.collection('users');  //get colleciton in database

            var userdoc = {
                username: 'larry',
                password: 'abcde1$',
                email: 'larry@gmail.com',
                createDateTime: { month: 'June', day: 2, year: 2020, hour: 12, minute: 39, second: 57 },
                lastlogin: { month: 'June', day: 1, year: 2020, hour: 13, minute: 0, second: 4 }
            }

            users_collection.insert(userdoc);
        }


    });
}



