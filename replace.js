const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/user/上課測試/project/frontend/src/pages';
const files = fs.readdirSync(dir);
files.forEach(file => {
    if(file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}$1`');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log('Updated ' + file);
        }
    }
});
