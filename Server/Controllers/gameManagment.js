"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chargesDetails_1 = __importDefault(require("../Models/chargesDetails"));
const activeGame_1 = __importDefault(require("../Models/activeGame"));
const gameController = require('../Controllers/games');
function formatMoney(amount, currencySymbol = "$") {
    const options = {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2,
    };
    const formatter = new Intl.NumberFormat("en-CA", options);
    return formatter.format(amount);
}
const getFormattedDate1 = (date) => {
    date = new Date(date);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return (month + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds);
};
const getFormattedDate = (date) => {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    date = new Date(date);
    let day = ("0" + date.getDate()).slice(-2);
    let monthName = monthNames[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12 || 12).toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    const formattedDate = {
        month: monthName,
        day: day,
        year: year,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        ampm: ampm
    };
    return formattedDate;
};
async function startGame(req, res) {
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, 60, true);
    const startgame = new chargesDetails_1.default({
        game: gameInfo,
        amount: totalAmount,
        startDate: Date.now(),
        holdTime: 0,
        minimunChargeCondition: true,
        location: gameInfo.location
    });
    try {
        const newstartgame = await startgame.save();
        const STATUS = true;
        let game_active = await gameActive(newstartgame._id, gameInfo._id, STATUS);
        let formattedDate = getFormattedDate(newstartgame.startDate);
        return res.json({
            Game: gameInfo.name,
            GameType: gameTypesDetails.name,
            Date: formattedDate,
            totalAmount: totalAmount,
        });
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}
async function startGameByMinute(req, res) {
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    let totalAmount = getAmount(gameTypesDetails.pricePerMinute, gameTypesDetails.pricePerMinute, 0, false);
    const startgame = new chargesDetails_1.default({
        game: gameInfo,
        amount: totalAmount,
        startDate: Date.now(),
        holdTime: 0,
        minimunChargeCondition: false,
        location: gameInfo.location
    });
    try {
        const newstartgame = await startgame.save();
        const STATUS = true;
        let game_active = await gameActive(newstartgame._id, gameInfo._id, STATUS);
        let formattedDate = getFormattedDate(newstartgame.startDate);
        return res.json({
            Game: gameInfo.name,
            GameType: gameTypesDetails.name,
            Date: formattedDate,
            totalAmount: totalAmount,
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
        minutes: differenceInMinutes,
        differenceInMilliseconds
    };
    return durationTime;
}
function getAmount(amountPerHour, amountPerMinute, totalDuration, perhour) {
    if (perhour == true && totalDuration <= 60) {
        return amountPerHour;
    }
    if (perhour == true && totalDuration >= 60) {
        return totalDuration * amountPerMinute;
    }
    if (perhour == false) {
        return totalDuration * amountPerMinute;
    }
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
            return res.status(200).json({
                gameActiveExist: false,
                message: 'Can not find game',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    let chargesDetails = await findcharge(gameactive.gameChargeDetails);
    let endDate = Date.now();
    let time = await getValidationTime(chargesDetails?.holdTime, chargesDetails?.startDate, endDate, chargesDetails?.holdTimeStarted);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes, chargesDetails?.minimunChargeCondition);
    let formattedDate = getFormattedDate(chargesDetails?.startDate);
    let totalAmountFormatted = formatMoney(totalAmount);
    let holdTimeStarted = getFormattedDate(chargesDetails?.holdTimeStarted);
    let holdTime = await getDurationTime(chargesDetails?.holdTimeStarted, endDate);
    return res.json({
        gameActiveExist: true,
        game: gameInfo.name,
        type: gameTypesDetails.name,
        gameStarted: ` ${formattedDate.month} ${formattedDate.day} - ${formattedDate.hours}:${formattedDate.minutes}${formattedDate.ampm}`,
        timePlaying: `${time.hours} hours, ${time.minutes} minutes`,
        charge: totalAmountFormatted,
        gameStatus: gameactive?.isActive,
        holdTimeStarted,
        holdTime: `${holdTime.hours} hours, ${holdTime.minutes} minutes`,
    });
}
async function verifyMinimumChargeRequired(minimum) {
    if (minimum == true) {
        return true;
    }
    else
        return false;
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
    let dateNow = Date.now();
    let holdTimeUpdated = await chargesDetails_1.default.updateOne({ _id: holdGame.gameChargeDetails }, { $set: { holdTimeStarted: dateNow }, });
    let formattedDateHold = getFormattedDate(dateNow);
    let chargesDetails = await findcharge(holdGame.gameChargeDetails);
    let time = await getDurationTime(chargesDetails?.startDate, chargesDetails?.holdTimeStarted);
    let Holdtime = await getDurationTime(chargesDetails?.holdTimeStarted, dateNow);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes, chargesDetails?.minimunChargeCondition);
    let timeStarted = getFormattedDate(chargesDetails?.startDate);
    return res.json({
        timeStarted: timeStarted,
        time: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,
        Holdtime: `You have been playing for ${Holdtime.minutes} minutes and ${Holdtime.hours} hours`,
        totalAmount
    });
}
async function test(req, res) {
    var aMinuteAgo = new Date(Date.now() - 5);
    return res.json(getFormattedDate(aMinuteAgo));
}
async function getValidationTime(chargesDetailsHoldTime, chargesDetailStartDated, endDate, chargesDetailsHoldTimeStarted) {
    if (chargesDetailsHoldTime == 0) {
        let time = await getDurationTime(chargesDetailStartDated, endDate);
        return time;
    }
    else {
        let time = await getDurationTime(chargesDetailStartDated, chargesDetailsHoldTimeStarted);
        return time;
    }
}
async function resumeGame(req, res, next) {
    let resumeGame;
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    try {
        resumeGame = await activeGame_1.default.findOneAndUpdate({ game: gameInfo, isActive: false }, { $set: { isActive: true }, });
        if (resumeGame == null) {
            return res.status(404).json({
                message: 'Can not find game',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    let chargesDetails = await findcharge(resumeGame.gameChargeDetails);
    let dateNow = Date.now();
    let holdGameTime = await getDurationTime(chargesDetails?.holdTimeStarted, dateNow);
    let holdTimeUpdated = await chargesDetails_1.default.updateOne({ _id: resumeGame.gameChargeDetails }, { $set: { holdTime: holdGameTime.minutes, holdTimeStarted: null }, });
    return res.json({
        timeInhold: holdGameTime.minutes,
    });
}
async function closeGame(req, res, next) {
    let deleteGame;
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    try {
        deleteGame = await activeGame_1.default.findOne({ game: gameInfo });
        if (deleteGame == null) {
            return res.status(404).json({
                message: 'Can not find game',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    let chargesDetails = await findcharge(deleteGame.gameChargeDetails);
    let dateNow = Date.now();
    let finalDate = new Date(dateNow - chargesDetails?.holdTime * 60000);
    let time = await getDurationTime(chargesDetails?.startDate, finalDate);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes, chargesDetails?.minimunChargeCondition);
    let amountUpdated = await chargesDetails_1.default.updateOne({ _id: deleteGame.gameChargeDetails }, { $set: { amount: totalAmount, endDate: dateNow, duration: time.minutes }, });
    let formattedDate = getFormattedDate(chargesDetails?.startDate);
    let totalAmountFormatted = formatMoney(totalAmount);
    let closeGame = await activeGame_1.default.findOneAndDelete({ game: gameInfo });
    return res.json({
        totalTimePlayed: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,
        message: 'game closed',
        totalAmountFormatted,
        finalDate
    });
}
async function setFreeGame(req, res, next) {
    let freeGame;
    let gameInfo = await gameController.findGame(req.body.gameId);
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType);
    try {
        freeGame = await activeGame_1.default.findOne({ game: gameInfo });
        if (freeGame == null) {
            return res.status(404).json({
                message: 'Can not find game',
            });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    let chargesDetails = await findcharge(freeGame.gameChargeDetails);
    let dateNow = Date.now();
    let finalDate = new Date(dateNow - chargesDetails?.holdTime * 60000);
    let time = await getDurationTime(chargesDetails?.startDate, finalDate);
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes, chargesDetails?.minimunChargeCondition);
    let amountUpdated = await chargesDetails_1.default.updateOne({ _id: freeGame.gameChargeDetails }, { $set: { amount: 0, endDate: dateNow }, });
    let freeamount = await findcharge(freeGame.gameChargeDetails);
    let formattedDate = getFormattedDate(chargesDetails?.startDate);
    let closeGame = await activeGame_1.default.findOneAndDelete({ game: gameInfo });
    return res.json({
        totalTimePlayed: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,
        message: 'game closed',
        finalDate,
        amount: freeamount?.amount
    });
}
async function getGameListOfCharges1(req, res) {
    try {
        const finalcharge = await chargesDetails_1.default.find();
        res.json(finalcharge);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
const getFormattedDateNow = (date) => {
    date = new Date(date);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return (month + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds);
};
async function getGameListOfCharges(req, res) {
    try {
        const charges = await chargesDetails_1.default.find({ location: req.query.locationId, startDate: { $gte: req.query.startDate },
            endDate: { $lte: req.query.endDate } }).sort({ endDate: -1 })
            .populate('location')
            .populate('game')
            .exec();
        const formattedCharges = charges.map((charge) => ({
            ...charge.toObject(),
            startDate: getFormattedDateNow(charge.startDate),
            endDate: getFormattedDateNow(charge.endDate),
        }));
        return res.json(formattedCharges);
    }
    catch (error) {
        console.error('Error al buscar cargos:', error);
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
        let gameupdated = await activeGame_1.default.updateOne({ game: gameInfo01 }, { $set: { game: gameInfo02, isActive: true } });
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
module.exports = { startGame, getGameActive, getGameCharge, closeGame, getActivegame, transferGame, getGameListOfCharges, holdGame, resumeGame, test, setFreeGame, startGameByMinute };
//# sourceMappingURL=gameManagment.js.map