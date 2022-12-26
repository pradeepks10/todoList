
// making of our own module and use it in app.js


// simple way
// module.exports.getDate = getDate;

// function getDate(){
// var today = new Date();
// var options = {
//     weekday:"long",
//     day:"numeric",
//     month:"long"
// };

// var day = today.toLocaleDateString("en-Us",options);
// return day;

// }

// short cut ways

exports.getDate = function (){
const today = new Date();
const options = {
    weekday:"long",
    day:"numeric",
    month:"long"
};

return today.toLocaleDateString("en-Us",options);
}

exports.getDay =function (){
const today = new Date();
const options = {
    weekday:"long",
};

return today.toLocaleDateString("en-Us",options);

}