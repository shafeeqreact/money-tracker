import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './components/home';
import Salary from './components/salary';
import AddSalary from './components/addSalary';

import './App.css';

function App(props) {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Switch>
          <Route path="/home"><Home /></Route>
          <Route path="/view-salary"><Salary /></Route>
          <Route path="/add-salary"><AddSalary /></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
