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

    if (password.length < 9) {
      return this.setState({error: "Password must be 8 characters or more"});
    }

    Accounts.createUser({email, password}, (err) => {
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
              <input type="email" ref="email" name="email" placeholder="Email"/>
              <input type="password" ref="password" name="password" placeholder="Password"/>
              <button className="button button--auth landing">Create Account</button>
            </form>
            <Link to="/login">Have an account?</Link>
          </div>
        </div>
      </div>
    );
  }
};
