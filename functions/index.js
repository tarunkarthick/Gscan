const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.notifyUser = functions.https.onCall((data, context) => {

    admin.messaging().sendToDevice(
        data.owner.tokens, // ['token_1', 'token_2', ...]
        {
          data: {
            // Role: JSON.stringify(data.Role),
            // item: JSON.stringify(data.item),
            // owner:JSON.stringify(data.owner),
            // author:JSON.stringify(data.author),
            // type:JSON.stringify(data.type)
          },
          notification:{
            title:`${data.author.name} sent you a request`,
            body:`${data.author.name} invited you to join their workspace-${data.item.name}`,           
          }
        },
        {
          // Required for background/quit data-only messages on iOS
          contentAvailable: true,
          // Required for background/quit data-only messages on Android
          priority: 'high',
        },
    );
})

exports.acceptCall = functions.https.onCall((data, context) => {

  admin.messaging().sendToDevice(
      data.author.tokens, // ['token_1', 'token_2', ...]
      {
        data: {
          // Role: JSON.stringify(data.Role),
          // item: JSON.stringify(data.item),
          // owner:JSON.stringify(data.owner),
          // author:JSON.stringify(data.author),
          // type:JSON.stringify(data.type)
        },
        notification:{
          title:`Invitation Accepted`,
          body:`${data.owner.name} accepted your invite to join the workspace`
        }
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: 'high',
      },
  );
})


exports.declineCall = functions.https.onCall((data, context) => {

  admin.messaging().sendToDevice(
      data.author.tokens, // ['token_1', 'token_2', ...]
      {
        data: {
          // Role: JSON.stringify(data.Role),
          // item: JSON.stringify(data.item),
          // owner:JSON.stringify(data.owner),
          // author:JSON.stringify(data.author),
          // type:JSON.stringify(data.type)
        },
        notification:{
          title:`Invitation Declined`,
          body:`${data.owner.name} declined your invite to join the workspace`
        }
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: 'high',
      },
  );
})


exports.LeaveCall = functions.https.onCall((data, context) => {

  admin.messaging().sendToDevice(
      data.owner.tokens, // ['token_1', 'token_2', ...]
      {
        data: {
          // Role: JSON.stringify(data.Role),
          // item: JSON.stringify(data.item),
          // owner:JSON.stringify(data.owner),
          // author:JSON.stringify(data.author),
          // type:JSON.stringify(data.type)
        },
        notification:{
          title:`${data.item.name}`,
          body:`You have been removed from the workspace`
        }
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: 'high',
      },
  );
})

exports.RoleCall = functions.https.onCall((data, context) => {

  admin.messaging().sendToDevice(
      data.owner.tokens, // ['token_1', 'token_2', ...]
      {
        data: {
          // Role: JSON.stringify(data.Role),
          // item: JSON.stringify(data.item),
          // owner:JSON.stringify(data.owner),
          // author:JSON.stringify(data.author),
          // type:JSON.stringify(data.type)
        },
        notification:{
          title:`${data.item.name} - Role updated`,
          body:`You are now an ${data.Role}`
        }
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: 'high',
      },
  );
})
