import React from 'react'
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import {capitalizePhrase} from '../../../utils/utils';

import SymptomChart from './SymptomChart';
import Pagination from './Pagination';


const SymptomChartItem = (props) => (
  <div className={window.innerWidth > 1200 && "card"}>
    {props.title && <h5>{props.title}</h5>}
    {props.symptoms.map((symptom, index) => (
      <div key={symptom.name}>
        <span
          className={`checkin-symptom-item ${!props.currentUserSymptomsNames.find(userSymptomName => userSymptomName === symptom.name) ? 'deleted' : ''}`}
          style={{
            color: symptom.color,
            fontWeight: (!props.activeSegmentSymptoms || (props.activeSegmentSymptoms && props.activeSegmentSymptoms.find(groupedSymptom => groupedSymptom.name === symptom.name))) ? '700' : '300',
          }}>
          {capitalizePhrase(symptom.name)}
        </span>
      </div>
    ))}
    <SymptomChart
      symptomNames={props.activeSegmentSymptoms ?
        props.activeSegmentSymptoms.map(symptom => symptom.name)
        :
        props.symptoms.map(symptom => symptom.name)
      }
      symptomColors={props.activeSegmentSymptoms ?
        props.activeSegmentSymptoms.map(symptom => symptom.color)
        :
        props.symptoms.map(symptom => symptom.color)
      }
      checkins={props.checkins}
      currentSymptomNames={props.currentUserSymptomsNames}
      padding={{top: 30, right: 30, bottom: 10, left: 0}}
    />
    {props.symptoms.length > props.maxSymptomsPerSegment &&
      <div className='row center-align'>
          <Pagination display={props.title} activeSegmentNumber={props.activeSegmentNumber} totalNumSegments={Math.ceil(props.symptoms.length / props.maxSymptomsPerSegment)}/>
      </div>
    }
  </div>
);

SymptomChartItem.propTypes = {
  title: PropTypes.string,
  symptoms: PropTypes.array.isRequired,
  currentUserSymptomsNames: PropTypes.array.isRequired,
  checkins: PropTypes.array.isRequired,
  maxSymptomsPerSegment: PropTypes.number.isRequired,
}

export default createContainer((props) => {
  const activeSegmentNumber = props.symptoms.length > props.maxSymptomsPerSegment ? (Session.get(`activeSegmentNumber_${props.title}`) || 1) : undefined;

  return {
    activeSegmentNumber,
    activeSegmentSymptoms: activeSegmentNumber ? props.symptoms.slice((activeSegmentNumber - 1) * props.maxSymptomsPerSegment, activeSegmentNumber * props.maxSymptomsPerSegment) : undefined,
  };

}, SymptomChartItem);
