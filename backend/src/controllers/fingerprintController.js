const Fingerprint = require("../models/Fingerprint");
const Attendance = require("../models/Attendance");
const { hashFingerprint } = require("../utils/hashFingerprint");

const registerFingerprint = async (req, res) => {
    try {
        const { user_id, rawFingerprint } = req.body;

        const fingerprint_hash = hashFingerprint(rawFingerprint);

        await Fingerprint.saveFingerprint(user_id, fingerprint_hash);

        res.json({ message: "Fingerprint saved" });
    } catch (error) {
        res.status(500).json(error);
    }
};

const scanFingerprint = async (req, res) => {
    try {
        const { rawFingerprint } = req.body;

        const fingerprint_hash = hashFingerprint(rawFingerprint);

        const user = await Fingerprint.findUserByFingerprint(fingerprint_hash);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Attendance.createAttendance(user.id);

       const { password, ...safeUser } = user;

res.json({
    message: "Attendance recorded via fingerprint",
    user: safeUser
});
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    registerFingerprint,
    scanFingerprint
};