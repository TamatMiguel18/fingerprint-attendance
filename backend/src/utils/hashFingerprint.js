const crypto = require("crypto");

const hashFingerprint = (data) => {
    return crypto.createHash("sha256").update(data).digest("hex");
};

module.exports = { hashFingerprint };