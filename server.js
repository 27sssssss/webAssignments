require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const ListingsDb = require("./modules/listingsDB")
const PORT = process.env.PORT || 3000;
const db = new ListingsDb();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send("Api listening")
})
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});