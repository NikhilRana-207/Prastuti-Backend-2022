const express = require('express');
const res = require('express/lib/response');
const Router = express.Router();

const {getAllUsers, getUser, editUser, eventUser} = require('../controllers/user'); 
const {getEventLeaderboard, getLeaderboard} = require('../controllers/leaderboard');
const {addScore, addTeamScore} = require('../controllers/score');
const {deleteRequest, sendRequest, acceptRequest, getRequest} = require('../controllers/request.js');
const {createTeam, getTeam} = require('../controllers/team');
const { register_solo, register_team } = require('../controllers/register');

Router.route('/login').get();

Router.route('/user/:id').get(getUser).put(editUser);
Router.route('/users').get(getAllUsers);
Router.route('/users/:event').get(eventUser);

Router.route('/team').post(createTeam);
Router.route('/team/:id').get(getTeam);

Router.route('/request').get(acceptRequest).post(sendRequest).delete(deleteRequest);
Router.route('/request/:id').get(getRequest);

Router.route('/register').post(register_solo);
Router.route('/register/team').post(register_team);

Router.route('/leaderboard').get(getLeaderboard);
Router.route('/leaderboard/:event').get(getEventLeaderboard);

Router.route('/score').post(addScore);
Router.route('/score/team').post(addTeamScore);

module.exports = Router;