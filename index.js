const express = require('express');
const app = express();
const webpush = require('web-push');
const cors = require('cors');

const vapidKeys = {
    "publicKey":"BD25VIEh-70Er4eyXgi_XgqlOK9ExYd7-MNocVn4ZWVFRSl5koKERdnDlVOCuQ0C4TtcmCODwDzbagRchdgY9U4",
    "privateKey":"aIsPq0IgE3jApdl_dGIGUdbAEox7CBWx-RDoQPR_YFs"
}

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const notificationPayload = {
    "notification": {
        "title": "Angular News",
        "body": "Newsletter Available!",
        "icon": "assets/main-page-logo-small-hat.png",
        "vibrate": [100, 50, 100],
        "data": {
            "dateOfArrival": Date.now(),
            "primaryKey": 1
        },
        "actions": [{
            "action": "explore",
            "title": "Go to the site"
        }]
    },
    "keys": {
        p256dh: vapidKeys.publicKey,
        auth: vapidKeys.privateKey
    }
};

app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({extended:false, limit: 10000000}));

// , options: PushSubscriptionOptions
const sub = {
    endpoint: "https://fcm.googleapis.com/fcm/send/ewUFJfLgyFI:AP…3tfAe8gCxARpm4rlZWMZxzrDpNOSwCLoMeo_N2iCa1OwvZqxE",
    expirationTime: null, options: {
        keys: {
            p256dh: vapidKeys.publicKey,
            auth: vapidKeys.privateKey
        }
        // applicationServerKey: ArrayBuffer(65),
        // userVisibleOnly: true
    }
}

app.post('/', (req, res) => {
    const {data} = req.body;
    webpush.sendNotification(data, JSON.stringify(notificationPayload))
        .then(() => console.log('todo bien al mandar notificacion'))
        .catch(err => console.error("Error sending notification, reason: ", err));
    return res.json({});
});


app.listen(app.get('port'), () => console.log(`server on port: ${app.get('port')}`));
