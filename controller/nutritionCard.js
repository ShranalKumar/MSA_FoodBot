var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls 'getNutritionData' in RestClient.js with 'getFoodNutrition' as callback to get ndbno of food
exports.displayNutritionCards = function getNutritionData(foodName, session) {
    var url = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + foodName + "&sort=r&max=1&offset=0&api_key=zecjLDVzMVM87plwC36CaVbjVOaD9oSjIA9aQk9J";

    rest.getNutritionData(url, session, foodName, getFoodNutrition);
}

//Parses JSON to get the ndbno. Calls 'getNutritionData' in RestClient.js with 'displayNutritionCards' as callback to get nutrition information
function getFoodNutrition(message, foodName, session) {
    var foodNutritionList = JSON.parse(message);
    var ndbno = foodNutritionList.list.item[0].ndbno;
    var url = "https://api.nal.usda.gov/ndb/reports/?ndbno=" + ndbno + "&type=f&format=json&api_key=zecjLDVzMVM87plwC36CaVbjVOaD9oSjIA9aQk9J";

    rest.getNutritionData(url, session, foodName, displayNutritionCards);
}

function displayNutritionCards(message, foodName, session) {
    //Parses JSON
    var foodNutrition = JSON.parse(message);

    //Adds first 5 nutrition information (i.e calories, energy) onto list
    var nutrition = foodNutrition.report.food.nutrients;
    var nutritionItems = [];
    for (var i = 0; i < 5; i++) {
        var nutritionItem = {};
        nutritionItem.title = nutrition[i].name;
        nutritionItem.value = nutrition[i].value + " " + nutrition[i].unit;
        nutritionItems.push(nutritionItem);
    }

    //Displays nutrition adaptive cards in chat box 
    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [{
                    "type": "Container",
                    "items": [{
                            "type": "TextBlock",
                            "text": foodName.charAt(0).toUpperCase() + foodName.slice(1),
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Nutritional Information"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [{
                        "type": "ColumnSet",
                        "columns": [{
                            "type": "Column",
                            "width": "auto",
                            "items": [{
                                "type": "FactSet",
                                "facts": nutritionItems
                            }]
                        }]
                    }]
                }
            ]
        }
    }));
}