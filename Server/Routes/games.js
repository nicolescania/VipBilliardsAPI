"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const gameController = require('../Controllers/games');
router.get('/api/game-types/list', gameController.getGameTypeList);
router.get('/api/games/list', gameController.getGameList);
router.get('/api/branches/list', gameController.getBranchesList);
router.post('/api/game-types/create', gameController.createGameType);
router.post('/api/game/create-location', gameController.createLocation);
router.post('/api/game/create', gameController.createGame);
router.get('/api/game-types/:id', gameController.getGameType, (req, res) => {
    res.json(res.gameType);
});
router.get('/api/game/:id', gameController.getGame, (req, res) => {
    res.json(res.game);
});
router.get('/api/game/branch/:id', gameController.getLocation, (req, res) => {
    res.json(res.branch);
});
router.patch('/api/game/branch/update/:id', gameController.getLocation, gameController.updateLocation);
router.patch('/api/game-types/update/:id', gameController.getGameType, gameController.updateGameType);
router.patch('/api/game/update/:id', gameController.getGame, gameController.updateGame);
router.delete('/api/game-types/:id', gameController.getGameType, gameController.deleteGameType);
router.delete('/api/game/delete/:id', gameController.getGame, gameController.deleteGame);
router.get('/administrator', gameController.DisplayGameListPage);
router.get('/add', gameController.DisplayAddPage);
router.get('/edit/:id', gameController.DisplayEditPage);
router.post('/edit/:id', gameController.ProcessEditPage);
router.get('/delete/:id', gameController.ProcessDeletePage);
router.post('/add', gameController.ProcessAddPage);
module.exports = router;
exports.default = router;
//# sourceMappingURL=games.js.map