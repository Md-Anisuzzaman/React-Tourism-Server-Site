const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhzyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourism');
        const servicesCollection = database.collection('services');

        //Get API

        app.get('/services',async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });

        //POST API

        app.post('/services', async (req, res) => {
            //console.log("hit hit");
            const Service = req.body;
            const result = await servicesCollection.insertOne(Service);
            console.log("added service", result);
            res.send(result);
        });
    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my server for Assignment 11");
});

app.listen(port, () => {
    console.log('Running services Server on Port', port);
});