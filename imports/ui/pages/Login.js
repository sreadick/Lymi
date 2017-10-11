import React from 'react';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

export default class Login extends React.Component {
  constructor(props, state) {
    super(props, state);
    this.state = {
      error: ''
    };
  }
  onSubmit(e) {
    e.preventDefault();
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        this.setState({error: 'Unable to login. Check email and password.'});
      } else {
        this.setState({error: ''});
      }
    });
  }
  sendPasswordReset() {
    Accounts.forgotPassword({email: this.refs.emailToSendPasswordReset.value}, (err, res) => {
      if (err) {
        if (err.error === 403) {
          alert('User not found. Try again');
        } else {
          console.log(err);
        }
      } else {
        console.log('forgotPassword method: success');
      }
    });
  }
  render() {
    return (
      <div>
        <div className="boxed-view login">
          <div className="boxed-view__box login">
            <h1>Login</h1>
            {this.state.error ? <p>{this.state.error}</p> : undefined}
            <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
              <input type="email" ref="email" name="email" placeholder="Email"/>
              <input type="password" ref="password" name="password" placeholder="Password"/>
              <button className="button button--auth">Login</button>
            </form>
            <div><Link to="/signup">Need an account?</Link></div>
            <div className='divider'></div>
            <div className='section'></div>
            <div><Link to='#' onClick={() => Session.set('showForgotPasswordInput', true)}>Forgot Password</Link></div>
            {Session.get('showForgotPasswordInput') &&
            <div className='z-depth-2 '>
              <Link to='#'><i className="material-icons right grey-text" onClick={() => Session.set('showForgotPasswordInput', false)}>close</i></Link>
              <div className='section'></div>
              <div className='container input-field'>
                <input type="text" id="emailToSendPasswordReset" ref="emailToSendPasswordReset"/>
                <label htmlFor='emailToSendPasswordReset'>Send to email address:</label>
                <button className='btn' onClick={this.sendPasswordReset.bind(this)}>Send Reset Info</button>
              </div>
              <div className='section'></div>
            </div>

            }
          </div>
        </div>

      </div>
    );
  }
};
