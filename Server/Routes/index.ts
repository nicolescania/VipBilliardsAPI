

import express from 'express';
const router = express.Router();
import Roles from '../Models/roles'
import Users from '../Models/user'

const userController = require('../Controllers/users')


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



router.get('/users', userController.list)

router.post('/users', userController.create)










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

