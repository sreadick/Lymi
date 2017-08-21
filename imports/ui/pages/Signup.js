import React from 'react';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

export default class Signup extends React.Component {
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
    let firstName = this.refs.firstName.value.trim();
    let lastName = this.refs.lastName.value.trim();

    if (password.length < 9) {
      return this.setState({error: "Password must be a minimum of 9 characters"});
    }

    Accounts.createUser({email, firstName, lastName, password}, (err) => {
      if (err) {
        this.setState({error: err.reason});
      } else {
        this.setState({error: ''});
      }
    });
  }
  render() {
    return (
      <div>
        <div className="boxed-view signup">
          <div className="boxed-view__box signup">
            <h1>Join</h1>
            {this.state.error ? <p>{this.state.error}</p> : undefined}
            <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
              <div className='row'>
                <div className="input-field col s6">
                  <input type="text" ref="firstName" id='firstName' name="firstName"/>
                  <label className='active' htmlFor='firstName'>First Name</label>
                </div>
                <div className="input-field col s6">
                  <input type="text" ref="lastName" id='lastName' name="lastName"/>
                  <label className='active' htmlFor='lastName'>Last Name</label>
                </div>
              </div>
              <div className="input-field">
                <input type="email" ref="email" id='email' name="email"/>
                <label className='active' htmlFor='email'>Email</label>
              </div>
              <div className="input-field">
                <input type="password" ref="password" id='password' name="password"/>
                <label className='active' htmlFor='password'>Password</label>
              </div>
              <button className="button button--auth landing">Create Account</button>
            </form>
            <Link to="/login">Have an account?</Link>
          </div>
        </div>
      </div>
    );
  }
};
