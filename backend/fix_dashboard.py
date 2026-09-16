from pathlib import Path

path = Path("main.py")
text = path.read_text(encoding="utf-8")

text = text.replace(
    '"recentTenders": recent_tenders,',
    '"recentTenders": top_tenders[:5],'
)

path.write_text(text, encoding="utf-8")

print("FIXED")
