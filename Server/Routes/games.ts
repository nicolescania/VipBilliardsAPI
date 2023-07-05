
import express from 'express';
const router = express.Router();
import gameTypes from '../Models/gameTypes'



const gameController = require('../Controllers/games')


//GET GAME TYPES LIST

router.get('/gameTypes/list', gameController.list)
router.post('/gameTypes/create', gameController.create)





module.exports = router

export default router;