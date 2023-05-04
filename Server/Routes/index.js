"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const roles_1 = __importDefault(require("../Models/roles"));
router.get('/', async (req, res) => {
    try {
        const Role = await roles_1.default.find();
        res.json(Role);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
router.get('/:Id', (req, res) => {
    res.send(req.params.Id);
});
router.post('/', async (req, res) => {
    const Role = new roles_1.default({
        name: req.body.name
    });
    try {
        const newRole = await Role.save();
        res.status(201).json(newRole);
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
});
router.patch('/', (req, res) => {
});
router.delete('/', (req, res) => {
});
module.exports = router;
exports.default = router;
//# sourceMappingURL=index.js.map