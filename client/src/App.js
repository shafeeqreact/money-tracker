import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';

import Navbar from './components/navbar';
import Home from './components/home';
import Salary from './components/salary';
import SalaryForm from './components/salaryForm';
import Crypto from './components/crypto/crypto';
import CryptoForm from './components/crypto/cryptoForm';

import './App.css';

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
