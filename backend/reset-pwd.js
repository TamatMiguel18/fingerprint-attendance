const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function updatePassword() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);
        console.log("New hash:", hash);
        await db.query("UPDATE users SET password = ? WHERE email = 'admin@example.com'", [hash]);
        console.log("Password updated successfully.");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

updatePassword();
