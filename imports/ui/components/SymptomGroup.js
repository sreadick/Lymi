import React from 'react';
import { Meteor } from 'meteor/meteor';
import { UserSymptoms } from '../../api/user-symptoms';

import SymptomCheckbox from './SymptomCheckbox';

export const SymptomGroup = (props) => (
  <div className="symptom-group">
    <h4 className="symptom-group__category">{ props.category }</h4>
    <div className=''>
      {props.symptoms.map((symptom) => {
        return (
          <SymptomCheckbox
            key={symptom}
            symptom={symptom}
            isChecked={!!props.userSymptoms.find((userSymptom) => userSymptom.name === symptom)}
          />
        )
      })}
    </div>
  </div>
);
