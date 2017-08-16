import React from 'react';
import { Meteor } from 'meteor/meteor';
import Toggle from 'react-toggle';

export default class SymptomCheckbox extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     isChecked: props.isChecked
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.isChecked !== this.props.isChecked) {
  //     // console.log(prevProps)
  //     // console.log(this.props)
  //     this.setState({ isChecked: this.props.isChecked })
  //   }
  // }

  handleChange(e) {
    // if (!e.target.checked) {
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
            className="symptom_toggle"
            checked={this.props.isChecked}
            value="yes"
            onChange={this.handleChange.bind(this)} />
          <span className="symptom-group__item__title">{this.props.symptom}</span>
        </label>
      </div>

    );
  }
};

// export default createContainer(() => {
//   const symptomHandle = Meteor.subscribe('userSymptoms');
//   const checkinHandle = Meteor.subscribe('checkinHistories')
//
//   const checkinHistoryIsReady = checkinHandle.ready() && !!CheckinHistories.findOne();
//
//   console.log(UserSymptoms.find({}, {sort: {createdAt: -1}}).fetch());
//
//   return {
//     userSymptoms: UserSymptoms.find({}, {sort: {createdAt: -1}}).fetch(),
//     checkinHistory: CheckinHistories.findOne(),
//     checkinHistoryIsReady
//   }
// }, SelectSymptomsPage);
