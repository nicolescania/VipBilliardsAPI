import express from 'express';
const router = express.Router();

import chargeDetails from '../Models/chargesDetails'
import activeGame from '../Models/activeGame'



const gameManagmentController = require('../Controllers/gameManagment')

// START GAME
router.post('/api/game/start-game', gameManagmentController.startGame)

// GET GAME ACTIVE
router.post('/api/game/game-active', gameManagmentController.getGameActive)

// TRANSFER GAME
router.post('/api/game/transfer-game', gameManagmentController.transferGame)

// HOLD GAME
router.post('/api/hold-game', gameManagmentController.holdGame)

// RESUME GAME
router.post('/api/resume-game', gameManagmentController.resumeGame)
// TEST
router.get('/api/test', gameManagmentController.test)


// GET LIST OF CHARGES
router.get('/api/game-charges/list', gameManagmentController.getGameListOfCharges)


//MILDWARE GAME CHARGES
router.get('/api/game-charges/:id', gameManagmentController.getGameCharge, (req: any, res: any) => {
   res.json(res.gameCharge)

})


//MILDWARE ACTIVE GAME
router.get('/api/game-active/', gameManagmentController.getActivegame, (req: any, res: any) => {
   res.json(res.game)

})

//DELETE GAME TYPE
router.delete('/api/game/close-game', gameManagmentController.closeGame)
//DELETE GAME TYPE
router.delete('/api/game/free-game', gameManagmentController.setFreeGame)






module.exports = router

export default router;