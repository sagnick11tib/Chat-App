const fs = require("fs");


const removeLocalFile = (localPath) => {
    fs.unlink(localPath, (err) => {
        if (err) console.log("Error while removing local file: ", err);
        else console.log("Local file removed successfully", localPath);

    });
}

module.exports = { removeLocalFile };