import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <NavLink to="/home" className="navbar-brand" href="#">Money Tracker</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink to="/home" className="nav-link">Home <span className="sr-only">(current)</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/income/salary" className="nav-link">Salary</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/investments/crypto" className="nav-link">Investments</NavLink>
                    </li>
                </ul>
                <span className="navbar-text">Personal Money Tracker App</span>
            </div>
        </nav>
    );
}

export default Navbar;