import { combineReducers } from "redux";
import { Authentication } from "./Authentication";

const rootReducer = combineReducers({
  Auth: Authentication,
});

export default rootReducer;