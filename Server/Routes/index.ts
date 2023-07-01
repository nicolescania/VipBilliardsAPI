

import express from 'express';
const router = express.Router();
import Roles from '../Models/roles'
import Users from '../Models/user'



const userController = require('../Controllers/users')


// Roles router

router.get('/roles', async (req, res,) => {
    try {
        const Role = await Roles.find()
        res.json(Role)
    } catch (err) {
        res.status(500).json({ message: err })
    }

})


router.post('/roles', async (req, res) => {

    const Role = new Roles({
        name: req.body.name
     

    })
    try {
        const newRole = await Role.save()
        res.status(201).json(newRole)
    } catch (err) {
        res.status(400).json({ message: err })
    }


})


// User Router


// GET USER LIST
router.get('/users', userController.list)

//CREATE A NEW USER
router.post('/users', userController.create)

// LOGIN USER
router.post('/login', userController.login)


//MILDWARE

router.get('/:id',userController.getUser, (req: any, res: any) => {
    res.json(res.user)

})

//UPDATE USER

router.patch('/:id', userController.getUser, userController.updateUser )

//DEETE USER

router.delete('/:id', userController.getUser, userController.deleteUser )



function DisplayHomePage(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.render('index', { title: 'Home', page: 'home' });
}



/* GET home page. */
router.get('/', DisplayHomePage);
router.get('/home', DisplayHomePage);
router.get('/index', DisplayHomePage);

module.exports = router

export default router;

