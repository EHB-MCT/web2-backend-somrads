//express
const express = require('express')();
const app = express;
const port = process.env.PORT || 3000;


//middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors);

 //Root route
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/public/info.html');
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`REST API is running at http://localhost:${port}`);
})