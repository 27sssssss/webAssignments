const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ListingDB = require("./modules/listingsDB");
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const db = new ListingDB();

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log("Database initialized successfully");
    app.get("/", (req, res) => {
      res.json({ message: "API Listening" });
    });
    app.post("/api/listings", async (req, res) => {
      try {
        const listing = await db.addListing(req.body);
        res.status(201).json(listing);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/api/listings", async (req, res) => {
      try {
        const { page = 1, perPage = 10, name } = req.query;
        const listings = await db.getListings(page, perPage, name);
        res.json(listings);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    const handleRequest = async (res, operation) => {
      try {
        const result = await operation();
        if (!result) {
          return res.status(404).json({ error: "Not Found" });
        }
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    app.get("/api/listings/:id", async (req, res) => {
      await handleRequest(res, () => db.getListingById(req.params.id));
    });

    app.put("/api/listings/:id", async (req, res) => {
      await handleRequest(res, () => db.updateListing(req.params.id, req.body));
    });

    app.delete("/api/listings/:id", async (req, res) => {
      try {
        const result = await db.deleteListing(req.params.id);
        if (!result) return res.status(404).json({ error: "Not Found" });
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    const HTTP_PORT = process.env.PORT || 8080; 
    app.listen(HTTP_PORT, () =>
      console.log(`server listening on: ${HTTP_PORT}`)
    );
  })
  .catch((err) => console.log("Initialization faied:", err));