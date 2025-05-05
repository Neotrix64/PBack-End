const UsuarioSchema = require('../models/Usuario');
const express = require('express');
const app = express();

app.post('/register', async (req,res,next) =>{
    try{
        const {email, userName, password} = req.body;
        if(!email){
            return res.status(400).json({message: "No proporcionaste un email"})
        }

        const emailExistente = await UsuarioSchema.findOne({email: email});

        if(emailExistente){
            return res.status(400).json({message: "El email ya esta registrado, ingresa otro"})
        }

        if(!userName){
            return res.status(400).json({message: "No proporcionaste un userName"})
        }

        if(!password){
            return res.status(400).json({message: "No proporcionaste un password"})
        }

        const user = new UsuarioSchema({
            userName: userName,
            email: email,
            password: password,
        })

        // metodo hash pass
        const newPassword = await user.HashPass(user.password)
        user.password = newPassword;
        await user.save();
        res.status(200).json({message: "se creo el usuario con exito", user});
    } catch (err) {
        res.status(400).json({message: "Error en el servidor" + err})
    }
})

module.exports = app;