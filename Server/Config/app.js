"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("../Routes/index"));
const games_1 = __importDefault(require("../Routes/games"));
const app = (0, express_1.default)();
const rolesrouter = require('../Routes/index');
app.use('/index', rolesrouter);
'LocalHost:5000/';
const usersrouter = require('../Routes/index');
app.use('/index', usersrouter);
const gamesrouter = require('../Routes/games');
app.use('/gametypes', gamesrouter);
const DBConfig = __importStar(require("./db"));
mongoose_1.default.connect(DBConfig.RemoteURI);
const db = mongoose_1.default.connection;
db.on("open", function () {
    console.log(`Connected to MongoDB at: ${DBConfig.HostName}`);
});
db.on("error", function () {
    console.error(`Connection Error`);
});
app.set('views', path_1.default.join(__dirname, '../Views'));
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../../Client')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../../node_modules')));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: DBConfig.Secret,
    saveUninitialized: false,
    resave: false
}));
app.use((0, connect_flash_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', index_1.default);
app.use('/', games_1.default);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
//# sourceMappingURL=app.js.map