const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

async function runSchema() {
    try {
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log("Running schema...");
        await db.query(schema);
        console.log("Schema applied successfully.");
    } catch (err) {
        console.error("Error applying schema:", err);
    } finally {
        process.exit();
    }
}

runSchema();
