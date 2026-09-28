"""Build the public candidate site for GitHub Pages into ../docs.

The Claude artifact wraps assessment.html in a document skeleton at publish
time; a plain web host needs a complete document, so this adds one. Only
public files are copied: the answer key (private/key.js) never goes into docs/.
"""
from pathlib import Path
import shutil

here = Path(__file__).resolve().parent
out = here.parent / "docs"
out.mkdir(exist_ok=True)

page = (here / "assessment.html").read_text(encoding="utf-8")
doc = (
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<meta name="robots" content="noindex">\n'
    "</head>\n<body>\n" + page + "\n</body>\n</html>\n"
)
(out / "index.html").write_text(doc, encoding="utf-8")
shutil.copyfile(here / "exercises.js", out / "exercises.js")
(out / ".nojekyll").write_text("", encoding="utf-8")
print("Built", out)
