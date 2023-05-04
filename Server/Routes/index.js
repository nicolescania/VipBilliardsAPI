"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const roles_1 = __importDefault(require("../Models/roles"));
const user_1 = __importDefault(require("../Models/user"));
router.get('/roles', async (req, res) => {
    try {
        const Role = await roles_1.default.find();
        res.json(Role);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
router.post('/roles', async (req, res) => {
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
router.get('/users', async (req, res) => {
    try {
        const User = await user_1.default.find();
        res.json(User);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
router.post('/users', async (req, res) => {
    const User = new user_1.default({
        username: req.body.username,
        fisrtName: req.body.fisrtName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: req.body.password
    });
    try {
        const newUser = await User.save();
        res.status(201).json(newUser);
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