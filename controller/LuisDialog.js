var builder = require('botbuilder');
var food = require("./FavouriteFoods");

exports.startDialog = function(bot) {
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8413459-4ba3-4dbf-b41f-f98e34159da4?subscription-key=d1c174e41a47422aa30e74c7f2429503&verbose=true&timezoneOffset=0&q='); +

    bot.recognizer(recognizer);

    bot.dialog('WantFood', function(session, args) {
        if (!isAttachment(session)) {
            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Food');

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
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Food');

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
        function(session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            }
        },
        function(session, results, next) {

            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("Retrieving your favourite foods");
            food.displayFavouriteFood(session, session.conversationData["username"]); // <---- THIS LINE HERE IS WHAT WE NEED 
        }
    ]).triggerAction({
        matches: 'GetFavouriteFood'
    });

    bot.dialog('LookForFavourite', function(session, args) {
        if (!isAttachment(session)) {
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Food');

            if (foodEntity) {
                session.send('Finding %s', foodEntity.entity);
            } else {
                session.send("No food identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'LookForFavourite'
    });


    bot.dialog('WelcomeIntent', function(session, args) {
        session.send("Hi there. Welcome to the Food Bot");
        session.send("What would you like to do today?");
    }).triggerAction({
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