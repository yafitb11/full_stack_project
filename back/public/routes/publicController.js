const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/project_description.docx", (req, res, next) => {
    const filePath = path.join(__dirname, "../../public", "project_description.docx");

    res.download(filePath, "project_description.docx", (err) => {
        if (err) {
            next(err);
        }
    });
});

module.exports = router;