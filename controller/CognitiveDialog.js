var request = require('request'); //node module for http post requests

exports.retreiveMessage = function(session) {

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/8cfd040e-9441-4e91-9b2a-4642bd73c0f4/url?iterationId=b9dda8cd-cf0c-46e1-a443-a709f06811a0',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'fccf9a9570824165a73e1ae985ea3a3f'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body) {
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body) {
    if (body && body.Predictions && body.Predictions[0].Tag) {
        return "This is " + body.Predictions[0].Tag
    } else {
        console.log('Oops, please try again!');
    }
}