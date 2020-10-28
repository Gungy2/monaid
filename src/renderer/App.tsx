import React from "react";
import Contacts from "./Contacts";
import AddContact from "./AddContact";
import AddTransaction from "./AddTransaction";
import Welcome from "./Welcome";
import Statistics from "./Statistics";
import Transactions from "./Transactions";
import { HashRouter as Router, Link, Switch, Route } from "react-router-dom";
import "./style/App.scss";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/contacts">Contacts</Link>
            </li>
            <li>
              <Link to="/addContact">Add Contact</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
            <li>
              <Link to="/statistics">Statistics</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Switch>
        <Route path="/contacts">
          <Contacts />
        </Route>
        <Route path="/addContact">
          <AddContact />
        </Route>
        <Route path="/transactions">
          <Transactions />
        </Route>
        <Route path="/addTransaction/:contactId">
          <AddTransaction />
        </Route>
        <Route path="/statistics">
          <Statistics />
        </Route>
        <Route path="/">
          <Welcome />
        </Route>
      </Switch>
    </Router>
  );
}
