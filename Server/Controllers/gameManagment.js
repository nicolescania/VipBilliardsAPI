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
        startDate: Date.now(),
    });
    try {
        const newstartgame = await startgame.save();
        const STATUS = true;
        let game_active = await gameActive(newstartgame._id, gameInfo._id, STATUS);
        let formattedDate = getFormattedDate(newstartgame.startDate);
        return res.json({
            Game: gameInfo.name,
            Game_Type: gameTypesDetails.name,
            Date: formattedDate,
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
    const durationTime = {
        hours: differenceInHours,
        minutes: differenceInMinutes
    };
    return durationTime;
}
function getAmount(amountPerHour, amountPerMinute, totalDuration) {
    if (totalDuration <= 60) {
        return amountPerHour;
    }
    return totalDuration * amountPerMinute;
}
async function gameActive(chargesDetailsId, gameId, status) {
    const gameActive = new activeGame_1.default({
        gameChargeDetails: chargesDetailsId,
        game: gameId,
        isActive: status
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
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes);
    let formattedDate = getFormattedDate(chargesDetails?.startDate);
    return res.json({
        game: gameInfo.name,
        type: gameTypesDetails.name,
        game_started: formattedDate,
        time_playing: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,
        charge: totalAmount
    });
}
async function holdGame(req, res, next) {
    let holdGame;
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    try {
        holdGame = await activeGame_1.default.findOneAndUpdate({ game: gameInfo }, { $set: { isActive: false }, });
        if (holdGame == null) {
            return res.status(404).json({
                message: 'Can not find game',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    let chargesDetails = await findcharge(holdGame.gameChargeDetails);
    let endDate = Date.now();
    let holdTimeUpdated = await chargesDetails_1.default.updateOne({ _id: holdGame.gameChargeDetails }, { $set: { holdTimeStarted: endDate }, });
    let time = await getDurationTime(chargesDetails?.startDate, endDate);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes);
    let formattedDatestarted = getFormattedDate(chargesDetails?.startDate);
    let formattedDateHold = getFormattedDate(chargesDetails?.holdTimeStarted);
    return res.json({
        game: gameInfo.name,
        type: gameTypesDetails.name,
        game_started: formattedDatestarted,
        time_playing: `You played for ${time.minutes} minutes and ${time.hours} hours`,
        charge: totalAmount,
        game_hold: formattedDateHold,
    });
}
async function closeGame(req, res, next, gameInfo) {
    gameInfo = await gameController.findGame(req.body.gameId);
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
async function getGameListOfCharges(req, res) {
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
    try {
        let game = await activeGame_1.default.findOne({ game: gameInfo });
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
async function transferGame(req, res, next) {
    let gameInfo01 = await gameController.findGame(req.body.gameId01);
    let gameInfo02 = await gameController.findGame(req.body.gameId02);
    try {
        let gameupdated = await activeGame_1.default.updateOne({ game: gameInfo01 }, { $set: { game: gameInfo02 } });
        if (gameupdated == null) {
            return res.status(404).json({
                message: 'Can not find game',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    return res.json({ message: 'Game transfered successfully' });
}
module.exports = { startGame, getGameActive, getGameCharge, closeGame, getActivegame, transferGame, getGameListOfCharges, holdGame };
//# sourceMappingURL=gameManagment.js.map