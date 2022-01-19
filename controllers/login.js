const { response } = require('express');
const res = require('express/lib/response');
const {OAuth2Client} = require('google-auth-library');
const User = require('../models/Users');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Users = require('../models/Users');

const loginUser = async (req, res) =>{
    const tokenId = req.body.tokenId;
    let isNew = false; 
    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload();
        const curUser = await Users.findOne({
            email_id: payload.email
        })

        if(!curUser) {
            isNew = true;
            let newUser = {
                Name: payload.name,
                email_id: payload.email,
                Profile_Photo: payload.picture,
                Teams: [],
                Pending_Requests: [],
                Events_Participated: []
            }
            user = await Users.create(newUser);
        }
        else user = curUser;
    }

    verify().then(() => {
        res.json({
            message: 'Success',
            user,
            isNew
        })
    })
}

module.exports = {loginUser};