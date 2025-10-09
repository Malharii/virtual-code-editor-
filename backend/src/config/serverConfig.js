import doenv from "dotenv";

doenv.config();

export const PORT = process.env.PORT || 4000;
export const DB_URL = process.env.DB_URL;
export const REACT_PROJECT_COMMAND = process.env.REACT_PROJECT_COMMAND;
