import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';

export default Footer = (props) => (
  <footer className="black lighten-4 page-footer">
    <div className="container">
      <div className="row">
        <div className="col l6 s12">
          {/* <h5 className="white-text">©2018 LymeLog</h5> */}
          <h5 className="white-text">Have a Question?</h5>
          {/* <p className="grey-text text-lighten-4">See our <a href='/faq'>FAQ Page</a> or call our support staff at (555)-555-5555.</p> */}
          <p className="grey-text text-lighten-4">See our <Link className='blue-text' to='/faq'>FAQ Page</Link> or call our support staff at (555)-555-5555.</p>
        </div>
        <div className="col l4 offset-l2 s12">
          {/* <h5 className="white-text">Links</h5> */}
          <ul>
            <li><a className="grey-text text-lighten-3" href="#!">Learn More</a></li>
            <li><a className="grey-text text-lighten-3" href="#!">Lyme Share</a></li>
            <li><a className="grey-text text-lighten-3" href="#!">Terms of Service</a></li>
            {/* <li><a className="grey-text text-lighten-3" href="#!">Link 4</a></li> */}
          </ul>
        </div>
      </div>
    </div>
    <div className="black lighten-2 footer-copyright">
      <div className="container center-align">
      ©2018 LymeLog
      {/* <a className="grey-text text-lighten-4 right" href="#!">More Links</a> */}
      </div>
    </div>
  </footer>
);
