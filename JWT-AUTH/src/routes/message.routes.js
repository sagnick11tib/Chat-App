const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/auth.middlewares.js");
const upload = require("../middlewares/multer.mmiddlewares.js");

const sendMessageValidator = require("../validators/chat-app/message.validators.js");
const mongoIdPathVariableValidator = require("../validators/common/mongodb.validators.js");
const validate = require("../validators/validate.js");

router.use(verifyJWT);

router.route("/:chatId")
.get(mongoIdPathVariableValidator("chatId"),validate , getAllMessages)
.post(upload.fields([{name: "attachments",maxCount: 5}]),mongoIdPathVariableValidator("chatId"),sendMessageValidator("chatId"),sendMessageValidator(),validate,sendMessage); 

module.exports = router;

