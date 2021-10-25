const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const objectId = require("mongodb").ObjectId;
// user:admin
// password: tXF0SRIpvx2yfVVZ

const uri =
  "mongodb+srv://admin:tXF0SRIpvx2yfVVZ@cluster0.ngucd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const usersCollections = database.collection("users");
    // get all value from database
    app.get("/users", async (req, res) => {
      const cursor = usersCollections.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // get single value from database
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const user = await usersCollections.findOne(query);
      console.log("load user with id:", id);
      res.send(user);
    });

    // create a document to insert in database
    app.post("/users/", async function (req, res) {
      const newUser = req.body;
      const result = await usersCollections.insertOne(newUser);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });
    // delete api
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await usersCollections.deleteOne(query);
      console.log("deleting user with id", result);
      res.json(result);
    });

    //UPDATE API
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: objectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating", id);
      res.json(result);
    });

    // const doc = {
    //   title: "Record of a Shriveled Datum",
    //   content: "No bytes, no problem. Just insert a document, in MongoDB",
    // };
    // const result = await usersCollections.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my crud server");
});
app.listen(port, () => {
  console.log("Running my node server", port);
});
