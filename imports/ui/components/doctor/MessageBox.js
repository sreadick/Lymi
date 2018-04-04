import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Input } from 'react-materialize';
import { createContainer } from 'meteor/react-meteor-data';

export default class MessageBox extends React.Component {
  constructor() {
    super();

    this.state = {
      body: ''
    };
  }
  render() {
    const {props} = this;
    return (
      <div className='boxed-view__modal-overlay'>
        <div className='boxed-view__box--message'>
          <div className='boxed-view__box__header--message'>
            <Row>
              <i
                className='small right material-icons button--icon'
                onClick={() => Session.set('showMessageBox', false) }>
                close
              </i>
            </Row>
            <Row>
              <h4>{`Send Message to ${props.patient.profile.firstName}`}</h4>
            </Row>
            <Row>
              <div className='input-field col s10 offset-s1'>
                <input type="text" id='messageBody' onChange={(e) => this.setState({body: e.target.value})} />
                <label htmlFor='messageBody'>Message</label>
              </div>
            </Row>
            <Row>
              <div className='message--dr-message-box'>
                Please note: Messages should primarily serve to notify patients about outstanding in-app tasks (e.g. filling out missing data, updating treatments, adding appointments, etc). Patients will not be able to write back.
              </div>
            </Row>
            <button className={`btn ${!this.state.body.trim() ? 'disabled' : 'grey lighten-1 grey-text text-darken-3'}`}
              onClick={() => {
                if (this.state.body.trim()) {
                  Meteor.call('messages.insert', {patientId: props.patient._id, body: this.state.body.trim()},
                    (err, res) => {
                      if (err) {
                        console.log(err);
                      } else {
                        document.getElementById('message--dr-message--success').classList.add('active');
                        Session.set('showMessageBox', false);
                      }
                    }
                  );
                }
              }}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }
}
