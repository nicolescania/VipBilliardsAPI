"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const gameManagmentController = require('../Controllers/gameManagment');
router.post('/api/game/start-game', gameManagmentController.startGame);
router.post('/api/game/start-game-by-minute', gameManagmentController.startGameByMinute);
router.post('/api/game/game-active', gameManagmentController.getGameActive);
router.post('/api/game/transfer-game', gameManagmentController.transferGame);
router.post('/api/hold-game', gameManagmentController.holdGame);
router.post('/api/resume-game', gameManagmentController.resumeGame);
router.get('/api/test', gameManagmentController.test);
router.get('/api/game-charges/list', gameManagmentController.getGameListOfCharges);
router.get('/api/game-charges/:id', gameManagmentController.getGameCharge, (req, res) => {
    res.json(res.gameCharge);
});
router.get('/api/game-active/', gameManagmentController.getActivegame, (req, res) => {
    res.json(res.game);
});
router.delete('/api/game/close-game', gameManagmentController.closeGame);
router.delete('/api/game/free-game', gameManagmentController.setFreeGame);
router.delete('/api/game/delete-charge/:id', gameManagmentController.deleteChargeById);
module.exports = router;
exports.default = router;
//# sourceMappingURL=gameManagment.js.map