const validationResult = require('express-validator').validationResult;
const ApiError = require('../utils/ApiError.js');
const errorHandler  = require('../middlewares/error-handler.middlewares.js');

const validate = (req,res,next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
        return next();
    }

    const extractedErrors = []; // we are creating an empty array

    errors.array().map((err) => extractedErrors.push({[err.path]: err.msg}));

    throw new ApiError(422,"Received data is not valid",extractedErrors);

}

module.exports = validate;