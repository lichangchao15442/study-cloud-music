import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { GlobalStyle } from "./style";
import { IconStyle } from "./assets/iconfont/iconfont";
import store from "./store/index";
import routes from "./router/index";
import "./fix.css";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {renderRoutes(routes)}
      </HashRouter>
    </Provider>
  );
}

export default App;
