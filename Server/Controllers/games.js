"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameTypes_1 = __importDefault(require("../Models/gameTypes"));
async function list(req, res) {
    try {
        const gameType = await gameTypes_1.default.find();
        res.json(gameType);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function create(req, res) {
    const gameType = new gameTypes_1.default({
        name: req.body.name,
        pricePerHour: req.body.pricePerHour,
        pricePerMinute: req.body.pricePerMinute
    });
    try {
        const newGameType = await gameType.save();
        res.status(201).json(newGameType);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}
module.exports = { list, create };
//# sourceMappingURL=games.js.map