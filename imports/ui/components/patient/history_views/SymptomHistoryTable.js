import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

export default class SymptomHistoryTable extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     graphedSymptoms: [],
  //   }
  // }

  render() {
    return (
      <div className='symptom-history__graph-view'>
        {this.props.checkins.map(checkin =>
          <div className="section" key={checkin.date}>
            <h4>{checkin.date}</h4>
            { checkin.symptoms === undefined ?
              <div>
                <p>You didn't check in on this date</p>
                <Link
                  className="waves-effect waves-light pink btn"
                  to={{
                    pathname: "/patient/checkin",
                    state: {
                      checkinDate: checkin.date,
                      symptoms: this.props.currentSymptoms,
                      treatments: this.props.currentTreatments,
                      position: (this.props.checkins.length - checkin.index - 1)
                    },
                  }}>
                  Check in now
                </Link>
              </div>
              :
              <div>
                {moment(checkin.date, 'MMMM Do YYYY').startOf('day').isBetween(moment().subtract(3, 'days'), moment()) &&
                  <Link
                    className="waves-effect waves-light deep-purple btn"
                    to={{
                      pathname: "/patient/checkin",
                      state: {
                        checkinDate: checkin.date,
                        symptoms: checkin.symptoms ? checkin.symptoms.map(symptom => {
                          return {
                            name: symptom.name
                          };
                        }) : undefined,
                        treatments: checkin.treatments ? checkin.treatments.map(treatment => {
                          return {
                            name: treatment.name,
                            dateSelectMode: 'daily',
                          };
                        }) : undefined
                      },
                    }}>
                    Edit check-in
                  </Link>
                }
                <table className='striped'>
                  <thead>
                    <tr>
                      <th>Symptom</th>
                      <th>Severity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {checkin.symptoms.map(checkinSymptom =>
                      <tr key={checkinSymptom.name}>
                        <td>{capitalizePhrase(checkinSymptom.name)}</td>
                        <td>{checkinSymptom.severity === 0 ? 'N/A' : checkinSymptom.severity}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }
          </div>
        )}
      </div>
    );
  }
};
