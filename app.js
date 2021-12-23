//express
const express = require('express')();
const app = express;
const port = process.env.PORT || 3000;

//middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//cors
// const cors = require('cors');
// app.use(cors);
// load ENV file 
require('dotenv').config()


//mongo config
const {
  MongoClient,
  ObjectId
} = require('mongodb');
//new mongo client
const client = new MongoClient(process.env.FINAL_URL);

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

//GET all by :ID from db
.get('/people/:id', async (req, res) => {

  //id is located in the query: req.params.id
  try {
    //connect db
    await client.connect();

    //retrieve data
    const coll = client.db('StarWarsDb').collection('peoples')

    //only look for with id
    const query = {
      _id: ObjectId(req.params.id)
    };

    const people = await coll.findOne(query)

    if (people) {
      //send back the file
      res.status(200).send(people);
      return;
    } else {
      res.status(400).send("request could not be found with id " + req.params.id)
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "GET by id route error",
      value: error
    })
  }
})

//POST  to db
.post('/people', async (req, res) => {
  try {
    //connect db
    await client.connect();

    //retrieve data
    const coll = client.db('StarWarsDb').collection('peoples');

    // create new  object
    let newPerson = {
      "name": req.body.name,
      "birthyear": req.body.birthyear,
      "species": req.body.species,
      "gender": req.body.gender,
    }

    //insert into db
    let insertResult = await coll.insertOne(newPerson)

    //success message
    res.status(201).json(newPerson)
    return;

  } catch (error) {
    console.log(error);
    res.status(500).send("An error has occured")
  } finally {
    await client.close()
  }

})

//PUT  to db
.put('/people/:id', async (req, res) => {
  try {
    //connect db
    await client.connect();

    //retrieve challenge data from db
    const coll = client.db('StarWarsDb').collection('peoples')

    //only look for a challenge with id
    const query = {
      _id: ObjectId(req.params.id)
    };

    const updateDocument = {
      $set: {
        name: req.body.name,
      }
    };
    // updates document based on query
    await coll.updateOne(query, updateDocument)
    res.status(200).json({
      message: 'Succesfully Updated The Name to : ' + req.body.name
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "PUT request went wrong",
      value: error
    })
  }

})
//DELETE  from db
  .delete('/people/:id', async (req, res) => {
    //id is located in the query: req.params.id
    try {
      //connect db
      await client.connect();

      //retrieve  data
      const coll = client.db('StarWarsDb').collection('peoples')


      //only look for with id
      const query = {
        _id: ObjectId(req.params.id)
      };

      //DELETE 
      await coll.deleteOne(query)
      res.status(200).json({
        message: 'Succesfully Deleted!'
      });


    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "something went wrong",
        value: error
      })
    }
  })

app.listen(port, () => {
  console.log(`REST API is running at http://localhost:${port}`);
}) 