import React from 'react';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

export default class Login extends React.Component {
  constructor(props, state) {
    super(props, state);
    this.state = {
      error: ''
    };
  }
  handleSubmit(e) {
    // e.preventDefault();
    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();
    Meteor.loginWithPassword({email}, password, (err) => {
      if (err) {
        this.setState({error: 'Unable to login. Check email and password.'});
      } else {
        this.setState({error: ''});
        Session.set('showLogin', false)
      }
    });
  }
  sendPasswordReset() {
    const email = this.refs.emailToSendPasswordReset.value;
    Accounts.forgotPassword({email: email}, (err, res) => {
      if (err) {
        if (err.error === 403) {
          alert('User not found. Try again');
        } else {
          console.log(err);
        }
      } else {
        alert(`Password reset information sent to ${email}. Check your email for further instructions`);
      }
    });
  }
  render() {
    return (
      <div className="boxed-view__login-box__overlay">
        <div className="boxed-view__login-box">
          <div>
            <Link className='' to="/signup" onClick={() => Session.set('showLogin', false)}>Need an account?</Link>
            <i className="material-icons right grey-text button--icon" onClick={() => Session.set('showLogin', false)}>close</i>
          </div>
          <h3 className='boxed-view__login-box__logo deep-purple-text text-lighten-2'>LymeLog</h3>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          {/* <form onSubmit={this.onSubmit.bind(this)} noValidate className=""> */}
            {/* <Input type="email" ref="email" name="email" label="Email" /> */}
            <div className="input-field">
              <input type="email" id='email' ref="email" name="email" />
              <label htmlFor='email'>Email</label>
            </div>
            {/* <Input type="password" ref="password" name="password" label="Password"/> */}
            <div className="input-field">
              <input type="password" id='password' ref="password" name="password" />
              <label htmlFor='password'>Password</label>
            </div>
          {/* </form> */}

          {/* <div className='divider'></div>
          <div className='section'></div> */}
          <div><Link to='#' onClick={() => Session.set('showForgotPasswordInput', true)}>Forgot Password</Link></div>
          <button onClick={this.handleSubmit.bind(this)} className="button button--auth login z-depth-2">Login</button>
          {/* <div></div> */}
          {/* <button className="btn white black-text">Login</button> */}


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

    );
  }
};
//   render() {
//     return (
//       <div>
//         <div className="boxed-view login">
//           <div className="boxed-view__box login">
//             <h1>Login</h1>
//             {this.state.error ? <p>{this.state.error}</p> : undefined}
//             <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
//               <input type="email" ref="email" name="email" placeholder="Email"/>
//               <input type="password" ref="password" name="password" placeholder="Password"/>
//               <button className="button button--auth">Login</button>
//             </form>
//             <div><Link to="/signup">Need an account?</Link></div>
//             <div className='divider'></div>
//             <div className='section'></div>
//             <div><Link to='#' onClick={() => Session.set('showForgotPasswordInput', true)}>Forgot Password</Link></div>
//             {Session.get('showForgotPasswordInput') &&
//             <div className='z-depth-2 '>
//               <Link to='#'><i className="material-icons right grey-text" onClick={() => Session.set('showForgotPasswordInput', false)}>close</i></Link>
//               <div className='section'></div>
//               <div className='container input-field'>
//                 <input type="text" id="emailToSendPasswordReset" ref="emailToSendPasswordReset"/>
//                 <label htmlFor='emailToSendPasswordReset'>Send to email address:</label>
//                 <button className='btn' onClick={this.sendPasswordReset.bind(this)}>Send Reset Info</button>
//               </div>
//               <div className='section'></div>
//             </div>
//
//             }
//           </div>
//         </div>
//
//       </div>
//     );
//   }
// };
