const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USE}:${process.env.DB_PASS}@cluster0.dj17rwm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeesCollection = client.db("coffeesDB").collection("coffees");

    const usersCollection = client.db("coffeesDB").collection("users");



    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    app.post("/coffees", async (req, res) => {
      const newCoffees = req.body;
      const result = await coffeesCollection.insertOne(newCoffees);
      res.send(result);
    });



    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    });



    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const Coffee = {
        $set: {
          category: updatedCoffee.category,
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          taste: updatedCoffee.taste,
          details: updatedCoffee.details,
          supplier: updatedCoffee.supplier,
          photo: updatedCoffee.photo,
        },
      };
      const result = await coffeesCollection.updateOne(filter, Coffee, options);
      res.send(result);
    });



    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });



    // user related api

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });



    app.patch('/users', async (req, res)=>{
      const user = req.body;
      const filter = {email: user.email}
      const updateDoc = {
        $set:{
          lastLoginAt: user.lastLoginAt
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.send(result)
    })




    app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee Server is running");
});

app.listen(port, () => {
  console.log(`coffee server is running on Port ${port}`);
});
