const mongoose = require('mongoose');


const mongoConnection = (ValueConnection) =>{
    mongoose.connect(ValueConnection);

    const connection = mongoose.connection;

    connection.once('open', () =>{
        console.log("Db Connection Succesfully");
    })

    connection.on('error', (err) =>{
        console.log("Db Connection Failed", err)
    })
}

module.exports = {mongoConnection}