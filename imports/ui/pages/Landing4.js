import React from 'react';
// import { HashLink as Link } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Slider from 'react-slick'
import ScrollableAnchor, {configureAnchors} from 'react-scrollable-anchor';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import Login from '../components/Login';

configureAnchors({scrollDuration: 800});

class Landing extends React.Component {
  // constructor() {
  //   super();
  //
  //   this.state = {
  //     activeTab: 'features'
  //   };
  // }
  componentDidMount() {
    const navHeader = document.querySelector('div.nav-header.public.landing');
    const navAnchorOne = document.querySelector('.landing__section--feature-item__row');
    const navAnchorTopPosition = navAnchorOne.getBoundingClientRect().top;
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
        <div className="landing__section landing__section--main">
          <div className="landing__section--main__flex-wrapper">
            <h1 className="landing__section--main__heading">Lyme Management, Made <span>Easy</span>.</h1>

            <div className='landing__section--main__row'>
              <div className='landing__section--main__row--left'>
                <p className='landing__section--main__subheading'>Organize your treatment and track your progress with the click of a button!</p>
                <Link className="landing__section--main__button" to="/signup">Get Started For Free</Link>
              </div>
              <div className='landing__section--main__video__wrapper'>
                <video className='landing__section--main__video' src='/videos/Kazam_screencast_00000.mp4' poster='/images/LandingPageScreenshot.png' autoPlay loop></video>
              </div>
            </div>

          </div>
        </div>

        {/* <ScrollableAnchor id={'feature-summary'}> */}
          <div className='landing__section--feature-item__row'>
            <div className="landing__section--feature-item">
              <i className="landing__section--feature-item__icon material-icons">schedule</i>
              <h5 className='landing__section--feature-item__caption'>Select Symptoms and Treatments</h5>
              {/* <p className='landing__section--feature-item__description'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p> */}
              <a href='#landing__section--3' className='landing__section--feature-item__scroll-link'> Learn More <i className="large material-icons">keyboard_arrow_down</i> </a>
            </div>
            <div className="landing__section--feature-item">
              <i className="landing__section--feature-item__icon material-icons">timeline</i>
              <h5 className='landing__section--feature-item__caption'>Check in and Track Your Progress</h5>
              {/* <p className='landing__section--feature-item__description'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p> */}
              <a href='#landing__section--4' className='landing__section--feature-item__scroll-link'> Learn More <i className="large material-icons">keyboard_arrow_down</i> </a>
            </div>
            <div className="landing__section--feature-item">
              <i className="landing__section--feature-item__icon material-icons">person_add</i>
              <h5 className='landing__section--feature-item__caption'>Link Accounts with Your Doctor</h5>
              {/* <p className='landing__section--feature-item__description'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p> */}
              <a href='#landing__section--5' className='landing__section--feature-item__scroll-link'> Learn More <i className="large material-icons">keyboard_arrow_down</i> </a>
            </div>
            <div className="landing__section--feature-item">
              <i className="landing__section--feature-item__icon material-icons">people_outline</i>
              <h5 className='landing__section--feature-item__caption'>Be Part of the Community</h5>
              {/* <p className='landing__section--feature-item__description'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p> */}
              <a href='#landing__section--l-com' className='landing__section--feature-item__scroll-link'> Learn More <i className="large material-icons">keyboard_arrow_down</i> </a>
            </div>
          </div>
          {/* <div className="landing__section landing__section--feature-summary">
            <div className="landing__section--feature-summary__flex-wrapper">
              <div className="landing__section--feature-summary__heading">
                Why LymeLog?
              </div>
              <div className="landing__section--feature-summary__feature-summary__flex-container">
                <div className="landing__section--feature-summary__feature-summary__item">
                  <i className="grey-text medium material-icons">schedule</i>
                  <div>
                    <a href='#'>Daily Check-ins</a>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                  </div>
                </div>
                <div className="landing__section--feature-summary__feature-summary__item">
                  <i className="grey-text medium material-icons">show_chart</i>
                  <div>
                    <a href='#'>Checkin</a>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                  </div>
                </div>
                <div className="landing__section--feature-summary__feature-summary__item">
                  <i className="grey-text medium material-icons">people_outline</i>
                  <div>
                    <a href='#'>Checkin</a>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                  </div>
                </div>
                <div className="landing__section--feature-summary__feature-summary__item">
                  <i className="grey-text medium material-icons">timeline</i>
                  <div>
                    <a href='#'>Checkin</a>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                  </div>
                </div>
                <div className="landing__section--feature-summary__feature-summary__item">
                  <i className="grey-text medium material-icons">schedule</i>
                  <div>
                    <a href='#'>Checkin</a>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                  </div>
                </div>
                <div className="landing__section--feature-summary__feature-summary__item">
                  <i className="grey-text medium material-icons">schedule</i>
                  <div>
                    <a href='#'>Checkin</a>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                  </div>
                </div>
              </div>
            </div> */}
        {/* </ScrollableAnchor> */}
        <ScrollableAnchor id={'landing__section--2'}>
          <div className="landing__section landing__section--2">
            <div className='landing__section__subsection--content'>
              <div className='landing__section__title'>30 second check ins</div>
              <div className='landing__section__description'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
              </div>
            </div>
            <div className='landing__section__subsection--preview'>
              <div className='landing__section__preview-image__wrapper'>
                <Slider dots={true} arrows={false} autoplay={true}>
                  <div><img className='landing__section__preview-image' src='/images/preview/checkin-symptoms.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/checkin-treatments.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/checkin-events.png' /></div>
                  {/* <div><img src='/images/preview/treatment-schedule.png' /></div> */}
                </Slider>
              </div>
              {/* // <img className='landing__section__preview-image' src='/images/preview/treatment-name.png'/> */}
            </div>
            {/* <div className='landing__section__scroll-button__wrapper landing__section__scroll-button__wrapper--2'>
              <a href='#3' className="down_icon landing__section__scroll-button"><i className="large material-icons">keyboard_arrow_down</i></a>
            </div> */}
          </div>
        </ScrollableAnchor>

        <ScrollableAnchor id={'landing__section--3'}>
          <div className="landing__section landing__section--3">
            <div className='landing__section__subsection--preview'>
              <div className='landing__section__preview-image__wrapper'>
                <Slider dots={true} arrows={false} autoplay={true}>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-name.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-schedule.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-dosing.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-instructions.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-info.png' /></div>
                  {/* <div><img src='/images/preview/treatment-schedule.png' /></div> */}
                </Slider>
              </div>
            </div>
            <div className='landing__section__subsection--content'>
              <div className='landing__section__title'>Enter your treatments with ease</div>
              <div className='landing__section__description'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
              </div>
            </div>
          </div>
        </ScrollableAnchor>

        <ScrollableAnchor id={'landing__section--4'}>
          <div className="landing__section landing__section--4">
            <div className='landing__section__subsection--content'>
              <div className='landing__section__title'>Powerful Graphing</div>
              <div className='landing__section__description'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
              </div>
            </div>
            <div className='landing__section__subsection--preview'>
              <div className='landing__section__preview-image__wrapper'>
                <img className='landing__section__preview-image' src='/images/preview/symptom-graph.png' />
              </div>
              {/* // <img className='landing__section__preview-image' src='/images/preview/treatment-name.png'/> */}
            </div>
            {/* <div className='landing__section__scroll-button__wrapper landing__section__scroll-button__wrapper--2'>
              <a href='#3' className="down_icon landing__section__scroll-button"><i className="large material-icons">keyboard_arrow_down</i></a>
            </div> */}
          </div>
        </ScrollableAnchor>

        <ScrollableAnchor id={'landing__section--5'}>
          <div className="landing__section landing__section--5 ">
            <div className='landing__section__subsection--preview'>
              <div className='landing__section__preview-image__wrapper'>
                <Slider dots={true} arrows={false} autoplay={true}>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-name.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-schedule.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-dosing.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-instructions.png' /></div>
                  <div><img className='landing__section__preview-image' src='/images/preview/treatment-info.png' /></div>
                  {/* <div><img src='/images/preview/treatment-schedule.png' /></div> */}
                </Slider>
              </div>
            </div>
            <div className='landing__section__subsection--content'>
              <div className='landing__section__title'>Linking Accounts</div>
              <div className='landing__section__description'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
              </div>
            </div>
          </div>
        </ScrollableAnchor>

        <ScrollableAnchor id={'landing__section--l-com'}>
          <div className="landing__section landing__section--l-com">
            <h4>Share you thoughts or ask questions in the Lyme Comunity</h4>
          </div>
        </ScrollableAnchor>

        <footer className="black lighten-4 page-footer">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">Have a Question?</h5>
                <p className="grey-text text-lighten-4">See our <a href='#'>FAQ Page</a> or call our delightful support staff at (212) 787 8000.</p>
              </div>
              <div className="col l4 offset-l2 s12">
                {/* <h5 className="white-text">Links</h5> */}
                <ul>
                  <li><a className="grey-text text-lighten-3" href="#!">Learn More</a></li>
                  <li><a className="grey-text text-lighten-3" href="#!">L-Com</a></li>
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

      </div>
    );
  }
};
export default createContainer(() => {
  return {
    showLogin: Session.get('showLogin') || false
  }
}, Landing);
