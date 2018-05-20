import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import AvatarEditor from 'react-avatar-editor'

export default class ProfileImageModel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgFile: (Meteor.user() && Meteor.user().profile.userPhoto) ? Meteor.user().profile.userPhoto : '',
      scale: '1'
    }
  }
  selectProfilePhoto() {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
      console.log(canvasScaled);


      if (typeof canvasScaled.toBlob !== "undefined") {
        canvasScaled.toBlob(function(blob) {
            // send the blob to server etc.
          console.log(blob);
          var uploader = new Slingshot.Upload("myFileUploads");

          uploader.send(blob, function (error, downloadUrl) {
            if (error) {
              console.error('Error uploading', uploader.xhr.response);
              alert (error);
            }
            else {
              Meteor.users.update(Meteor.userId(), {
                $set: {
                  'profile.userPhoto': downloadUrl
                }
              });
            }
          });
        }, "image/jpeg", 0.75);
      } else {
        'abc'
      }



      // const newBlob = canvasScaled.toBlob(function(blob) {
      //
      // }, "image/jpeg");
      // console.log(newBlob);



    } else {
      console.log(2);
    }
  }
  selectProfilePhoto2() {
    const canvasScaled = this.editor.getImageScaledToCanvas()
    console.log(canvasScaled);



    canvasScaled.toBlob(function(blob) {
      const file = blob;
      const imageType = /image.*/;

      if (file.type.match(imageType)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = reader.result;
          Meteor.users.update(Meteor.userId(), {
            $set: {
              'profile.userPhoto': img.src
            }
          });
          Session.set('showProfileImageModel', false)
        }

        reader.readAsDataURL(file);
      } else {
        alert('File type not supported');
      }
    }, "image/jpeg", 0.75);

  }
  // selectProfilePhoto() {
  //   const file = this.refs.photoInput.files[0];
  //   const imageType = /image.*/;
  //
  //   if (file.type.match(imageType)) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const img = new Image();
  //       img.src = reader.result;
  //       Meteor.users.update(Meteor.userId(), {
  //         $set: {
  //           'profile.userPhoto': img.src
  //         }
  //       });
  //       Session.set('showProfileImageModel', false)
  //     }
  //
  //     reader.readAsDataURL(file);
  //   } else {
  //     alert('File type not supported');
  //   }
  // }

  setEditorRef = (editor) => this.editor = editor

  render() {
    return (
      <div className="boxed-view__box--profile-model__wrapper">
        <div className="boxed-view__box--profile-model">
          <i className='material-icons right'
            onClick={() => Session.set('showProfileImageModel', false)}>
            clear
          </i>
          <form onSubmit={(e) => {
            e.preventDefault();
            // selectProfilePhoto()
          }}>
            {/* <div> */}
              {/* <span className='row'>Select your profile picture </span> */}
              {/* <input className='row' type='file' ref='photoInput' onChange={this.selectProfilePhoto.bind(this)}/> */}
              {/* {this.state.imgFile && */}
                <AvatarEditor
                  // image='/images/computer_screen.jpg'
                  image={this.state.imgFile || ''}
                  ref={this.setEditorRef}
                  width={200}
                  height={200}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={this.state.scale}
                  rotate={0}
                  borderRadius={100}
                />
              {/* } */}
              <input type='range' step="0.01" min='1' max='2' name='scale' value={this.state.scale} onChange={(e) => this.setState({scale: e.target.value})}/>
              <input className='row' type='file' ref='photoInput' onChange={() => {
                console.log(this.refs.photoInput.files[0]);
                this.setState({imgFile: this.refs.photoInput.files[0]});
              }} />
              {this.state.imgFile &&
                <button onClick={this.selectProfilePhoto2.bind(this)}>Select and Save</button>
              }
              {/* <input className='row' type='file' ref='photoInput' onChange={() => this.setState({imgFile: this.refs.photoInput.files[0]})}/> */}
            {/* </div> */}
          </form>
        </div>
      </div>
    );
  }
};


// {/* <div className="boxed-view__box--profile-model__wrapper">
//   <div className="boxed-view__box--profile-model">
//     <i className='material-icons right'
//       onClick={() => Session.set('showProfileImageModel', false)}>
//       clear
//     </i>
//     <form onSubmit={(e) => {
//       e.preventDefault();
//       selectProfilePhoto()
//     }}>
//       <div>
//         <span className='row'>Select your profile picture </span>
//         <input className='row' type='file' ref='photoInput' onChange={this.selectProfilePhoto.bind(this)}/>
//       </div>
//     </form>
//   </div>
// </div> */}
