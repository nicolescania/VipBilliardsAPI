"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayGameListPage = void 0;
const gameTypes_1 = __importDefault(require("../Models/gameTypes"));
const game_1 = __importDefault(require("../Models/game"));
const branch_1 = __importDefault(require("../Models/branch"));
async function getGameTypeList(req, res) {
    try {
        const gameType = await gameTypes_1.default.find();
        res.json(gameType);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function getGameList(req, res) {
    try {
        const game = await game_1.default.find();
        res.json(game);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function createGameType(req, res) {
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
async function createLocation(req, res) {
    const location = new branch_1.default({
        name: req.body.name,
    });
    try {
        const newLocation = await location.save();
        res.status(201).json(newLocation);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}
async function createGame(req, res) {
    const game = new game_1.default({
        name: req.body.name,
        gameType: await findGameType(req.body.gameType),
        location: await findLocation(req.body.locationId),
    });
    try {
        const newgame = await game.save();
        res.status(201).json(newgame);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}
async function findGameType(id) {
    return await gameTypes_1.default.findById(id);
}
async function findLocation(id) {
    return await branch_1.default.findById(id);
}
async function findGame(id) {
    return await game_1.default.findById(id);
}
async function gameInfo(req, gameinfo) {
    let gameType;
    try {
        return ({
            name: gameinfo.name,
            gameType: await findGameType(gameinfo.gameType),
            location: await findLocation(gameinfo.location),
        });
    }
    catch (error) {
        return error;
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
async function getGame(req, res, next) {
    let game;
    try {
        game = await game_1.default.findById(req.params.id);
        if (game == null) {
            return res.status(404).json({ message: 'Can not find game' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    res.game = game;
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
async function updateGame(req, res) {
    if (req.body.name != null) {
        res.game.name = req.body.name;
        try {
            const updateGame = await res.game.save();
            res.json(updateGame);
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
async function deleteGame(req, res) {
    let id = req.params.id;
    try {
        await res.game.deleteOne({ id });
        res.json({ message: 'game deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function DisplayGameListPage(req, res, next) {
    try {
        const gamesCollection = await game_1.default.find()
            .populate('gameType')
            .populate('location')
            .exec();
        console.log(gamesCollection);
        res.render('index', { title: 'Administrator', page: 'administrator', games: gamesCollection });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
exports.DisplayGameListPage = DisplayGameListPage;
module.exports = { getGameTypeList, createGameType, getGameType, updateGameType, deleteGameType, getGameList, createGame, getGame, updateGame, deleteGame, gameInfo, findGame, findGameType, DisplayGameListPage, createLocation, findLocation, };
//# sourceMappingURL=games.js.map