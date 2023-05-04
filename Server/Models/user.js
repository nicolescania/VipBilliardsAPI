"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    id: Number,
    username: { type: String, require: true },
    fisrtName: { type: String, require: true },
    lastName: { type: String, require: true },
    emailAddress: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: Schema.Types.ObjectId, ref: 'Roles' },
    Created: {
        type: Date,
        default: Date.now()
    },
    Updated: {
        type: Date,
        default: Date.now()
    }
});
const Model = mongoose_1.default.model("Users", UserSchema);
exports.default = Model;
//# sourceMappingURL=user.js.map