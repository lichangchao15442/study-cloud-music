import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";
const composeEnhancers = window.__REDUX_DEVTOOLS_COMPOSE__ || compose;

// 生成store时，将reducer传入的作用：会通过store.dispatch方法触发reducer的自动执行
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
