import React from 'react';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { capitalize } from '../../utils/utils';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Input, Button } from 'react-materialize';

import Login from '../components/Login';

class Signup extends React.Component {
  constructor(props, state) {
    super(props, state);
    this.state = {
      error: '',
      accountType: 'patient',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',

      // Doc Specific
      officeAddress: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      npi: '',

    };
  }
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }
  handleSubmit() {
    // e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const passwordConfirm = this.state.passwordConfirm.trim();
    const firstName = capitalize(this.state.firstName.trim());
    const lastName = capitalize(this.state.lastName.trim());
    const accountType = this.state.accountType;
    const doctorInfo = accountType === 'doctor' ? {
      officeAddress: this.state.officeAddress.trim(),
      city: this.state.city.trim(),
      state: this.state.state.trim(),
      zip: this.state.zip.trim(),
      phone: this.state.phone.trim(),
      npi: this.state.npi.trim()
    } : undefined;

    if (!firstName) {
      return this.setState({error: "Enter your first name"});
    } else if (!lastName) {
      return this.setState({error: "Enter your last name"});
    } else if (password.length < 9) {
      return this.setState({error: "Password must be a minimum of 9 characters"});
    } else if (!passwordConfirm) {
      return this.setState({error: "Confirm your password"});
    } else if (password !== passwordConfirm) {
      return this.setState({error: "Passwords do not match"});
    } else if (this.state.accountType === 'doctor') {
      if (!doctorInfo.officeAddress) {
        return this.setState({error: 'Please provide your office Address'})
      } else if (!doctorInfo.city) {
        return this.setState({error: 'Please provide your city'})
      } else if (!doctorInfo.state) {
        return this.setState({error: 'Please provide your state'})
      } else if (!doctorInfo.zip) {
        return this.setState({error: 'Please provide your zip code'})
      } else if (!doctorInfo.phone) {
        return this.setState({error: 'Please provide your phone number'})
      } else if (!doctorInfo.npi) {
        return this.setState({error: 'Please provide your NPI number'})
      }
    }

    Accounts.createUser({email, password, firstName, lastName, accountType, doctorInfo}, (err) => {
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
        {this.props.showLogin && <Login />}
        <div className="boxed-view__signup-box__wrapper">
          <div className="boxed-view__signup-box center-align">
            {this.state.error ? <p>{this.state.error}</p> : undefined}
            <div className='row'>
              <h4 className='boxed-view__signup-box__header'>Are you a</h4>
            </div>
            <div className='row center-align'>
              <div className={`btn ${this.state.accountType === 'patient' ? 'deep-purple' : 'grey'}`} onClick={() => this.setState({accountType: 'patient'})}>
                Patient
              </div>
              <div className='boxed-view__signup-box__header median'>or</div>
              <div className={`btn ${this.state.accountType === 'doctor' ? 'deep-purple' : 'grey'}`} onClick={() => this.setState({accountType: 'doctor'})}>
                Doctor
              </div>
            </div>
            <div className='boxed-view__signup-box__form'>
              <div className='row'>
                <div className="input-field col s6">
                  <input type="text" id='firstName' name="firstName" required className='validate' onChange={this.handleChange.bind(this)} />
                  <label className='active' htmlFor='firstName'>First Name</label>
                </div>
                <div className="input-field col s6">
                  <input type="text" id='lastName' name="lastName" required className='validate' onChange={this.handleChange.bind(this)} />
                  <label className='active' htmlFor='lastName'>Last Name</label>
                </div>
              </div>
              <div className="input-field">
                <input type="email" id='email' name="email" onChange={this.handleChange.bind(this)}/>
                <label className='active' htmlFor='email'>Email</label>
              </div>
              <div className="input-field">
                <input type="password" id='password' name="password" onChange={this.handleChange.bind(this)}/>
                <label className='active' htmlFor='password' >Password</label>
              </div>
              <div className="input-field">
                <input type="password" id='passwordConfirm' name="passwordConfirm" onChange={this.handleChange.bind(this)}/>
                <label className='active' htmlFor='passwordConfirm'>Confirm Password</label>
              </div>
              {this.state.accountType === 'doctor' &&
                <div>
                  <Row>
                    {/* <div className='account-info__form-category left-align'>Address:</div> */}
                    <Input s={12} name='officeAddress' label='Office Address' defaultValue={this.state.officeAddress} onChange={this.handleChange.bind(this)} />
                    <Input s={4} name='city' label='City' defaultValue={this.state.city} onChange={this.handleChange.bind(this)} />
                    <Input s={4} type='select' name='state' label='State' defaultValue={this.state.state} onChange={this.handleChange.bind(this)}>
                      <option value=""></option>
                      <option value="AL">Alabama</option>
                    	<option value="AK">Alaska</option>
                    	<option value="AZ">Arizona</option>
                    	<option value="AR">Arkansas</option>
                    	<option value="CA">California</option>
                    	<option value="CO">Colorado</option>
                    	<option value="CT">Connecticut</option>
                    	<option value="DE">Delaware</option>
                    	<option value="DC">District Of Columbia</option>
                    	<option value="FL">Florida</option>
                    	<option value="GA">Georgia</option>
                    	<option value="HI">Hawaii</option>
                    	<option value="ID">Idaho</option>
                    	<option value="IL">Illinois</option>
                    	<option value="IN">Indiana</option>
                    	<option value="IA">Iowa</option>
                    	<option value="KS">Kansas</option>
                    	<option value="KY">Kentucky</option>
                    	<option value="LA">Louisiana</option>
                    	<option value="ME">Maine</option>
                    	<option value="MD">Maryland</option>
                    	<option value="MA">Massachusetts</option>
                    	<option value="MI">Michigan</option>
                    	<option value="MN">Minnesota</option>
                    	<option value="MS">Mississippi</option>
                    	<option value="MO">Missouri</option>
                    	<option value="MT">Montana</option>
                    	<option value="NE">Nebraska</option>
                    	<option value="NV">Nevada</option>
                    	<option value="NH">New Hampshire</option>
                    	<option value="NJ">New Jersey</option>
                    	<option value="NM">New Mexico</option>
                    	<option value="NY">New York</option>
                    	<option value="NC">North Carolina</option>
                    	<option value="ND">North Dakota</option>
                    	<option value="OH">Ohio</option>
                    	<option value="OK">Oklahoma</option>
                    	<option value="OR">Oregon</option>
                    	<option value="PA">Pennsylvania</option>
                    	<option value="RI">Rhode Island</option>
                    	<option value="SC">South Carolina</option>
                    	<option value="SD">South Dakota</option>
                    	<option value="TN">Tennessee</option>
                    	<option value="TX">Texas</option>
                    	<option value="UT">Utah</option>
                    	<option value="VT">Vermont</option>
                    	<option value="VA">Virginia</option>
                    	<option value="WA">Washington</option>
                    	<option value="WV">West Virginia</option>
                    	<option value="WI">Wisconsin</option>
                    	<option value="WY">Wyoming</option>
                    </Input>
                    <Input s={4} name='zip' label='Zip' defaultValue={this.state.zip} onChange={this.handleChange.bind(this)} />
                  </Row>
                  <Row>
                    {/* <div className='account-info__form-category left-align'>Contact:</div> */}
                    <Input s={5} name='phone' label='Phone' defaultValue={this.state.phone} onChange={this.handleChange.bind(this)}/>
                    <Input s={7} name='npi' label='NPI #' defaultValue={this.state.npi} onChange={this.handleChange.bind(this)}/>
                  </Row>
                </div>
              }
            </div>
            <button className="button button--auth landing" onClick={() => this.handleSubmit()}>Create Account</button>
            <div><Link to="#" onClick={() => Session.set('showLogin', true)}>Have an Account?</Link></div>
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
}, Signup);
//   render() {
//     return (
//       <div>
//         <div className="boxed-view signup">
//           <div className="boxed-view__box signup">
//             <h1>Join</h1>
//             {this.state.error ? <p>{this.state.error}</p> : undefined}
//             <form onSubmit={this.onSubmit.bind(this)} noValidate className="boxed-view__form">
//               <div className='row'>
//                 <p>Are you a patient or a doctor?</p>
//                 <div className={`btn ${this.state.accountType === 'patient' ? 'deep-purple' : 'grey'}`} onClick={() => this.setState({accountType: 'patient'})}>
//                   Patient
//                 </div>
//                 <div className={`btn ${this.state.accountType === 'doctor' ? 'deep-purple' : 'grey'}`} onClick={() => this.setState({accountType: 'doctor'})}>
//                   Doctor
//                 </div>
//               </div>
//               <div className='row'>
//                 <div className="input-field col s6">
//                   <input type="text" ref="firstName" id='firstName' name="firstName" required className='validate'/>
//                   <label className='active' htmlFor='firstName'>First Name</label>
//                 </div>
//                 <div className="input-field col s6">
//                   <input type="text" ref="lastName" id='lastName' name="lastName" required className='validate' />
//                   <label className='active' htmlFor='lastName'>Last Name</label>
//                 </div>
//               </div>
//               <div className="input-field">
//                 <input type="email" ref="email" id='email' name="email"/>
//                 <label className='active' htmlFor='email'>Email</label>
//               </div>
//               <div className="input-field">
//                 <input type="password" ref="password" id='password' name="password"/>
//                 <label className='active' htmlFor='password'>Password</label>
//               </div>
//               <button className="button button--auth landing">Create Account</button>
//             </form>
//             <Link to="/login">Have an account?</Link>
//           </div>
//         </div>
//       </div>
//     );
//   }
// };
