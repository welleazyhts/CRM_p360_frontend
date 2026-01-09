const fs = require('fs');
try {
    const content = fs.readFileSync('src/i18n/locales/hi/common.json', 'utf8');
    JSON.parse(content);
    console.log('JSON is valid');
} catch (e) {
    console.log('JSON is invalid:', e.message);
}
