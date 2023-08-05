"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const gameController = require('../Controllers/games');
router.get('/api/gametypes/list', gameController.getGameTypeList);
router.get('/api/games/list', gameController.getGameList);
router.post('/api/gametypes/create', gameController.createGameType);
router.post('/api/game/create', gameController.createGame);
router.post('/game/consulta2', gameController.getGameActive);
router.get('/api/gametypes/:id', gameController.getGameType, (req, res) => {
    res.json(res.gameType);
});
router.get('/api/game/:id', gameController.getGame, (req, res) => {
    res.json(res.game);
});
router.patch('/api/gametypes/update/:id', gameController.getGameType, gameController.updateGameType);
router.patch('/api/game/update/:id', gameController.getGame, gameController.updateGame);
router.delete('/api/gametypes/:id', gameController.getGameType, gameController.deleteGameType);
router.delete('/api/game/delte:id', gameController.getGame, gameController.deleteGame);
module.exports = router;
exports.default = router;
//# sourceMappingURL=games.js.map