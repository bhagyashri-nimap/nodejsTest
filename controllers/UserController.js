const express = require('express');
const passport = require("passport")
require("../config/google")
var {authenticateUser} = require("../config/middleware");
var { shortUrlSchemaData } = require('../mongooseModel/shortUrl');
const app = express();
app.use(express.json());
var UserModel = require('../models/UserModel')
app.use(passport.initialize())
app.use(passport.session())
//All crud
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
// Signup
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
//Login
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
  //create short Urls
  //authenticateUser is the middeleware function
  //used accesstoken after login
  app.post('/shortUrlCreate',authenticateUser, async  (req, res) => {
    let resData =await shortUrlSchemaData.create({ full: req.body.fullUrl })
    res.status(200).json(resData)
  })
  
  app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await shortUrlSchemaData.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.status(404).json("Not Found")
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
  })

module.exports = app;