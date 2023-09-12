import express from 'express';
const router = express.Router();

import chargeDetails from '../Models/chargesDetails'
import activeGame from '../Models/activeGame'



const gameManagmentController = require('../Controllers/gameManagment')

// START GAME
router.post('/api/game/start-game', gameManagmentController.startGame)

// START GAME BY THE MINUTE
router.post('/api/game/start-game-by-minute', gameManagmentController.startGameByMinute)

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

//CLOSE GAME
router.delete('/api/game/close-game', gameManagmentController.closeGame)
//CLOSE GAME FOR FREE
router.delete('/api/game/free-game', gameManagmentController.setFreeGame)

//DELETE CHARGE
router.delete('/api/game/delete-charge/:id', gameManagmentController.deleteChargeById)






module.exports = router

export default router;