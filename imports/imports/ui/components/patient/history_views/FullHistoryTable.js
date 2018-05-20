import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Input, Button } from 'react-materialize';
import {capitalizePhrase} from '/imports/utils/utils';

export default class FullHistoryTable extends React.Component {
  render() {
    return (
      <div>
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
              </div>
            }
            {checkin.symptoms &&
              <table className='striped'>
                <thead>
                  <tr>
                    <th>Symptoms</th>
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
            }
            {(checkin.treatments && checkin.treatments.length > 0) &&
              <table className='striped'>
                {/* <h5>Treatments</h5> */}
                <thead>
                  <tr>
                    <th>Treatments</th>
                    <th>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  { checkin.treatments.length === 0 ?
                    <tr>
                      <td className="grey-text">No Treatments This Day</td>
                    </tr>
                  :
                    checkin.treatments.map(checkinTreatment =>
                      <tr key={checkinTreatment.name}>
                        <td>{checkinTreatment.name}</td>
                        <td>
                          { (checkinTreatment.prescribedToday === false || checkinTreatment.compliance === 'NPD') ? "Not Prescribed Today"
                            : checkinTreatment.compliance === null ? 'Not Specified'
                            : checkinTreatment.compliance
                          }
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            }
            {checkin.notableEvents &&
              <table className=''>
                <thead>
                  <tr>
                    <th>Notable Events</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{checkin.notableEvents}</td>
                  </tr>
                </tbody>
              </table>
            }
          </div>
        )}
      </div>
    );
  }
};
