const express = require('express');
const passport = require("passport")
require("../config/google")
var { userData } = require('../mongooseModel/User.js');
const app = express();
app.use(express.json());
var UserModel = require('../models/UserModel')

//testing api
// app.post('/test11', (req, res) => {
//     // console.log("req",req)
//     res.send({
//         status: 200,
//         message: 'app is working'
//     })
// })
//All crud

app.use(passport.initialize())
app.use(passport.session())
app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
)
app.get(
    "/auth/google/redirect",
    passport.authenticate("google", {
        session: false,
        failureRedirect: process.env.FAILURE_REDIRECT
    }),
    (req, res) => {
        console.log("req.user", req.user)
        res.redirect(req.user) 
    }
)
app.post("/signup", async (req, res) => {
    try {
        var data = await UserModel.signUp(req.body)
        if (data.value) {
            res.status(200).json(data.data)
        } else {
            res.status(500).json(data)
        }
    } catch (error) {
        res.status(500).send(error)
    }
}),
app.post("/login", async (req, res) => {
    try {
        let outputData = await UserModel.login(req.body)
        if (outputData && outputData.value) {
            res.status(200).json(outputData.data)
        } else {
            res.status(500).json(outputData)
        }
    } catch (error) {
        console.log("inside err", error)
        res.status(500).send(error)
    }
})

module.exports = app;