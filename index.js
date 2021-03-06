const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m4rht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        console.log('db connect');
        const database = client.db('travelbea');
        const serviceCollection = database.collection('services');

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            // console.log(result);
            res.json(result);

        })


    } finally {
        // client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('TravelBea Server running...');
})

app.listen(port, () => {
    console.log('Listening port', port);
})