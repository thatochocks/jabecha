export let SHOW_VEHICLES_WITHIN = 20;
export let POSITION_INTERVAL = 10 * 1000;
export let VEHICLE_LAST_ACTIVE_LIMIT = 2 * 60 * 1000; // 2 mins

export let DEAL_STATUS_PENDING = 'pending';
export let DEAL_STATUS_ACCEPTED = 'accepted';
export let TRIP_STATUS_GOING = 'going';
export let TRIP_STATUS_FINISHED = 'finished';
export let TRIP_STATUS_CANCELED = 'canceled';
export let TRIP_STATUS_WAITING = 'waiting';
export let DEAL_TIMEOUT = 20 * 1000; // 20s

export let ENABLE_SIGNUP = true;
export let SOS = "100";
export let DEFAULT_AVATAR = "http://placehold.it/150x150";

export const environment = {
  production: true,
  appName: 'JB',
  firebase: {
    apiKey: "AIzaSyD7-Z4nObBjmOwPJYGSuf-IoxNaFf1Rfho",
    authDomain: "jabechaapp.firebaseapp.com",
    databaseURL: "https://jabechaapp.firebaseio.com",
    projectId: "jabechaapp",
    storageBucket: "jabechaapp.appspot.com",
    messagingSenderId: "1054328176846",
    appId: '1:1054328176846:web:e92d282bf1f76ea991909f',
    measurementId: 'G-FHTSTC4N0J'
  },
  langArr: [
    { name: 'English', code: 'en' },
    { name: 'española', code: 'es' },
    { name: 'عربى', code: 'ar' },
    { name: '中文', code: 'cn' }
  ], mapOptions: {
    zoom: 17,
    mapTypeControl: false,
    zoomControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  },
  onesignal: {
    appId: '',
    googleProjectNumber: '',
    restKey: ''
  },
  stripe: {
    sk: ''
  },
  paypal: {
    sandbox: '',
    production: 'YOUR_PRODUCTION_CLIENT_ID'
  },
  general: {
    symbol: '$',
    code: 'USD'
  },
};
