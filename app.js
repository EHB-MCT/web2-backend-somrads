//express
const express = require('express')();
const app = express;
const port = 3000;

//mongo config


// //middleware
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// const cors = require('cors');
// app.use(cors);

 //Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})


app.get("/people", async (req, res) => {

  try {
    //Read file



    //Send file
    
  } catch (error) {
    
  }

})

app.listen(port, () => {
  console.log(`REST API is running at http://localhost:${port}`);
}) 