const express = require("express");
const Laundry = require("../models/laundryModel");
const Profile = require("../models/profileModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const MessMenu = require('../models/messModel');
const auth = require("../middleware/auth");
const upload = require('../middleware/fileUpload');
const { getGis } = require("../config/db");

const router = express.Router();

router.get("/dashboard", auth, async (req, res) => {
  const userProfile = await Profile.findOne({ user: req.user.id });
  const retrievedPosts = await Post.find();
  const posts = retrievedPosts.filter((retrievedPost) => {
    if (
      retrievedPost.hostel === userProfile.hostel &&
      retrievedPost.tag === userProfile.role
    )
      return true;
    else if (retrievedPost.tag === "Everyone") return true;
    else if (userProfile.role === "Mess commitee") {
      let role = "Student";
      if (
        retrievedPost.hostel === userProfile.hostel &&
        retrievedPost.tag === role
      )
        return true;
    } else return false;
  });
  const noOfUnreadPosts = posts.length - userProfile.seenPosts.length;
  const reciepts = await Laundry.find({
    laundryNumber: userProfile.laundryNumber,
  });
  const noOfPendingReciepts = reciepts.length;
  res.status(200).json({
    status: "success",
    data: {
      noOfPendingReciepts,
      noOfUnreadPosts,
    },
  });
});

router.get("/messinfo", auth, async (req, res) => {
  const userProfile = await Profile.findOne({ user: req.user.id });
  const messCommitee = await Profile.find({
    role: "Mess commitee",
    hostel: userProfile.hostel,
  });
  let messCommiteeInfo = [];
  if (messCommitee.length !== 0) {
    for (let i = 0; i < messCommitee.length; i++) {
      const messCommiteeMember = await User.findById(
        messCommitee[i].user
      ).select("-password");
      messCommiteeInfo.push({
        name: messCommiteeMember.name,
        email: messCommiteeMember.email,
        phone: messCommitee[i].phoneNumber,
      });
    }
  }
  const messMenu = await MessMenu.findOne({hostel:userProfile.hostel});
  res.json({messCommiteeInfo,messMenu});
});

router.post("/messmenu", [auth, upload.single('image')], async(req,res)=>{
  const userProfile = await Profile.findOne({user:req.user.id}).select('-password');
  if(!req.file)
  {
    return res.status(400).json({error: 'You must upload the mess menu picture!' });
  }
  if(userProfile.role !== "Mess commitee")
  {  
    getGis().remove(
      { filename: req.file.filename, root: "images" },
      (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err });
        }
      }
    );
    return res.status(401).json({error:"You are not authorised to upload the mess menu!"});
  }
  let messMenu = {};
  messMenu.hostel = userProfile.hostel;
  messMenu.messMenu = `/api/image/display/${req.file.filename}`;
  messMenu.uploader = req.user.id;
  const oldMessMenu = await MessMenu.findOne({hostel:userProfile.hostel});
  if(oldMessMenu)
  {
    getGis().remove(
      { filename: oldMessMenu.messMenu.split("/")[4], root: "images" },
      (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err });
        }
      });
    await MessMenu.findByIdAndDelete(oldMessMenu.id);  
  }
  try{
    const newMessMenu = await new MessMenu(messMenu).save();
    res.json(newMessMenu);
  }catch(e){
    console.log(e);
    res.status(500).send('server error');
  }
})

router.get("/contacts", auth, async (req,res)=>{
  const userProfile = await Profile.findOne({user:req.user.id});
  const allInSameHostel = await Profile.find({hostel:userProfile.hostel});
  const  importantPeople = allInSameHostel.filter(person=>{
    if(person.role === 'Warden' || person.role === 'Caretaker' || person.role === 'Cleaning service')
      return true
  });
  let contacts = [];
  for(let i =0; i<importantPeople.length; i++)
  {
    const impPerson = await User.findById(importantPeople[i].user).select('-password');
    contacts.push({
      name:impPerson.name,
      email:impPerson.email,
      phoneNumber:importantPeople[i].phoneNumber,
      role:importantPeople[i].role
    })
  }
  res.json(contacts);
})

module.exports = router;
