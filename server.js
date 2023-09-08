import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('bank');
const bankCollection = db.collection('accounts'); 

const port = 3001;
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());

app.get('/api/accounts', async (req,res) => {
const accounts = await bankCollection.find({}).toArray();
res.json(accounts);
});
app.post('/api/accounts', async (req,res) => {
const account = await bankCollection.insertOne(req.body)
res.json(account)
});

app.put('/api/accounts/:id', async (req,res) => {
    const id = req.params.id;
    const account = await bankCollection.updateOne({ _id: new ObjectId(id)}, {$set: { saldo: req.body.saldo}})
    res.json(account)
});
app.delete('/api/accounts/:id', async (req,res) => {
    const id = req.params.id;
    const account = await bankCollection.deleteOne({_id: new ObjectId(id)})
    res.json(account)
});

app.listen(port, () => {
    console.log(port);
});
