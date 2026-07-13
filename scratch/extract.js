const fs = require('fs');

const html = fs.readFileSync(String.raw`C:\Users\Mediacell\.gemini\antigravity-ide\brain\e6e90666-ee9f-4a65-ac7a-3ec600c66cfa\.system_generated\steps\1491\content.md`, 'utf8');

// Regex to find <a> tags and extract href and text
const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>(.*?)<\/a>/gi;
let match;
const institutions = [];

while ((match = regex.exec(html)) !== null) {
    const href = match[2];
    const rawText = match[3].replace(/<[^>]+>/g, '').trim(); // Remove inner HTML tags
    if (rawText && (rawText.toLowerCase().includes('rv') || rawText.toLowerCase().includes('college') || rawText.toLowerCase().includes('institute') || rawText.toLowerCase().includes('school') || rawText.toLowerCase().includes('university'))) {
        if (!institutions.find(i => i.text === rawText)) {
            institutions.push({ text: rawText, link: href });
            console.log(`Inst: ${rawText} - Link: ${href}`);
        }
    }
}
