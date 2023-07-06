"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const gameController = require('../Controllers/games');
router.get('/gameTypes/list', gameController.gameTypeList);
router.get('/gameTypes/gamelist', gameController.gameList);
router.post('/gameTypes/create', gameController.createGameType);
router.post('/game/create', gameController.createGame);
router.get('/gametypes/:id', gameController.getGameType, (req, res) => {
    res.json(res.gameType);
});
router.get('/game/:id', gameController.getGame, (req, res) => {
    res.json(res.game);
});
router.patch('/gametypes/:id', gameController.getGameType, gameController.updateGameType);
router.patch('/game/:id', gameController.getGame, gameController.updateGame);
router.delete('/gametypes/:id', gameController.getGameType, gameController.deleteGameType);
router.delete('/game/:id', gameController.getGame, gameController.deleteGame);
module.exports = router;
exports.default = router;
//# sourceMappingURL=games.js.map