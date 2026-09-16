from pathlib import Path

path = Path("main.py")
text = path.read_text(encoding="utf-8")

old = '''        "priorityCases": top_tenders,
        "recentTenders": top_tenders[:5],
        "signalDistribution": signal_distribution
    }'''

new = '''        "priorityCases": top_tenders,
        "recentTenders": recent_tenders,
        "signalDistribution": signal_distribution
    }'''

if old not in text:
    print("OLD BLOCK NOT FOUND")
else:
    text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")
    print("DONE")
