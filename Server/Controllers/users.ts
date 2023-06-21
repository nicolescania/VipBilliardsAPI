import express from "express";
import Users from '../Models/user'
import Roles from '../Models/roles'
import { error } from "console";



    // GET USER LIST

    async function list(req : any, res: any)  {

        try {
            const User = await Users.find()
            res.json(User)
        } catch (err) {
            res.status(500).json({ message:err})
        }

    }

   
   
    // VERIFY USER EMAIL
    // TRUE == EMAIL ALREADY EXIST
    // FALSE == EMAIL AVAILABLE

    async function verifyEmail(emailAddress: String){


        const verifyEmail = await Users.findOne({emailAddress: { $eq: emailAddress }})

        return verifyEmail == null ? false : true;
    }
    
    // CREATE USER

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

    // SAVE USER INFO

    async function save(userInfo: any) {
   
                try {


                    const User = new Users({
                        fisrtName: userInfo.fisrtName,
                        lastName: userInfo.lastName,
                        emailAddress: userInfo.emailAddress,
                        password: userInfo.password,
                        //role: userInfo.populate('Roles')                                        
                    })
                




                


                const newUser = await User.save()

                return true

                } catch (err) {
                return false
                }
    
    }



  // UPDATE USER



 
   





module.exports = {list, create};



