"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const gameManagmentController = require('../Controllers/gameManagment');
router.post('/time/finalcharge', gameManagmentController.startGame);
router.get('/time/finalduration', gameManagmentController.getDurationTime);
router.post('/time/finalprice', gameManagmentController.getFinalPrice);
router.get('/gameCharges/list', gameManagmentController.gameListOfCharges);
router.get('/gameCharges/:id', gameManagmentController.getGameCharge, (req, res) => {
    res.json(res.gameCharge);
});
router.get('/gameactive/:id', gameManagmentController.getActiveGame, (req, res) => {
    res.json(res.gameactive);
});
module.exports = router;
exports.default = router;
//# sourceMappingURL=gameManagment.js.map