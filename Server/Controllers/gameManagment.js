"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chargesDetails_1 = __importDefault(require("../Models/chargesDetails"));
const gameController = require('../Controllers/games');
let startTime;
let elapsepTime = 8;
let timerInterval;
const startDate = (req, res) => {
    startTime = Date.now() - elapsepTime;
    timerInterval = setInterval(updateDate, 10);
    return timerInterval;
};
const updateDate = (startTime, elapsedTime) => {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
};
const endDate = (req, res) => {
    res.json({ elapsed: elapsepTime });
};
async function getGamePrice() {
    let game = await gameController.findGame();
}
;
const duration = () => {
    let duration = elapsepTime;
    return duration;
};
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
    return res.json({ gameInfo,
        gameTypesDetails,
        totalAmount
    });
}
function amount(amountPerHour, amountPerMinute, totalDuration) {
    if (totalDuration <= 60) {
        return amountPerHour;
    }
    return totalDuration * amountPerMinute;
}
async function startGame1(req, res) {
    const startgame = new chargesDetails_1.default({
        game: await gameController.findGame(req.body.game),
        startDate: Date.now(),
    });
    try {
        const newstartgame = await startgame.save();
        res.status(201).json(newstartgame);
    }
    catch (err) {
        res.status(400).json({ message: err });
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
module.exports = { startDate, updateDate, endDate, startGame, gameListOfCharges, getGameCharge };
//# sourceMappingURL=gameManagment.js.map