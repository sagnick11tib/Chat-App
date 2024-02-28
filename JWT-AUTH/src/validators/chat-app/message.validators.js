const { body } = require("express-validator");

const sendMessageValidator = () => {
    return [ // this return .withMessage() method from express-validator 
        body("content")
        .trim()
        .optional() // .optional() method is used to make the field optional which field ?  content
        .notEmpty() // if content is empty
        .withMessage("Content is required ") // if content is empty
    ];
}; 

module.exports = { sendMessageValidator };





