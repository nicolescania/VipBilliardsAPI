import express from 'express';
const router = express.Router();

import chargeDetails from '../Models/chargesDetails'
import activeGame from '../Models/activeGame'



const gameManagmentController = require('../Controllers/gameManagment')

 // START GAME
  router.post('/api/game/start-game', gameManagmentController.startGame)
  // GET GAME ACTIVE
  router.post('/api/game/game-active', gameManagmentController.getGameActive)

 

// GET LIST OF CHARGES
// router.get('/gameCharges/list', gameManagmentController.gameListOfCharges)


//MILDWARE GAME CHARGES
 router.get('/api/game-charges/:id', gameManagmentController.getGameCharge, (req: any, res: any) => {
    res.json(res.gameCharge)

 })






module.exports = router

export default router;