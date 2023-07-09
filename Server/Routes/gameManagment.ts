import express from 'express';
const router = express.Router();

import chargeDetails from '../Models/chargesDetails'
import activeGame from '../Models/activeGame'



const gameManagmentController = require('../Controllers/gameManagment')






  router.get('/time/start', gameManagmentController.startDate)
  router.get('/time/stop', gameManagmentController.endDate)
  router.post('/time/finalcharge', gameManagmentController.startGame)


// GET LIST OF CHARGES
router.get('/gameCharges/list', gameManagmentController.gameListOfCharges)



//MILDWARE GAME CHARGES
router.get('/gameCharges/:id', gameManagmentController.getGameCharge, (req: any, res: any) => {
    res.json(res.gameCharge)

})






module.exports = router

export default router;