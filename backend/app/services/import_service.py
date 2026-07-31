from pathlib import Path
import markdown
from bs4 import BeautifulSoup
from fastapi import HTTPException, UploadFile

MAX_FILE_SIZE = 2 * 1024 * 1024
def html_to_tiptap(html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    nodes = []
    for element in soup.find_all(recursive=False):
        kind = "heading" if element.name in {"h1", "h2", "h3"} else "paragraph"
        node = {"type": kind, "content": [{"type": "text", "text": element.get_text(" ")}]}
        if kind == "heading":
            node["attrs"] = {"level": int(element.name[1])}
        nodes.append(node)
    return {"type": "doc", "content": nodes or [{"type": "paragraph"}]}
async def parse_upload(file: UploadFile) -> tuple[str, dict]:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".txt", ".md"}:
        raise HTTPException(415, "Only .txt and .md files are supported")
    raw = await file.read(MAX_FILE_SIZE + 1)
    if len(raw) > MAX_FILE_SIZE:
        raise HTTPException(413, "File exceeds the 2 MB limit")
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(400, "File must contain valid UTF-8 text")
    if not text.strip() or "\x00" in text:
        raise HTTPException(400, "File is empty or contains invalid text")
    title = Path(file.filename or "Imported document").stem[:150].strip() or "Imported document"
    if suffix == ".md":
        return title, html_to_tiptap(markdown.markdown(text, extensions=["extra"]))
    paragraphs = [{"type": "paragraph", "content": [{"type": "text", "text": line}]} for line in text.splitlines() if line.strip()]
    return title, {"type": "doc", "content": paragraphs}
