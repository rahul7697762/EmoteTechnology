const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('c:/Users/surya/Desktop/EmoteTechnology/client/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/\bflex-grow\b/g, 'grow')
        .replace(/\bflex-shrink-0\b/g, 'shrink-0')
        .replace(/\bbg-gradient-to-r\b/g, 'bg-linear-to-r')
        .replace(/\bbg-gradient-to-br\b/g, 'bg-linear-to-br')
        .replace(/\b!bg-white\b/g, 'bg-white!')
        .replace(/\bdark:!bg-gray-800\b/g, 'dark:bg-gray-800!');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
});
