import React from "react";
import Contacts from "./Contacts";
import AddContact from "./AddContact";
import { HashRouter as Router, Link, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/contacts">Contacts</Link>
            </li>
            <li>
              <Link to="/add">Add Contact</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Switch>
        <Route path="/contacts">
          <Contacts />
        </Route>
        <Route path="/newContact">
          <AddContact />
        </Route>
        <Route path="/transactions">
          <h1>TRANSACTIONS NOT YET IMPLEMENTED</h1>
        </Route>
        <Route path="/">
          <h1>HOME</h1>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
