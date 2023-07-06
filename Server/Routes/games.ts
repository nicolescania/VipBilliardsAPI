
import express from 'express';
const router = express.Router();
import gameTypes from '../Models/gameTypes'



const gameController = require('../Controllers/games')


//GET GAME TYPES LIST
router.get('/gameTypes/list', gameController.list)

//GET GAMES LIST
router.get('/gameTypes/gamelist', gameController.gameList)

// CREATE GAME TYPES
router.post('/gameTypes/create', gameController.create)

// CREATE GAME
router.post('/game/create', gameController.createGame)







//MILDWARE GAME TYPES
router.get('/gametypes/:id', gameController.getGameType, (req: any, res: any) => {
    res.json(res.gameType)

})


//MILDWARE GAME TYPES
router.get('/game/:id', gameController.getGameType, (req: any, res: any) => {
    res.json(res.gameType)

})


//UPDATE GAME

router.patch('/gametypes/:id', gameController.getGameType, gameController.updateGameType)

//DEETE DELETE

router.delete('/gametypes/:id', gameController.getGameType, gameController.deleteGameType)







module.exports = router

export default router;