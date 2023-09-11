"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../Models/user"));
const roles_1 = __importDefault(require("../Models/roles"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const gameController = require('../Controllers/games');
async function getUserList(req, res) {
    try {
        const User = await user_1.default.find();
        res.json(User);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function verifyUserEmail(emailAddress) {
    const verifyUserEmail = await user_1.default.findOne({ emailAddress: { $eq: emailAddress } });
    return verifyUserEmail == null ? false : true;
}
async function createUser(req, res) {
    if (await verifyUserEmail(req.body.emailAddress) == true) {
        return res.status(400).json("Email exist");
    }
    else {
        if (await saveUser(req.body) == true) {
            return res.status(201).json("user created");
        }
        return res.status(400).json("user no created");
    }
}
async function saveUser(userInfo) {
    try {
        const User = new user_1.default({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            emailAddress: userInfo.emailAddress,
            password: userInfo.password,
            role: userInfo.role,
            location: userInfo.location
        });
        const newUser = await User.save();
        return true;
    }
    catch (err) {
        return false;
    }
}
async function findRole(id) {
    return await roles_1.default.findById(id);
}
async function userInfo(req, userinfo) {
    let user;
    try {
        return ({
            Name: userinfo.firstName,
            lastName: userinfo.lastName,
            Email: userinfo.emailAddress,
            Role: await findRole(userinfo.role),
            location: await gameController.findLocation(userinfo.location),
        });
    }
    catch (error) {
        return error;
    }
}
async function login(req, res) {
    await user_1.default.findOne({ emailAddress: req.body.emailAddress })
        .populate('role')
        .populate('location')
        .then(user => {
        if (user) {
            bcrypt_1.default.compare(req.body.password, user.password, async function (err, result) {
                if (err) {
                    return res.json({
                        error: err
                    });
                }
                if (result) {
                    let token = jsonwebtoken_1.default.sign({ name: user.firstName, lastName: user.lastName, email: user.emailAddress, }, 'VerySecretValue', { expiresIn: '1h' });
                    return res.json({
                        user,
                        message: 'Login Successful!',
                        token
                    });
                }
                else {
                    return res.status(400).json({
                        message: 'Password does not matched'
                    });
                }
            });
        }
        else {
            return res.status(400).json({
                message: 'No user found!'
            });
        }
    });
}
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
    res.user = await userInfo(req, user);
    next();
}
async function updateUser(req, res) {
    if (req.body.fisrtName != null) {
        res.user.firstName = req.body.firstName;
        try {
            const updateUser = await res.user.save();
            res.json(updateUser);
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}
async function deleteUser(req, res) {
    let id = req.params.id;
    try {
        await res.user.deleteOne({ id });
        res.json({ message: 'deleted user' });
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
module.exports = { getUserList, createUser, login, getUser, updateUser, deleteUser };
//# sourceMappingURL=users.js.map