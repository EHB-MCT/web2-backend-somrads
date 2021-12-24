//express
const express = require('express')();
const app = express;
const port = process.env.PORT || 3000;

//middleware
//cors
const cors = require('cors');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
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
// people routes
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

//GET all PEOPLE by :ID from db
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

//POST PEOPLE to db
.post('/people',cors(), async (req, res) => {
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

//PUT PEOPLE to db
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
//DELETE PEOPLE  from db
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


// MOVIE ROUTES

// get all FILMS
.get("/films", async(req, res)=> {
  try {
    //Read file//

     //connect db
     await client.connect();
     console.log("Connected correctly to database");

     //use the collection
     const coll = client.db('StarWarsDb').collection('films');
     const film = await coll.find({}).toArray();

      //send back the file
      res.status(200).send(film)

    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "GET route error FILMS ",
      value: error
    })
  }

})

// get FILMS by id
.get('/films/:id', async (req, res) => {

  //id is located in the query: req.params.id
  try {
    //connect db
    await client.connect();

    //retrieve data
    const coll = client.db('StarWarsDb').collection('films')

    //only look for with id
    const query = {
      _id: ObjectId(req.params.id)
    };

    const film = await coll.findOne(query)

    if (film) {
      //send back the file
      res.status(200).send(film);
      return;
    } else {
      res.status(400).send("request could not be found with id " + req.params.id)
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "GET by id route error FILMS",
      value: error
    })
  }
})

//POST FILMS to db
.post('/films',cors(), async (req, res) => {
  try {
    //connect db
    await client.connect();

    //retrieve data
    const coll = client.db('StarWarsDb').collection('films');

    // create new  object
    let newFilm = {
      "title": req.body.title,
      "episode_id": req.body.episode_id,
    }

    //insert into db
    let insertResult = await coll.insertOne(newFilm)

    //success message
    res.status(201).json(newFilm)
    return;

  } catch (error) {
    console.log(error);
    res.status(500).send("POST FILM error has occured")
  } finally {
    await client.close()
  }

})

//PUT FILMS to db
.put('/films/:id', async (req, res) => {
  try {
    //connect db
    await client.connect();

    //retrieve challenge data from db
    const coll = client.db('StarWarsDb').collection('films')

    //only look for a challenge with id
    const query = {
      _id: ObjectId(req.params.id)
    };

    const updateDocument = {
      $set: {
        title: req.body.title,
      }
    };
    // updates document based on query
    await coll.updateOne(query, updateDocument)
    res.status(200).json({
      message: 'Succesfully Updated The Name to : ' + req.body.title
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "PUT FILMS request went wrong",
      value: error
    })
  }

})

//DELETE FILMS  from db
.delete('/films/:id', async (req, res) => {
  //id is located in the query: req.params.id
  try {
    //connect db
    await client.connect();

    //retrieve  data
    const coll = client.db('StarWarsDb').collection('films')


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
      error: "DELETE FILM error",
      value: error
    })
  }
})


// PLANET ROUTES ///

// get PLANETS
.get("/planets", async(req, res)=> {
  try {
    //Read file//

     //connect db
     await client.connect();
     console.log("Connected correctly to database");

     //use the collection
     const coll = client.db('StarWarsDb').collection('planets');
     const planet = await coll.find({}).toArray();

      //send back the file
      res.status(200).send(planet)

    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "GET route error PLANETS ",
      value: error
    })
  }

})

// get FILMS by id
.get('/planets/:id', async (req, res) => {

  //id is located in the query: req.params.id
  try {
    //connect db
    await client.connect();

    //retrieve data
    const coll = client.db('StarWarsDb').collection('planets')

    //only look for with id
    const query = {
      _id: ObjectId(req.params.id)
    };

    const planet = await coll.findOne(query)

    if (planet) {
      //send back the file
      res.status(200).send(planet);
      return;
    } else {
      res.status(400).send("request could not be found with id " + req.params.id)
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "GET by id route error PLANETS",
      value: error
    })
  }
})

//POST FILMS to db
.post('/planets',cors(), async (req, res) => {
  try {
    //connect db
    await client.connect();

    //retrieve data
    const coll = client.db('StarWarsDb').collection('planets');

    // create new  object
    let newPlanet= {
      "name": req.body.name,
      "population": req.body.population,
      "terrain": req.body.terrain,
    }

    //insert into db
    let insertResult = await coll.insertOne(newPlanet)

    //success message
    res.status(201).json(newPlanet)
    return;

  } catch (error) {
    console.log(error);
    res.status(500).send("POST PLANET error has occured")
  } finally {
    await client.close()
  }

})

//PUT PLANETS
.put('/planets/:id', async (req, res) => {
  try {
    //connect db
    await client.connect();

    //retrieve challenge data from db
    const coll = client.db('StarWarsDb').collection('planets')

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
      error: "PUT PLANET request went wrong",
      value: error
    })
  }

})

//DELETE PLANETS  from db
.delete('/planets/:id', async (req, res) => {
  //id is located in the query: req.params.id
  try {
    //connect db
    await client.connect();

    //retrieve  data
    const coll = client.db('StarWarsDb').collection('planets')

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
      error: "DELETE FILM error",
      value: error
    })
  }
})



app.listen(port, () => {
  console.log(`REST API is running at http://localhost:${port}`);
}) 