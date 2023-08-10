import { combineReducers } from "redux";
import { ReducerCases } from "./Reducer";

const rootReducer = combineReducers({
  StorageReducer: ReducerCases,
});

export default rootReducer;