"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../Models/user"));
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
            password: userInfo.password
        });
        const newUser = await User.save();
        return true;
    }
    catch (err) {
        return false;
    }
}
module.exports = { list, create };
//# sourceMappingURL=users.js.map