import React from 'react';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import Login from '../components/Login';
import Footer from '../components/Footer';
import PublicHeader from '../components/PublicHeader';
import PrivateHeader from '../components/PrivateHeader';
import Collapsible from 'react-collapsible';

import PropTypes from 'prop-types';

const FAQ = (props) => (
  <div>
    {props.userInfo ?
      <PrivateHeader title='LymeLog' accountType={props.userInfo.account.type} isForumPage={false} />
      :
      <PublicHeader currentPath={props.location.pathname} />
    }

    {props.showLogin && <Login />}

    <div className='landing__section--faq--top'>
    </div>
    <div className='landing__section--faq--bottom'>
      <div className='landing__faq z-depth-2'>
        <div className='landing__faq__header'>
          <h3>Frequently Asked Questions</h3>
        </div>
        <div className='landing__faq__content'>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>What is LymeLog</div>
            }>
            <div className='landing__faq__answer'>LymeLog is an app that...</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #2</div>
            }>
            <div className='landing__faq__answer'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #3</div>
            }>
            <div className='landing__faq__answer'>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #4</div>
            }>
            <div className='landing__faq__answer'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #5</div>
            }>
            <div className='landing__faq__answer'>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #6</div>
            }>
            <div className='landing__faq__answer'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #7</div>
            }>
            <div className='landing__faq__answer'>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #8</div>
            }>
            <div className='landing__faq__answer'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #9</div>
            }>
            <div className='landing__faq__answer'>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #10</div>
            }>
            <div className='landing__faq__answer'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #11</div>
            }>
            <div className='landing__faq__answer'>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #12</div>
            }>
            <div className='landing__faq__answer'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #13</div>
            }>
            <div className='landing__faq__answer'>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #14</div>
            }>
            <div className='landing__faq__answer'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
          <Collapsible
            trigger= {
              <div className='landing__faq__question'>Question #15</div>
            }>
            <div className='landing__faq__answer'>Sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          </Collapsible>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
)

export default createContainer((props) => {
  // console.log(props);
  return {
    showLogin: Session.get('showLogin') || false,
    userInfo: Meteor.user()
  }
}, FAQ);
