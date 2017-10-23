import React from 'react';
// import { HashLink as Link } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor'
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';

configureAnchors({scrollDuration: 800});
export default Landing = (props) => (
  <div>
    <div className="landing__section">
      <div className="landing__section__flex-wrapper">
        <h1 className="landing__main-heading">Lyme Disease Management,<br/>Made <span>Easy</span>.</h1>
        <div className='row valign-wrapper'>
          <div className='col s4 offset-s1 center-align'>
            <div className='row'>
              {/* <p className='landing_caption'>LymeLog is your personal tool for simplifying your treatment process while faciliating recovery, all in a convenient and user-friendly interface.</p> */}
              <p className='landing__caption'>Organize your treatment process and track your progress with the click of a button!</p>
            </div>
            <div className='row'>
              <Link className="landing__button left" to="/Signup">Get Started</Link>
              <span>Or</span>
              <Link className="landing__button right" to="/Login">Login</Link>
            </div>
          </div>
          <div className='col s6'>
            <video className='graph-screen-shot' src='/videos/Kazam_screencast_00000.mp4' poster='/images/LandingPageScreenshot.png' autoPlay loop></video>
          </div>
        </div>

        {/* <Link className="down_icon" to="#2"><i className="large material-icons">keyboard_arrow_down</i></Link> */}
        <a href='#2' className="down_icon"><i className="large material-icons">keyboard_arrow_down</i></a>
      </div>
    </div>
    <ScrollableAnchor id={'2'}>
      <div className="landing__section2">
        <div className="landing__section__flex-wrapper">
          <h1>[Features]</h1>
        </div>
      </div>
    </ScrollableAnchor>


  </div>
);
