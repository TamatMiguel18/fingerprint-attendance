const crypto = require("crypto");

const processFingerprint = (rawFingerprint) => {
    if (!rawFingerprint) {
        throw new Error("Fingerprint data is required");
    }

    // Simulamos limpieza de datos (normalización)
    const normalized = rawFingerprint.trim().toLowerCase();

    return normalized;
};

const generateTemplate = (processedFingerprint) => {
    // Generamos un hash como template (simulación)
    return crypto
        .createHash("sha256")
        .update(processedFingerprint)
        .digest("hex");
};

module.exports = {
    processFingerprint,
    generateTemplate
};