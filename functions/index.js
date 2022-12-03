const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const admin = require("firebase-admin");

var serviceAccount = require("./fir-api-3ebf4-firebase-adminsdk-k409v-7ca77949d5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Main App
const app = express();
app.use(cors({ origin: true }));

// Main Database Reference
const db = admin.firestore();

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Its working!");
});

// Create -> post()
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("userDetails").doc(`/${Date.now()}/`).create({
        id: Date.now(),
        name: req.body.name,
        mobile: req.body.mobile,
        address: req.body.address,
      });

      return res.status(200).send({ status: "Success", msg: "Data saved" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: "Error", msg: "Data not saved" });
    }
  })();
});

// Get -> post()
// Fetch - Single data from firestore using specific ID
app.get("/api/get/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("userDetails").doc(req.params.id);
      let userDetail = await reqDoc.get();
      let response = userDetail.data();

      return res.status(200).send({ status: "Success", data: response });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ status: "Error", msg: "It was not possible fetch data" });
    }
  })();
});

// Fetch - All the the details from firestore
app.get("/api/getAll", (req, res) => {
  (async () => {
    try {
      const query = db.collection("userDetails");
      let response = [];

      await query.get().then((data) => {
        let docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            name: doc.data().name,
            mobile: doc.data().mobile,
            address: doc.data().address,
          };

          response.push(selectedItem);
        });

        return response
      });

      return res.status(200).send({ status: "Success", data: response });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ status: "Error", msg: "It was not possible fetch data" });
    }
  })();
});

// Update -> put()
app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("userDetails").doc(req.params.id);
      await reqDoc.update({
        name: req.body.name,
        mobile: req.body.mobile,
        address: req.body.address,
      })

      return res.status(200).send({ status: "Success", msg: "Data updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: "Error", msg: "Data not updated" });
    }
  })();
});

// Delete -> delete()
app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("userDetails").doc(req.params.id);
      await reqDoc.delete()

      return res.status(200).send({ status: "Success", msg: "Data deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: "Error", msg: "Data not deleted" });
    }
  })();
});

// Exports the api to firebase cloud functions
exports.app = functions.https.onRequest(app);
