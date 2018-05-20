import React from 'react';
// import { HashLink as Link } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor'
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';

import Login from '../components/Login';

configureAnchors({scrollDuration: 800});

class Landing extends React.Component {
  constructor() {
    super();

    this.state = {
      activeTab: 'features'
    };
  }
  componentDidMount() {
    const navHeader = document.querySelector('div.nav-header.public.landing');
    const navAnchor = document.querySelector('div.landing__section__nav-anchor');
    const navAnchorTopPosition = navAnchor.getBoundingClientRect().top;
    document.addEventListener('scroll', () => {
      if (window.scrollY >= Math.floor(navAnchorTopPosition)) {
        navHeader.classList.add('scrolled');
      } else if (navHeader.classList.contains('scrolled')) {
        navHeader.classList.remove('scrolled');
      }
    })
  }

  render() {
    return (
      <div>
        {this.props.showLogin && <Login />}
        <div className="landing__section">
          <div className="landing__section__flex-wrapper">
            <h1 className="landing__main-heading">Lyme Disease Management,<br/> Made <span>Easy</span>.</h1>
            {/* <div className='row valign-wrapper'> */}
              {/* <div className='col s4 offset-s1'> */}
                {/* <div className='row'>
                  <p className='landing_caption'>LymeLog is your personal tool for simplifying your treatment process while faciliating recovery, all in a convenient and user-friendly interface.</p>
                  <p className='landing__caption'>Organize your treatment process and track your progress with the click of a button!</p>
                </div> */}

              {/* </div> */}
            {/* </div> */}
            {/* <img className='landing__image--computer-screen' src='/images/computer_screen.jpg' /> */}
            <p className='landing__subheading'>Organize your treatment and track your progress with the click of a button!</p>

            <div className='landing__video__wrapper'>
              <video className='landing__video' src='/videos/Kazam_screencast_00000.mp4' poster='/images/LandingPageScreenshot.png' autoPlay loop></video>
            </div>
            <div className='row'>
              <Link className="landing__button" to="/signup">Get Started For Free</Link>
            </div>
            {/* <a href='#2' className="down_icon"><i className="large material-icons">keyboard_arrow_down</i></a> */}
          </div>
          <ScrollableAnchor id={'2'}>
            <div className='landing__section__nav-anchor'></div>
          </ScrollableAnchor>

        </div>
          <div className='landing__tab__container'>
            <div className={`landing__tab ${this.state.activeTab === 'features' && 'active'}`}>
              <a href='#2' onClick={() => this.setState({activeTab: 'features'})}>Features</a>
            </div>
            <div className={`landing__tab ${this.state.activeTab === 'aboutUs' && 'active'}`}>
              <a href='#2' onClick={() => this.setState({activeTab: 'aboutUs'})}>About us</a>
            </div>
            <div className={`landing__tab ${this.state.activeTab === 'faq' && 'active'}`}>
              <a href='#2' onClick={() => this.setState({activeTab: 'faq'})}>FAQ</a>
            </div>
          </div>
          <div className="landing__section2">
            <div className="landing__section__flex-wrapper">
              <h1>[Features]</h1>
            </div>
          </div>

      </div>
    );
  }
};
export default createContainer(() => {
  return {
    showLogin: Session.get('showLogin') || false
  }
}, Landing);
