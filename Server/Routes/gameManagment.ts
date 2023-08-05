import express from 'express';
const router = express.Router();

import chargeDetails from '../Models/chargesDetails'
import activeGame from '../Models/activeGame'



const gameManagmentController = require('../Controllers/gameManagment')


  router.post('/time/finalcharge', gameManagmentController.startGame)
  //router.post('/time/finalduration', gameManagmentController.finalDuration)


// GET LIST OF CHARGES
router.get('/gameCharges/list', gameManagmentController.gameListOfCharges)


//MILDWARE GAME CHARGES
router.get('/gameCharges/:id', gameManagmentController.getGameCharge, (req: any, res: any) => {
    res.json(res.gameCharge)

})






module.exports = router

export default router;