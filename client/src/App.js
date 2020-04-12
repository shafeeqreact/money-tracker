import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './components/home';
import Salary from './components/salary';
import SalaryForm from './components/salaryForm';
import Crypto from './components/crypto';
import CryptoForm from './components/cryptoForm';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Switch>
          <Route path="/home" render={(props) => <Home {...props} />} />
          <Route path="/income/salary/add" render={(props) => <SalaryForm {...props} />} />
          <Route path="/income/salary/:id" render={(props) => <SalaryForm {...props} />} />
          <Route path="/income/salary" render={(props) => <Salary {...props} />} />
          <Route path="/investments/crypto/add" render={(props) => <CryptoForm {...props} />} />
          <Route path="/investments/crypto/:id" render={(props) => <CryptoForm {...props} />} />
          <Route path="/investments/crypto" render={(props) => <Crypto {...props} />} />
          <Redirect to="/home" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
