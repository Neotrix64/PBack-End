const express = require('express');
const app = express();
const { mongoConnection } = require('./DB');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT;


mongoConnection(process.env.MONGODB_CONNECTION);

app.use(cors({
    origin: "*",
    credentials: true
}))

app.get('/', (req,res) =>{
    res.send('Hola mundo')
})

app.listen(port, () =>{
    console.log("Escuchando en el puerto", port);
})