"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const index_route_1 = require("./routes/index.route");
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const sg_api_key = process.env.SENDGRID_API_KEY;
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use((0, cors_1.default)({ origin: [process.env.ADMIN_CLIENT_URL], credentials: true }));
        mail_1.default.setApiKey(sg_api_key);
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(index_route_1.IndexRoute);
        try {
            yield database_1.default.authenticate();
            console.log("database is authenticated ...");
            yield database_1.default.sync();
            console.log("database is sync ...");
            app.listen(port, () => {
                console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}
main();
