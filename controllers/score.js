const Users = require('../models/Users');
const Events = require('../models/Events');
const Team = require('../models/Teams');

const score_solo = async (req,res) => {
    const {score} = req.body;
    const event = await Events.findOne({ Name: req.body.event_name });
    const user = await Users.findOne({ email_id: req.body.user_mail });

    if(!event || !user) {
        res.status(404).json({
            status: 'Fail',
            message: 'User or Event not found'
        })
        return;
    }

    if(event.Team_Event) {
        res.json({
            status: 'Fail',
            message: 'This is a team event'
        })
        return;
    }

    const check = event.Participants.find(x => x.participant._id.equals(user._id));
    if(!check) {
        res.json({
            status: 'Fail',
            message: 'User not registered for this event'
        })
        return;
    }

    //Update total score in user
    user.Total_Score += score;
    user.save();

    // //Update score in event's model
    let participant_present = event.Participants.find(x => x.participant._id.equals(user._id))
    participant_present.Score += score;
    event.save();

    res.json({
        message: 'Score updated'
    })
}

const score_team = async (req,res) => {
    const {score} = req.body;
    const event = await Events.findOne({ Name: req.body.event_name });
    const team = await Team.findOne({ slug: req.body.team_slug });

    if(!event || !team) {
        res.status(404).json({
            status: 'Fail',
            message: 'Team or Event not found'
        })
        return;
    }

    if(!event.Team_Event) {
        res.json({
            status: 'Fail',
            message: 'This is an individual event'
        })
        return;
    }

    const check = event.Teams.find(x => x.team._id.equals(team._id));
    if(!check) {
        res.json({
            status: 'Fail',
            message: 'Team not registered for this event'
        })
        return;
    }

    team.Members.forEach(async member => {
        const curUser = await Users.findById(member._id);
        curUser.Total_Score += score;
        curUser.save();
    })

    let team_present = event.Teams.find(x => x.team._id.equals(team._id));
    team_present.Score += score;
    event.save();

    res.json({
        message: 'Score updated for team'
    })
}



module.exports = {
    score_solo,
    score_team
}