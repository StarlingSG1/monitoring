import { Router } from "express";

import auth  from "./auth";
import data from "./data";

const api = Router();

api.use("/auth", auth);
api.use("/data", data);

export default api;
