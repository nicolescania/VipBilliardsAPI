"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const gameManagmentController = require('../Controllers/gameManagment');
router.get('/time/start', gameManagmentController.startDate);
router.get('/time/stop', gameManagmentController.endDate);
router.post('/time/finalcharge', gameManagmentController.startGame);
router.get('/gameCharges/list', gameManagmentController.gameListOfCharges);
router.get('/gameCharges/:id', gameManagmentController.getGameCharge, (req, res) => {
    res.json(res.gameCharge);
});
module.exports = router;
exports.default = router;
//# sourceMappingURL=gameManagment.js.map