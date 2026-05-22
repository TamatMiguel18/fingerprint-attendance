const matchFingerprints = (storedTemplate, incomingTemplate) => {
    if (!storedTemplate || !incomingTemplate) {
        throw new Error("Templates are required for comparison");
    }

    // Comparación directa (simulada)
    return storedTemplate === incomingTemplate;
};

module.exports = {
    matchFingerprints
};