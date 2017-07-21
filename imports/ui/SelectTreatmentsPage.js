import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import FlipMove from 'react-flip-move';

import { UserTreatments } from '../api/user-treatments';

import { TreatmentItem } from './TreatmentItem';

{/* <FlipMove duration={700} easing="ease-out">
  {this.props.userTreatments.map((treatment) =>
    <div className="treatment-item" key={treatment._id}>
      <TreatmentItem treatment={treatment}/>
    </div>
  )}
</FlipMove> */}

class SelectTreatmentsPage extends React.Component {
  renderUserTreatments() {
    return (
      <FlipMove duration={700} easing="ease-out">
        {this.props.userTreatments.length === 0
        ?
          <div className="ui message">
            <div className="header">Click the green button to add new treatments</div>
            <p>All changes are automatically saved and you can edit the list anytime</p>
          </div>

        :
          this.props.userTreatments.map((treatment) =>
            <div className="treatment-item" key={treatment._id}>
              <TreatmentItem treatment={treatment}/>
            </div>
          )
        }
        <div>
          <button className={"ui " + (this.props.userTreatments.length > 0 ? "blue" : "grey") + " fluid button"}>
            {this.props.userTreatments.length > 0 ? "NEXT" : "SKIP FOR NOW"}
          </button>
        </div>
      </FlipMove>
    );
  }


  render() {
    return (
      <div>
        <div className="page-content">
          <h1 className="ui centered header">Select Treatments</h1>
          <button className="ui positive basic button"
            onClick={() => Meteor.call('userTreatments.insert')}>
            New Treatment
          </button>
          {this.renderUserTreatments()}
        </div>
      </div>
    );
  }
};

export default createContainer(() => {
  Meteor.subscribe('userTreatments');

  return {
    userTreatments: UserTreatments.find({}, {sort: {createdAt: -1}}).fetch()
  }
}, SelectTreatmentsPage);
