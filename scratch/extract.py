import sys
from bs4 import BeautifulSoup

def extract_data():
    with open(r"C:\Users\Mediacell\.gemini\antigravity-ide\brain\e6e90666-ee9f-4a65-ac7a-3ec600c66cfa\.system_generated\steps\1491\content.md", "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')
    
    # Let's just find all the text and links to see the structure
    institutions = []
    for a in soup.find_all('a'):
        text = a.get_text(strip=True)
        href = a.get('href', '')
        if text and href and ('rv' in text.lower() or 'college' in text.lower() or 'institute' in text.lower() or 'school' in text.lower() or 'university' in text.lower()):
            if text not in institutions:
                institutions.append(text)
                print(f"Inst: {text} - Link: {href}")

if __name__ == "__main__":
    extract_data()
