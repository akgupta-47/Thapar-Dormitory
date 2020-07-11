const express = require('express');
const { check, validationResult } = require('express-validator');
const Profile = require('../models/profileModel');
const auth = require('../middleware/auth');
const User = require('../models/userModel');

const router = express.Router();

router.post('/', [
    auth, 
    check('role', 'You must provide your role (i.e. Student/Warden/Caretaker etc.)!').not().isEmpty().trim(),
    check('hostel', 'You must provide the information about (name of) your hostel!').not().isEmpty().trim()
], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    const { role, hostel, roomInfo, laundryNumber, rollNumber } = req.body;
    let profile = {};
    if(laundryNumber)
    {
        console.log(await Profile.findOne({laundryNumber: laundryNumber}));
        if(await Profile.findOne({laundryNumber: laundryNumber}))
        {
            return res.status(409).json({errors: 'This Laundry Number is already in use!'});
        }
        profile.laundryNumber = laundryNumber.trim();
    }
    if(rollNumber)
    {
        if(await Profile.findOne({rollNumber: rollNumber}))
        {
            return res.status(409).json({errors: 'This Roll Number is already in use!'});
        }
        profile.rollNumber = rollNumber;
    }
    if(roomInfo) profile.roomInfo = roomInfo.trim();
    profile.hostel = hostel.trim();
    profile.role = role.trim();
    profile.user = req.user.id;
    try{
        const userProfile = await new Profile(profile).save();
        res.json(userProfile);
    }catch(e){
        console.log(e);
        return res.status(500).send('server error');
    }   
});

module.exports = router;
