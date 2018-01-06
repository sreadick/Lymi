import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Row, Col, Input, Button } from 'react-materialize';
import { Session } from 'meteor/session';

class DoctorSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchDocFirstName: '',
      searchDocLastName: '',
      searchDocZip: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.findDoctor = this.findDoctor.bind(this);
    this.linkToDcotor = this.linkToDcotor.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }
  handleChange(e) {
    if (e.target.name === 'searchDocZip' && (isNaN(e.target.value) || e.target.value.length > 5)) {
      return;
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }
  findDoctor() {
    const {searchDocFirstName, searchDocLastName, searchDocZip} = this.state;
    if (searchDocFirstName.trim() && searchDocLastName.trim() && searchDocZip.trim()) {
      const searchedDocInfo = {
        firstName: searchDocFirstName,
        lastName: searchDocLastName,
        zip: searchDocZip
      }
      Session.set('searchedDocInfo', searchedDocInfo);
    }
  }

  linkToDcotor(doctorId) {
    Meteor.call('users.updateLymeDoctor', doctorId, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        Meteor.call('requests.remove', {patientId: Meteor.userId(), doctorId: doctorId});
        Session.set({'searchedDocInfo': undefined, 'isDocLinked': true});
      }
    });
  }
  resetSearch() {
    Session.set('searchedDocInfo', undefined);
    this.setState({
      searchDocFirstName: '',
      searchDocLastName: '',
      searchDocZip: '',
    });
  }
  render() {
    // if (this.props.isFetching) {
    //   return (
    //     <div className='boxed-view__modal-overlay'>
    //       <div className='boxed-view__box--doctor-search'> </div>
    //     </div>
    //   )
    // }
    return (
      <div className='boxed-view__modal-overlay'>
        <div className='boxed-view__box--doctor-search'>
          <div className='boxed-view__box--doctor-search__header'>
            <Row>
              <i
                className='small right material-icons button--icon'
                onClick={() => Session.set({'searchedDocInfo': undefined, 'isDocLinked': false, 'showDoctorSearch': false}) }>
                close
              </i>
            </Row>
            <Row>
              <h4>Find Your Doctor</h4>
            </Row>
          </div>
          {!this.props.isFetching &&
            this.props.isDocLinked ?
            <div className='boxed-view__box--doctor-search__content'>
              <p>Your doctor has been successfully linked to your account!</p>
              <div>
                <div className='button--link' onClick={() => Session.set({'isDocLinked': false, 'showDoctorSearch': false})}>Close</div>
              </div>
            </div>
            : this.props.searchedDoctor ?
              <div className='boxed-view__box--doctor-search__content'>
                <Row>
                  <p>Doctor Found:</p>
                </Row>
                <div>
                  <div className='boxed-view__box--doctor-search__content__doctor-info'>
                    <Row>
                      <h5>{this.props.searchedDoctor.profile.firstName} {this.props.searchedDoctor.profile.lastName}</h5>
                    </Row>
                    <Row>
                      <h6>{this.props.searchedDoctor.profile.officeAddress}</h6>
                    </Row>
                    <Row>
                      <h6>{this.props.searchedDoctor.profile.city}, {this.props.searchedDoctor.profile.state} {this.props.searchedDoctor.profile.zip}</h6>
                    </Row>
                  </div>
                  <Row>
                    {this.props.searchedDoctor._id !== Meteor.user().doctorId ?
                      <Button className='white black-text' onClick={() => this.linkToDcotor(this.props.searchedDoctor._id)}>Confirm</Button>
                      :
                      <p>This is your current doctor</p>
                    }
                  </Row>
                </div>
                <Row>
                  <div className='blue-text button--link' onClick={this.resetSearch}>Search Again</div>
                </Row>
              </div>
            : this.props.searchedDocInfo ?
              <div className='boxed-view__box--doctor-search__content'>
                <p>Sorry, but that doctor is not in our system yet</p>
                <div>
                  <div className='blue-text button--link' onClick={this.resetSearch}>Search Again</div>
                </div>
              </div>
            :
              <div className='boxed-view__box--doctor-search__content'>
                <div>
                  <p>To link accounts with your doctor enter his/her name and office zipcode.</p>
                </div>
                <div>
                  <Row>
                    {/* <Col s={12}> */}
                      <Input s={6} name='searchDocFirstName' defaultValue={this.state.searchDocFirstName} label='First Name' onChange={this.handleChange} />
                      <Input s={6} name='searchDocLastName' defaultValue={this.state.searchDocLastName} label='First Name' onChange={this.handleChange} />
                    {/* </Col> */}
                  </Row>
                  <Row>
                    {/* <Col s={4} offset='s4'> */}
                      <Input s={6} name='searchDocZip' defaultValue={this.state.searchDocZip} label='Zip' onChange={this.handleChange} />
                    {/* </Col> */}
                  </Row>
                </div>
                <Row>
                  <Button onClick={this.findDoctor}>Search</Button>
                </Row>
              </div>
          }
        </div>
      </div>
    );
  }
};

export default createContainer(props => {
  let searchedDocInfo = Session.get('searchedDocInfo');
  // console.log(searchedDocInfo);
  const searchedDoctorHandle = Meteor.subscribe('searchedDoctor', {
    firstName: searchedDocInfo ? searchedDocInfo.firstName : '',
    lastName: searchedDocInfo ? searchedDocInfo.lastName : '',
    zip: searchedDocInfo ? searchedDocInfo.zip : ''
  });

  const searchedDoctor = Meteor.users.findOne({
    'account.type': 'doctor',
    'profile.firstName': searchedDocInfo ? searchedDocInfo.firstName : '',
    'profile.lastName': searchedDocInfo ? searchedDocInfo.lastName : '',
    'profile.zip': searchedDocInfo ? searchedDocInfo.zip : ''
  });
  // console.log('searchedDoctor:' , searchedDoctor);
  const isDocLinked = Session.get('isDocLinked') || false;
  return {
    searchedDoctor,
    searchedDocInfo,
    isDocLinked,
    isFetching: !Meteor.user() || !searchedDoctorHandle.ready(),
  }
}, DoctorSearch)
