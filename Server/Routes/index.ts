

import express from 'express';
const router = express.Router();
import Roles from '../Models/roles'

//const Role = require('../Models/roles')



router.get('/', async (req, res, ) => {
    try {
        const Role = await Roles.find()
        res.json(Role)
    } catch (err) {
        res.status(500).json({ message:err})
    }

})

router.get('/:Id', (req, res) => {
res.send(req.params.Id)
})

router.post('/',async(req, res) => {

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

