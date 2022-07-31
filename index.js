const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // create api for load all invoice
    app.get("/invoices", async (req, res) => {
      const query = {};
      const cursor = invoiceCollection.find(query);
      const invoices = await cursor.toArray();
      res.send(invoices);
    });

    // create api for add new invoice
    app.post("/invoice", async (req, res) => {
      const invoice = req.body;
      const result = await invoiceCollection.insertOne(invoice);
      res.send(result);
    });

    // create api for delete invoice
    app.delete("/invoices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await invoiceCollection.deleteOne(filter);
      res.send(result);
    });

    // create api for single invoice
    app.get("/invoices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await invoiceCollection.findOne(filter);
      res.send(result);
    });

    // create api for update invoice
    app.patch("/invoices/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const invoice = req.body;
      const updateDoc = {
        $set: {
          customer: invoice.customer,
          payableAmount: invoice.payableAmount,
          paidAmount: invoice.paidAmount,
          dueAmount: invoice.dueAmount,
        },
      };
      const result = await invoiceCollection.updateOne(filter, updateDoc);
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
