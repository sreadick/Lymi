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
  forgotPassword() {
    console.log('saf');
    const options = {
      email: 'bill@gmail.com'
    }
    Accounts.forgotPassword(options);
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
            <div onClick={this.forgotPassword}>Forgot Password</div>
            <Link to="/signup">Need an account?</Link>
          </div>
        </div>

      </div>
    );
  }
};
