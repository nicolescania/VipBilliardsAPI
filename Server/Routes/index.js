"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const roles_1 = __importDefault(require("../Models/roles"));
const user_1 = __importDefault(require("../Models/user"));
const userController = require('../Controllers/users');
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
router.get('/users', userController.list);
router.post('/users', userController.create);
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});
router.delete('/:id', getUser, async (req, res) => {
    let id = req.params.id;
    try {
        await res.user.deleteOne({ id });
        res.json({ message: 'deleted user' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
async function getUser(req, res, next) {
    let user;
    try {
        user = await user_1.default.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Can not find user' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
    res.user = user;
    next();
}
module.exports = router;
exports.default = router;
//# sourceMappingURL=index.js.map