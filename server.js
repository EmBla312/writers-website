
/********** Server Setup ******************* */
const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname));
});

app.listen(PORT, () => {
    console.log('Server is starting on PORT, ', PORT);
})
/****************************************** */


const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOLAB_URI; //environment variable storing your connection url - hidden for security purposes

MongoClient.connect(uri, (err, db) => {
    if(!err) console.log("Connection Success");
});


