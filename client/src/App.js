import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './components/home';
import Salary from './components/salary';
import SalaryForm from './components/salaryForm';

import './App.css';

function App(props) {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Switch>
          <Route path="/home" render={(props) => <Home {...props} />} />
          <Route path="/view-salary" render={(props) => <Salary {...props} />} />
          <Route path="/add-salary"render={(props) => <SalaryForm {...props} />} />
          <Route path="/edit-salary/:id" render={(props) => <SalaryForm {...props} />} />
          <Redirect to="/home" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
