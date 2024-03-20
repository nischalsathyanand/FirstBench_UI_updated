import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import SignUp from "./components/SignUp";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from "react";
import { Provider, inject, observer } from "mobx-react";
import buyStore from "./store/BuyStore";
import positionStore from "./store/positionStore";
function App() {
  return (
    <Provider buyStore={buyStore} positionStore={positionStore}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/users/login" />}></Route>
          <Route path="/users/login" Component={LoginForm}></Route>
          <Route path="/home" Component={Home}></Route>
          <Route path="/users/signout" Component={LoginForm} />
          <Route path="/users/signup" Component={SignUp} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
