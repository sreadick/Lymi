import React from 'react'
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { capitalizePhrase } from '../../../utils/utils';

export const TreatmentSelectSidebar2 = (props) => (
  <div className='treatment-select-sidebar z-depth-2'>
    <div className='center-align'>
      <button
        className='black white-text btn waves-effect waves-light hoverable'
        onClick={() => {
          Session.set({
            'displayTreatmentEditor': true,
            'currentTreatmentId': null
          });
          // Meteor.call('userTreatments.insert', (err, res) => {
          //   if (err) {
          //     console.log(err);
          //   } else {
          //     Session.set('currentTreatmentId', res)
          //   }
          // })
        }}
        >New Treatment
      </button>
    </div>
    <div className='section'>
      { props.userTreatments.length === 0 ?
        <div className='center-align'>Add at least one treatment before proceding.</div>
        :
        props.userTreatments.map(treatment =>
          <div
            key={treatment._id}
            className={`treatment-select-sidebar__item ${Session.get('selectedTreatmentDetails') === treatment._id && 'selected'}`}
            onClick={(e) => {
              if (e.target.id !== 'treatment_delete_icon' && e.target.id !== 'treatment_edit_icon') {
                Session.set('selectedTreatmentDetails', treatment._id)
              }
            }}>
            <div className=''>
              <span className={treatment.name ? 'black-text' : 'grey-text'}>{capitalizePhrase(treatment.name) || "Untitled Treatment"}</span>
              {/* {Object.keys(treatment.errors).length > 0 && <i className="material-icons red-text text-lighten-2 right">priority_high</i>} */}
              <i
                className='right material-icons button--icon red-text'
                id='treatment_delete_icon'
                onClick={() => {
                  Session.set('selectedTreatmentDetails', undefined)
                  Meteor.call('userTreatments.remove', treatment._id)
                }}>
                delete_forever
              </i>
              <i
                id='treatment_edit_icon'
                className='right material-icons button--icon'
                onClick={() => {
                  Session.set({
                    'displayTreatmentEditor': true,
                    'currentTreatmentId': treatment._id
                  });
                }}>
                edit
              </i>
            </div>
          </div>
        )
      }
    </div>
  </div>
);

TreatmentSelectSidebar2.propTypes = {
  userTreatments: PropTypes.array.isRequired
}
