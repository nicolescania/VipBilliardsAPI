import express from "express";

import mongoose from 'mongoose';

import { CallbackError } from "mongoose";

import Users from '../Models/user'

import open from '../Config/app'







 async function list(req, res)  {

    try {
        const User = await Users.find()
        res.json(User)
    } catch (err) {
        res.status(500).json({ message:err})
    }

}

   
    /*


 async function verify(emailAddress){


    const verifyEmail = await Users.findOne({emailAddress: { $eq: emailAddress }})

	return verifyEmail == null ? false : true;
}




 async function create() {
    

    if (verify() == true) {

    return "El email ya existe";
       }else{
    save();
}

}




async function save(req, res) {
            
      
const User = new Users({
 
    fisrtName: req.body.fisrtName,
    lastName: req.body.lastName,
    emailAddress: req.body.emailAddress,
    password: req.body.password
 
 })
 try {
      
     const newUser = await User.save()
     res.status(201).json(newUser)
 } catch (err) {
  res.status(400).json({message:err})
 }
 
 
 }






*/

module.exports = {list, save};