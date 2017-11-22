var builder = require('botbuilder');


exports.startDialog = function(bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/{YOUR_APP_ID_HERE}?subscription-key={YOUR_KEY_HERE}&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('WantFood', function(session, args) {
        if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the food entity was found
            if (foodEntity) {
                session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                // Insert logic here later
            } else {
                session.send("No food identified! Please try again");
            }
        }

    }).triggerAction({
        matches: 'WantFood'
    });

    bot.dialog('DeleteFavourite', [
        // Insert delete logic here later
    ]).triggerAction({
        matches: 'DeleteFavourite'

    });

    bot.dialog('GetCalories', function(session, args) {
        if (!isAttachment(session)) {

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Calculating calories in %s...', foodEntity.entity);
                // Insert logic here later

            } else {
                session.send("No food identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'GetCalories'
    });

    bot.dialog('GetFavouriteFood', [
        // Insert favourite food logic here later
    ]).triggerAction({
        matches: 'GetFavouriteFood'
    });

    bot.dialog('LookForFavourite', [
        // Insert logic here later
    ]).triggerAction({
        matches: 'LookForFavourite'
    });


    bot.dialog('WelcomeIntent', [
        // Insert logic here later
    ]).triggerAction({
        matches: 'WelcomeIntent'
    });
}

// Function is called when the user inputs an attachment
function isAttachment(session) {
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {

        //call custom vision here later
        return true;
    } else {
        return false;
    }
}