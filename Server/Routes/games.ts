
import express from 'express';
const router = express.Router();
import gameTypes from '../Models/gameTypes'



const gameController = require('../Controllers/games')


//GET GAME TYPES LIST
router.get('/api/game-types/list', gameController.getGameTypeList)

//GET GAMES LIST
router.get('/api/games/list', gameController.getGameList)

//GET GAMES LIST
router.get('/api/branches/list', gameController.getBranchesList)



// CREATE GAME TYPES
router.post('/api/game-types/create', gameController.createGameType)

// CREATE LOCATION
router.post('/api/game/create-location', gameController.createLocation)

// CREATE GAME
router.post('/api/game/create', gameController.createGame)

// TEST
//router.post  ('/game/consulta2', gameController.getGameActive)


//MILDWARE GAME TYPES
router.get('/api/game-types/:id', gameController.getGameType, (req: any, res: any) => {
    res.json(res.gameType)

})

//MILDWARE GAME 
router.get('/api/game/:id', gameController.getGame, (req: any, res: any) => {
    res.json(res.game)

})

//UPDATE GAME TYPE
router.patch('/api/game-types/update/:id', gameController.getGameType, gameController.updateGameType)

//UPDATE GAME 
router.patch('/api/game/update/:id', gameController.getGame, gameController.updateGame)


//DELETE GAME TYPE
router.delete('/api/game-types/:id', gameController.getGameType, gameController.deleteGameType)


//DELETE GAME 
router.delete('/api/game/delete/:id', gameController.getGame, gameController.deleteGame)






/* Display Games List Page */
 router.get('/administrator',  gameController.DisplayGameListPage);
/* Display Add Page */
router.get('/add', gameController.DisplayAddPage);

/* Display Edit Page */
router.get('/edit/:id', gameController.DisplayEditPage);

router.post('/edit/:id', gameController.ProcessEditPage);

router.get('/delete/:id', gameController.ProcessDeletePage);


/* Process Add Page */
router.post('/add', gameController.ProcessAddPage);


module.exports = router

export default router;