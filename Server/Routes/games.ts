
import express from 'express';
const router = express.Router();
import gameTypes from '../Models/gameTypes'



const gameController = require('../Controllers/games')


//GET GAME TYPES LIST
router.get('/gameTypes/list', gameController.gameTypeList)

//GET GAMES LIST
router.get('/gameTypes/gamelist', gameController.gameList)


// CREATE GAME TYPES
router.post('/gameTypes/create', gameController.createGameType)

// CREATE GAME
router.post('/game/create', gameController.createGame)



//MILDWARE GAME TYPES
router.get('/gametypes/:id', gameController.getGameType, (req: any, res: any) => {
    res.json(res.gameType)

})


//MILDWARE GAME 
router.get('/game/:id', gameController.getGame, (req: any, res: any) => {
    res.json(res.game)

})


//UPDATE GAME TYPE
router.patch('/gametypes/:id', gameController.getGameType, gameController.updateGameType)

//UPDATE GAME 
router.patch('/game/:id', gameController.getGame, gameController.updateGame)


//DELETE GAME TYPE
router.delete('/gametypes/:id', gameController.getGameType, gameController.deleteGameType)


//DELETE GAME 
router.delete('/game/:id', gameController.getGame, gameController.deleteGame)








module.exports = router

export default router;