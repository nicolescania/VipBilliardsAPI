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
    let totalAmount = amount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, 65);
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
function amount(amountPerHour, amountPerMinute, totalDuration) {
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
        return res.status(500).json({ message: err });
    }
    res.gameCharge = gameCharge;
    next();
}
module.exports = { startGame, gameListOfCharges, getGameCharge, };
//# sourceMappingURL=gameManagment.js.map