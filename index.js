const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rma2v.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const invoiceCollection = client
      .db("sales_invoices")
      .collection("invoices");

    app.get("/invoices", async (req, res) => {
      const query = {};
      const cursor = invoiceCollection.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    app.post("/invoice", async (req, res) => {
      const invoice = req.body;
      const result = await invoiceCollection.insertOne(invoice);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Sales Invoice!");
});

app.listen(port, () => {
  console.log(`Sales Invoice app listening on port ${port}`);
});
