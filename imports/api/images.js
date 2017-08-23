import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Meteor.publish('images', function(){ return Images.find(); });

Meteor.methods({
  'upload'(file) {
    console.log(file);
    // var fsFile = new FS.File(files[0]);
    // console.log(fsFile);
    // fsFile.owner = Meteor.userId();
    // Images.insert(fsFile, function (err) {
    //   if (err) throw err;
    // });
  //   FS.Utility.eachFile(event, function(file) {
  //     Images.insert(file, function (err, fileObj) {
  //       if (err){
  //          // handle error
  //       } else {
  //          // handle success depending what you need to do
  //         var userId = Meteor.userId();
  //         var imagesURL = {
  //           “profile.image”: “/cfs/files/images/“ + fileObj._id
  //         };
  //         Meteor.users.update(userId, {$set: imagesURL});
  //       }
  //     });
  //  });
  }
});
