import React from 'react';
// import { Link } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';

export default Landing = (props) => (
  <div>
    <div className="landing__header__wrapper">
      <div className="landing__header">
        <div className="landing__header__content">
          <h2 className="landing__header__title">Lymi</h2>
          <Link className="landing__header__button" to="/login">Login</Link>
        </div>
      </div>
    </div>
    <div className="landing__section">
      <div className="flex-wrapper">
        <h1 className="main_heading">Lyme Disease Management, Made <span>Easy</span>.</h1>
        <p>Lymi is your personal tool for simplifying your treatment process while faciliating recovery, all in a convenient and user-friendly interface.</p>
        <Link className="landing__button" to="/Signup">Sign up now</Link>
        <Link className="down_icon" to="#2"><i className="huge angle double down icon"></i></Link>

      </div>

    </div>

    <div id="2" className="landing__section2">
    </div>

  </div>
);
