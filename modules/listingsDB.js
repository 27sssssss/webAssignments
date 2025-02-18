const mongoose = require("mongoose");
const Listing = require("./listingSchema");

class ListingDB {
  async initialize(connectionString) {
    try {
      await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("Connected to MDB");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async getListingById(id) {
    try {
      return await Listing.findById(id);
    } catch (error) {
      throw new Error("Error fetching listing: " + error.message);
    }
  }

  async updateListing(id, updatedData) {
    try {
      return await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    } catch (error) {
      throw new Error("Error updating listing: " + error.message);
    }
  }
  async addListing(listingData) {
    try {
      const listing = new Listing(listingData);
      return await listing.save();
    } catch (error) {
      throw new Error("Error adding listing: " + error.message);
    }
  }

  async getListings(page = 1, perPage = 5, name = null) {
    try {
      const pagination = {
        skip: (page - 1) * perPage,
        limit: parseInt(perPage),
      };
      let filter = {};
      if (name) {
        filter = { name: new RegExp(name, "i") };
      }
      const listings = await Listing.find(filter)
        .skip(pagination.skip)
        .limit(pagination.limit);
      return listings;
    } catch (error) {
      throw new Error(`Error while fetching: ${error.message}`);
    }
  }

  async deleteListing(id) {
    try {
      return await Listing.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting " + error.message);
    }
  }
}

module.exports = ListingDB;
