//express
const express = require('express')();
const app = express;
const port = process.env.PORT || 3000;

// //middleware
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// const cors = require('cors');
// app.use(cors);

//mongo config
const {
  MongoClient,
  ObjectId
} = require('mongodb');
const config = require('./config.json')
//new mongo client
const client = new MongoClient(config.baseUrl);

 //Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

//APP ROUTES
app
.get("/people", async (req, res) => {
  try {
    //Read file//

     //connect db
     await client.connect();
     console.log("Connected correctly to database");

     //use the collection
     const coll = client.db('StarWarsDb').collection('peoples');
     const people = await coll.find({}).toArray();

      //send back the file
      res.status(200).send(people)

    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "GET route error ",
      value: error
    })
  }

})

// //GET all by :ID from db
// .get('/people/:id', async (req, res) => {

//   //id is located in the query: req.params.id
//   try {
//     //connect db
//     await client.connect();

//     //retrieve challeng data
//     const coll = client.db('StarWarsDb').collection('peoples')

//     //only look for a challenge with id
//     const query = {
//       _id: ObjectId(req.params.id)
//     };

//     const people = await coll.findOne(query)

//     if (people) {
//       //send back the file
//       res.status(200).send(people);
//       return;
//     } else {
//       res.status(400).send("request could not be found with id " + req.params.id)
//     }

//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       error: "GET by id route error",
//       value: error
//     })
//   }
// })

app.listen(port, () => {
  console.log(`REST API is running at http://localhost:${port}`);
}) 