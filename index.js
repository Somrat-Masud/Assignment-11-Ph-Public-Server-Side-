const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 4005;

//middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1cctsuq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const servicesCollection = client
            .db("bookNameDb")
            .collection("bookHistoryName");
        const bookingCollection = client.db("bookNameDb").collection("bookings");
        const newbookingCollection = client
            .db("bookNameDb")
            .collection("newbookings");
        const historicalbookingCollection = client
            .db("bookNameDb")
            .collection("historicalBook");
        const adventurebookingCollection = client
            .db("bookNameDb")
            .collection("adventureBook");
        const allbookCollection = client.db("bookNameDb").collection("allbook");
        const updateBookingsCollection = client
            .db("bookNameDb")
            .collection("update");

        app.get("/bookHistoryName", async(req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/bookHistoryName/:id", async(req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        });
        //bookings
        app.get("/bookings", async(req, res) => {
            const result = await bookingCollection.find().toArray();
            res.send(result);
        });
        app.get("/newbookings", async(req, res) => {
            const result = await newbookingCollection.find().toArray();
            res.send(result);
        });
        //historicalBook
        app.get("/historicalBook", async(req, res) => {
            const result = await historicalbookingCollection.find().toArray();
            res.send(result);
        });
        app.get("/adventureBook", async(req, res) => {
            const result = await adventurebookingCollection.find().toArray();
            res.send(result);
        });
        //albook
        app.get("/allbook", async(req, res) => {
            const result = await allbookCollection.find().toArray();
            res.send(result);
        });

        app.post("/bookings", async(req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await allbookCollection.insertOne(booking);
            res.send(result);
        });

        //update
        app.get("/singleData/:id", async(req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const updateconfirm = await allbookCollection.findOne(query);
            console.log(updateconfirm);
            res.send(updateconfirm);
        });

        app.put("/update/:id", async(req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };
            const options = { upsert: true };
            const updatedBooks = req.body;
            // console.log(updatedBooks)
            const book = {
                $set: {
                    name: updatedBooks.name,
                    image: updatedBooks.image,
                    authorName: updatedBooks.authorName,
                    category: updatedBooks.category,
                    rating: updatedBooks.rating,
                },
            };
            const result = await allbookCollection.updateOne(filter, book, options);
            res.send(result);
        });

        // search
        app.get("/search/:text", async(req, res) => {
            const text = req.params.text;
            const result = await allbookCollection
                .find({
                    $or: [{ name: { $regex: text, $options: "i" } }],
                })
                .toArray();
            res.send(result);
        });

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
    res.send("Assignment is running");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});