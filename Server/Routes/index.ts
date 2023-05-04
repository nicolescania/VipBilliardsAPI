

import express from 'express';
const router = express.Router();
import Roles from '../Models/roles'
import Users from '../Models/user'


// Roles router

router.get('/roles', async (req, res, ) => {
    try {
        const Role = await Roles.find()
        res.json(Role)
    } catch (err) {
        res.status(500).json({ message:err})
    }

})


router.post('/roles',async(req, res) => {

const Role = new Roles ({
    name: req.body.name

})
try {
    const newRole = await Role.save()
    res.status(201).json(newRole)
} catch (err) {
 res.status(400).json({message:err})
}


})


// User Router





router.get('/users', async (req, res, ) => {
    try {
        const User = await Users.find()
        res.json(User)
    } catch (err) {
        res.status(500).json({ message:err})
    }

})



router.post('/users',async(req, res) => {

const User = new Users({
   username: req.body.username,
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


})









router.patch('/', (req, res) => {

})

router.delete('/', (req, res) => {

})







//import { DisplayHomePage } from '../Controllers/index';

/* Display home page. */
//router.get('/', DisplayHomePage);

/* Display home page. */
//router.get('/home', DisplayHomePage);


module.exports = router

export default router;

