const passport = require("passport")
require('dotenv').config();
var { userData } = require('../mongooseModel/User.js');
const GoogleStrategy = require("passport-google-oauth20").Strategy
const jwt = require("jsonwebtoken")
var jwtKey = process.env.JWT_KEY
passport.use(
    new GoogleStrategy({
            callbackURL: process.env.GOOGLE_CALLBACKURL, //same URI as registered in Google console portal
            clientID: process.env.GOOGLE_CLIENT_ID, //replace with copied value from Google console
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user_email = profile.emails && profile.emails[0].value //profile object has the user info
                let userIfAvailable = await userData.findOne({
                    email: user_email
                }, {
                    name: 1,
                    email: 1,
                    password: 1
                })
                console.log("user", userIfAvailable)
                let redirect_url = ""
                if (userIfAvailable) {
                    let objToGenerateAccessToken = {
                        _id: userIfAvailable._id,
                        name: userIfAvailable.name,
                        email: userIfAvailable.email
                    }
                    var token = jwt.sign(objToGenerateAccessToken, jwtKey)
                    objToGenerateAccessToken.accessToken = token
                    delete objToGenerateAccessToken._id

                    //if using accesstoken to redirect the frontend pge but here i used only example redirect_url
                    // redirect_url = `${global.frontend_redirect_url}/${generateAccessToken.accessToken}`
                    redirect_url = `${process.env.frontend_redirect_url}`
                    return done(null, redirect_url)
                    // return done(null, "login done")
                } else if(userIfAvailable == null) {
                    return done  (null, "Failed to login")
                    
                }
            } catch (error) {
                done(error)
            }
        }
    )
)
