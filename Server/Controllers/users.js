"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../Models/user"));
const roles_1 = __importDefault(require("../Models/roles"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function list(req, res) {
    try {
        const User = await user_1.default.find();
        res.json(User);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}
async function verifyEmail(emailAddress) {
    const verifyEmail = await user_1.default.findOne({ emailAddress: { $eq: emailAddress } });
    return verifyEmail == null ? false : true;
}
async function create(req, res) {
    if (await verifyEmail(req.body.emailAddress) == true) {
        return res.status(400).json("Email exist");
    }
    else {
        if (await save(req.body) == true) {
            return res.status(201).json("user created");
        }
        return res.status(400).json("user no created");
    }
}
async function save(userInfo) {
    try {
        const User = new user_1.default({
            fisrtName: userInfo.fisrtName,
            lastName: userInfo.lastName,
            emailAddress: userInfo.emailAddress,
            password: userInfo.password,
            role: userInfo.role
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
async function login(req, res) {
    await user_1.default.findOne({ emailAddress: req.body.emailAddress })
        .then(user => {
        if (user) {
            bcrypt_1.default.compare(req.body.password, user.password, async function (err, result) {
                if (err) {
                    return res.json({
                        error: err
                    });
                }
                if (result) {
                    let token = jsonwebtoken_1.default.sign({ name: user.fisrtName, lastName: user.lastName, email: user.emailAddress, }, 'VerySecretValue', { expiresIn: '1h' });
                    return res.json({
                        message: 'Login Successful!',
                        Name: user.fisrtName,
                        lastName: user.lastName,
                        Email: user.emailAddress,
                        role: await findRole(user.role),
                        token
                    });
                }
                else {
                    return res.json({
                        message: 'Password does not matched'
                    });
                }
            });
        }
        else {
            return res.json({
                message: 'No user found!'
            });
        }
    });
}
module.exports = { list, create, login };
//# sourceMappingURL=users.js.map