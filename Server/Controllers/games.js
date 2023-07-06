"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameTypes_1 = __importDefault(require("../Models/gameTypes"));
const game_1 = __importDefault(require("../Models/game"));
async function list(req, res) {
    try {
        const gameType = await gameTypes_1.default.find();
        res.json(gameType);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function gameList(req, res) {
    try {
        const game = await game_1.default.find();
        res.json(game);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function create(req, res) {
    const gameType = new gameTypes_1.default({
        name: req.body.name,
        pricePerHour: req.body.pricePerHour,
        pricePerMinute: req.body.pricePerMinute,
    });
    try {
        const newGameType = await gameType.save();
        res.status(201).json(newGameType);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}
async function createGame(req, res) {
    const game = new game_1.default({
        name: req.body.name,
        gameType: req.body.gameType
    });
    try {
        const newgame = await game.save();
        res.status(201).json(newgame);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}
async function getGameType(req, res, next) {
    let gameType;
    try {
        gameType = await gameTypes_1.default.findById(req.params.id);
        if (gameType == null) {
            return res.status(404).json({ message: 'Can not find game' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    res.gameType = gameType;
    next();
}
async function updateGameType(req, res) {
    if (req.body.name != null) {
        res.gameType.name = req.body.name;
        try {
            const updateGameType = await res.gameType.save();
            res.json(updateGameType);
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}
async function deleteGameType(req, res) {
    let id = req.params.id;
    try {
        await res.gameType.deleteOne({ id });
        res.json({ message: 'game deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
module.exports = { list, create, getGameType, updateGameType, deleteGameType, gameList, createGame };
//# sourceMappingURL=games.js.map