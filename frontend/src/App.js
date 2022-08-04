import { BrowserRouter, Route, Switch } from "react-router-dom";
import Administrator from "./components/Administrator";
import Checkup from "./components/Checkup";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Pemeriksaan from "./components/Pemeriksaan";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login/>
        </Route>
        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/dashboard">
          <Navbar/>
          <Dashboard/>
        </Route>
        <Route path="/checkup">
          <Navbar/>
          <Checkup/>
        </Route>
        <Route path="/doctor">
          <Navbar/>
          <Pemeriksaan/>
        </Route>
        <Route path="/admin">
          <Navbar/>
          <Administrator/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
