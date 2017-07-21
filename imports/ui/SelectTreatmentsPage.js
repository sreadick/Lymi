import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { UserTreatments } from '../api/user-treatments';

class SelectTreatmentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      amount: 1,
      dose: 0,
      dose_type: 'milligrams',
      frequency: 1
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    Meteor.call('user-treatments.insert', { ...this.state });
  }

  render() {
    return (
      <div>
        <div className="page-content">
          <h1>Select Treatments</h1>
          <div className="ui raised fluid card">
            <div className="content">
              <form className="ui form" onSubmit={this.handleSubmit.bind(this)}>
                <div className="header">{this.state.name}</div>
                <div className="field">
                  <label>Name</label>
                  <input type="text" name="name" value={this.state.name} placeholder="Medication/Supplement" onChange={this.handleChange.bind(this)}/>
                </div>

                <div className="fields">
                  <div className="five wide field">
                    <label>Amount</label>
                    <input type="number" name="amount" value={this.state.amount} onChange={this.handleChange.bind(this)}/>
                  </div>

                  <div className="six wide field">
                    <label>Dose</label>
                    <div className="ui input">
                      <input type="number" name="dose" value={this.state.dose} step="25" placeholder="100" onChange={this.handleChange.bind(this)}/>
                      <div>
                        <select className="ui basic dropdown" name="dose_type" onChange={this.handleChange.bind(this)}>
                          <option value="milligrams" defaultValue>mg</option>
                          <option value="units">iu</option>
                          <option value="pills">pills</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="five wide field">
                    <label>Frequency</label>
                    <div className="ui right labeled input">
                      <input type="number" name="frequency" value={this.state.frequency} placeholder="per day" onChange={this.handleChange.bind(this)}/>
                      <div className="ui basic label">
                        {this.state.frequency == "1" ? "time" : "times" } per day
                      </div>
                    </div>
                  </div>
                </div>

                <button className="ui positive basic button">Add Treatment</button>

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  Meteor.subscribe('userTreatments');

  return {
    userTreatments: UserTreatments.find().fetch()
  }
}, SelectTreatmentsPage);






{/* <div className="three wide field">
  <label>Unit</label>
  <select name="dose_type" onChange={this.handleChange.bind(this)}>
    <option value="milligrams" defaultValue>mg</option>
    <option value="units">iu</option>
    <option value="pills">pills</option>
  </select>
</div> */}
