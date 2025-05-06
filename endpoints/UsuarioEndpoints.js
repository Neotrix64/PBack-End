const UsuarioSchema = require('../models/Usuario');
const express = require('express');
require('dotenv').config();
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.post('/register', async (req, res, next) => {
    try {
        const { email, userName, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email not provided" })
        }

        const emailExistente = await UsuarioSchema.findOne({ email: email });

        if (emailExistente) {
            return res.status(400).json({ message: "Email already registered, please use another" })
        }

        if (!userName) {
            return res.status(400).json({ message: "Username not provided" })
        }

        if (!password) {
            return res.status(400).json({ message: "Password not provided" })
        }

        const user = new UsuarioSchema({
            userName: userName,
            email: email,
            password: password,
        })

        const newPassword = await user.HashPass(user.password)
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "User created successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err })
    }
})

app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(401).json({ message: "Email not provided" })
        }

        if (!password) {
            return res.status(401).json({ message: "Password not provided" })
        }

        const user = await UsuarioSchema.findOne({ email: { $regex: email, $options: "i" } });

        if (!user) {
            return res.status(404).json({ message: "There's no user with that email" })
        }

        const verification = await bcrypt.compare(password, user.password);

        if (!verification) {
            return res.status(401).json({ message: "Incorrect password" })
        }

        const payload = {
            id: user._id,
            nombre: user.userName,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '5h' });

        res.status(200).json({ message: "Successful login", token: token });

    } catch (err) {
        res.status(500).json({ message: "Server error: " + err })
    }
})

module.exports = app;
