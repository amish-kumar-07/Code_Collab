"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const endpoint_1 = __importDefault(require("./routes/endpoint"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Parse JSON bodies
app.use('/', endpoint_1.default); // Mount your routes
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
