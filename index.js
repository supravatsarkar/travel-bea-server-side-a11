const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

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
        const bookingCollection = database.collection('bookingData');

        // GET API FOR ALL SERVICES
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            // console.log(result);
            res.json(result);
        })

        //GET API FOR SINGLE SERVICE
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('single book hit', id);
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.json(result);
        })

        //ADD SERVICE POST API 
        app.post('/addservice', async (req, res) => {
            // console.log(req.body);
            const doc = req.body;
            const result = await serviceCollection.insertOne(doc);
            res.json(result);
        })

        //BOOKING SERVICE POST API
        app.post('/booking', async (req, res) => {
            // console.log(req.body);
            const result = await bookingCollection.insertOne(req.body);
            res.json(result);
        })

        //GET BOOKINGS BY INDIVISUAL USER 
        app.get('/bookings/:userEmail', async (req, res) => {
            const userEmail = req.params.userEmail;
            console.log(userEmail);
            const query = { userEmail: userEmail };
            const result = await bookingCollection.find(query).toArray();
            console.log(result);
            res.json(result);
        })

        //DELETE BOOKING API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            console.log(result);
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