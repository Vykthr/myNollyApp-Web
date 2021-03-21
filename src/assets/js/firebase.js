var app_fireBase = {};
(function(){
  var firebaseConfig = {
    apiKey: "AIzaSyAxnvBRSsx5bW1IVf5YTWgR0cb7bUkg7vw",
    authDomain: "mynollyapp-39d23.firebaseapp.com",
    databaseURL: "https://mynollyapp-39d23.firebaseio.com",
    projectId: "mynollyapp-39d23",
    storageBucket: "mynollyapp-39d23.appspot.com",
    messagingSenderId: "204569611961",
    appId: "1:204569611961:web:cadebe4ab0778cb84d1568",
    measurementId: "G-G3KBSG41XM"
  };
  
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  app_fireBase = firebase;
})()
