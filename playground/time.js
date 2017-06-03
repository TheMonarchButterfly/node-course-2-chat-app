var moment = require('moment');


// Jan 1st 1970 00:00:00 am
// units are in milliseconds

// var date = new Date();
// var months = ['Jan', 'Feb'];
// console.log(date.getMonth());

// new Date().getTime()
var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt);
// date.add(1, 'year').subtract(9, 'months');
// console.log(date.format('Do MMM, YYYY'));

console.log(date.format('lll'));

console.log(date.format('h:mm a'))
