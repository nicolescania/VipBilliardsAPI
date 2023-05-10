import express from "express";

import mongoose from 'mongoose';

import Users from '../Models/user'

import open from '../Config/app'







 async function list(req : any, res: any)  {

    try {
        const User = await Users.find()
        res.json(User)
    } catch (err) {
        res.status(500).json({ message:err})
    }

}

   
   


 async function verifyEmail(emailAddress){


    const verifyEmail = await Users.findOne({emailAddress: { $eq: emailAddress }})

	return verifyEmail == null ? false : true;
}
 

 async function create(req : any, res: any) {
    
    //res.status(200).json(req.body)

    if ( await verifyEmail(req.body.emailAddress) == true) {

        return res.status(400).json("Email exist")
       } else  { 
            if ( await save(req.body) == true) {
               return res.status(201).json("user created")
            } 
              return res.status(400).json("user no created")   
             

}

}


async function save(userInfo: any) {
            
            try {


                const User = new Users({
 
                    fisrtName: userInfo.fisrtName,
                    lastName: userInfo.lastName,
                    emailAddress: userInfo.emailAddress,
                    password: userInfo.password
                 
                 })
            
            const newUser = await User.save()

            return true

            } catch (err) {
            return false
            }
 
 }







module.exports = {list, create};




