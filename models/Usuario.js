const { default: mongoose } = require("mongoose");
const {model, Schema} = mongoose;
const bcrypt = require('bcrypt')
const salt = 10;

const UserSchema = new Schema({
    userName: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    secretKeys: {type: String, required: false},    
})

UserSchema.methods.HashPass = async function(password) {
    const salting = await bcrypt.genSalt(salt);
    return await bcrypt.hash(password, salting);
};

UserSchema.methods.VerifyPass = async (password) =>{
    const verificacion = await bcrypt.compare(password, hash);
    if(verificacion){
        return true;
    } else {
        return false;
    }
}

const user = model("User", UserSchema)

module.exports = user;