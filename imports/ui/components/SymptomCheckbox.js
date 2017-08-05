import React from 'react';
import { Meteor } from 'meteor/meteor';
import Toggle from 'react-toggle';

export default class SymptomCheckbox extends React.Component {
  handleChange() {
    if (this.props.isChecked) {
      Meteor.call('userSymptoms.remove', this.props.symptom);
    } else {
      Meteor.call('userSymptoms.insert', this.props.symptom)
    }
  }
  render() {
    return (
      <div>
        <label className="symptom-group__item">
          <Toggle
            checked={this.props.isChecked}
            icons={false}
            onChange={this.handleChange.bind(this)} />
          <span className="symptom-group__item__title">{this.props.symptom}</span>
        </label>
      </div>

    );
  }
};

// <div>
//   <label>{this.props.symptom}
//     <input type="checkbox" checked={this.props.isChecked} value={this.props.symptom} onChange={() => {
//       this.handleChange();
//     }}/>
//   </label>
// </div>
