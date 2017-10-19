import React from 'react'
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import {capitalizePhrase} from '../../../utils/utils';

export const TreatmentSelectSidebar = (props) => (
  <div className='treatment-select-sidebar z-depth-2'>
    <div className='center-align'>
      <button
        className='black btn waves-effect waves-light'
        onClick={() => {
          Meteor.call('userTreatments.insert', (err, res) => {
            if (err) {
              console.log(err);
            } else {
              Session.set('currentTreatmentId', res)
            }
          })
        }}
        >New Treatment
      </button>
    </div>
    <div className='section'>
      { props.userTreatments.length === 0 ?
        <div>Add at least one treatment before proceding.</div>
        :
        props.userTreatments.map(treatment =>
          <div
            key={treatment._id}
            className={`treatment-select-sidebar__item ${Session.get('currentTreatmentId') === treatment._id && 'selected'}`}
            onClick={() => Session.set('currentTreatmentId', treatment._id)}>
            <div className='title'>{capitalizePhrase(treatment.name) || "Untitled Treatment"}</div>
          </div>
        )
      }
    </div>
  </div>
);

TreatmentSelectSidebar.propTypes = {
  userTreatments: PropTypes.array.isRequired
}
