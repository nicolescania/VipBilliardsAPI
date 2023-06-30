"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const roles_1 = __importDefault(require("../Models/roles"));
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
router.post('/login', userController.login);
router.get('/:id', userController.getUser, (req, res) => {
    res.json(res.user);
});
router.patch('/:id', userController.getUser, userController.updateUser);
router.delete('/:id', userController.getUser, userController.deleteUser);
function DisplayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: 'home' });
}
router.get('/', DisplayHomePage);
router.get('/home', DisplayHomePage);
router.get('/index', DisplayHomePage);
module.exports = router;
exports.default = router;
//# sourceMappingURL=index.js.map