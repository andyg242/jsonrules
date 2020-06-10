'use strict';

const Engine = require('json-rules-engine').Engine;

const engine = new Engine();

module.exports.endpoint = (event, context, callback) => {
  engine.addRule({
    conditions: {
      any: [{
        all: [{
          fact: 'gameDuration',
          operator: 'equal',
          value: 40
        }, {
          fact: 'personalFoulCount',
          operator: 'greaterThanInclusive',
          value: 5
        }]
      }, {
        all: [{
          fact: 'gameDuration',
          operator: 'equal',
          value: 48
        }, {
          fact: 'personalFoulCount',
          operator: 'greaterThanInclusive',
          value: 6
        }]
      }]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
      type: 'fouledOut',
      params: {
        message: 'Player has fouled out!'
      }
    }
  });
  /**
  * Define facts the engine will use to evaluate the conditions above.
  * Facts may also be loaded asynchronously at runtime; see the advanced example below
  */
  let facts = {
    personalFoulCount: 6,
    gameDuration: 40
  }
  let return_output = 'before rules';
  // Run the engine to evaluate
  engine
    .run(facts)
    .then(results => {
      // 'results' is an object containing successful events, and an Almanac instance containing facts
      results.events.map(event => {
          //console.log(event.params.message)
          const response = {
            statusCode: 200,
            body: JSON.stringify({
              message: `Hello, the current time is ${event.params.message}.`,
            }),
          };
        
          callback(null, response);
        }
      )
    })

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: `Hello, the current time is ${return_output}.`,
  //   }),
  // };

  // callback(null, response);
};
