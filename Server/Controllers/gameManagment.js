"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chargesDetails_1 = __importDefault(require("../Models/chargesDetails"));
const activeGame_1 = __importDefault(require("../Models/activeGame"));
const gameController = require('../Controllers/games');
const getFormattedDate = (date) => {
    date = new Date(date);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return (month + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds);
};
async function startGame(req, res) {
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, 65);
    const startgame = new chargesDetails_1.default({
        game: gameInfo,
        amount: totalAmount,
        startDate: Date.now()
    });
    try {
        const newstartgame = await startgame.save();
        let game_active = await gameActive(newstartgame._id, gameInfo._id);
        return res.json({
            Game: gameInfo.name,
            Game_Type: gameTypesDetails.name,
            Date: newstartgame.startDate,
            total_Amount: totalAmount,
        });
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}
async function getDurationTime(startDate, endDate) {
    const differenceInMilliseconds = endDate - startDate;
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    let totaldurationminutes = differenceInMinutes;
    return (differenceInMinutes);
}
function getAmount(amountPerHour, amountPerMinute, totalDuration) {
    if (totalDuration <= 60) {
        return amountPerHour;
    }
    return totalDuration * amountPerMinute;
}
async function gameActive(chargesDetailsId, gameId) {
    const gameActive = new activeGame_1.default({
        gameChargeDetails: chargesDetailsId,
        game: gameId
    });
    try {
        const newGameActive = await gameActive.save();
        return newGameActive;
    }
    catch (err) {
        return ({ message: err });
    }
}
async function getGameActive(req, res, next) {
    let gameactive;
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    try {
        gameactive = await activeGame_1.default.findOne({ game: gameInfo });
        if (gameactive == null) {
            return res.status(404).json({
                message: 'Can not find game',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    let chargesDetails = await findcharge(gameactive.gameChargeDetails);
    let endDate = Date.now();
    let time = await getDurationTime(chargesDetails?.startDate, endDate);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time);
    return res.json({ game: gameInfo.name,
        type: gameTypesDetails.name,
        gamestarted: chargesDetails?.startDate,
        timeplaying: time,
        charge: totalAmount
    });
}
async function closeGame(req, res, next) {
    let gameInfo = await gameController.findGame(req.body.gameId);
    try {
        res.json({
            message: 'Game closed'
        });
    }
    catch (err) {
        res.status(500).json({ message: 'the rrror is in close game' });
    }
    await res.game.deleteOne(gameInfo);
}
async function gameListOfCharges(req, res) {
    try {
        const finalcharge = await chargesDetails_1.default.find();
        res.json(finalcharge);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function getGameCharge(req, res, next) {
    let gameCharge;
    try {
        gameCharge = await chargesDetails_1.default.findById(req.params.id);
        if (gameCharge == null) {
            return res.status(404).json({ message: 'Can not find game' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'the error is in active game' });
    }
    return res.json(gameCharge);
    next();
}
async function findcharge(id) {
    return await chargesDetails_1.default.findById(id);
}
async function getActivegame(req, res, next) {
    let game;
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    try {
        game = await activeGame_1.default.findOne({ game: gameInfo });
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
module.exports = { startGame, getGameActive, getGameCharge, closeGame, getActivegame };
//# sourceMappingURL=gameManagment.js.map