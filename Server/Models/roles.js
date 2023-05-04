"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RoleSchema = new Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
        require: true
    }
});
const Model = mongoose_1.default.model("Roles", RoleSchema);
exports.default = Model;
//# sourceMappingURL=roles.js.map