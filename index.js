const port = 3000 || 3001;
const express = require('express');
const app = express();
const { mongoConnection } = require('./DB');
require('dotenv').config();
const cors = require('cors');


mongoConnection(process.env.MONGODB_CONNECTION);

app.use(cors({
    origin: "*",
    credentials: true
}))

app.listen(port, () =>{
    console.log("Escuchando en el puerto", port);
})