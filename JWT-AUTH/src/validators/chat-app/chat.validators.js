const { body } = require('express-validator');

const createAGroupChatValidator = () => {
    return [
        body("name").trim().notEmpty().withMessage("Group name is required"),
        body("participants")
        .isArray({ //.isArray() method is used to check if the value is an array in this case participants
            min: 2, //{.isArray()} method takes an object as an argument and we can specify the minimum and maximum length of the array
            max: 100,
        })
        .withMessage("Participants must be an array with more than 2 members and less than 100 members")
    ];
};

const updateGroupChatValidator = () => {
    return [
        body("name").trim().notEmpty().withMessage("Group name is required"),
    ];
};

module.exports = { createAGroupChatValidator , updateGroupChatValidator };


