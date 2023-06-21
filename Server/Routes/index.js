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
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.fisrtName != null) {
        res.user.fisrtName = req.body.fisrtName;
        try {
            const updateUser = await res.user.save();
            res.json(updateUser);
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
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
function DisplayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: 'home' });
}
router.get('/', DisplayHomePage);
router.get('/home', DisplayHomePage);
router.get('/index', DisplayHomePage);
module.exports = router;
exports.default = router;
//# sourceMappingURL=index.js.map