

import express from 'express';
const router = express.Router();
import Roles from '../Models/roles'
import Users from '../Models/user'
import user from '../Models/user';

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




router.get('/:id', getUser, (req: any, res: any) => {
    res.json(res.user)

})

router.delete('/:id', getUser, async (req: any, res: any) => {
    let id = req.params.id;

    try {

         await res.user.deleteOne({id})
         res.json({message: 'deleted user'})
    } catch (err) {

        res.status(500).json({message: err})

    }
})







 async function getUser(req: any, res: any, next: any) {
    let user
    try { 
        user = await Users.findById(req.params.id)

        if (user == null) {
            return res.status(404).json({message: 'Can not find user'}
            )
        }

    } catch (err) {

        return  res.status(500).json({message: err})

    }


    res.user = user;
    next()

}



//import { DisplayHomePage } from '../Controllers/index';

/* Display home page. */
//router.get('/', DisplayHomePage);

/* Display home page. */
//router.get('/home', DisplayHomePage);


module.exports = router

export default router;

