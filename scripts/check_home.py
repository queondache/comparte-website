#!/usr/bin/env python3
"""Oracolo della home IT: controlla struttura, contenuti e metadati richiesti dalla spec."""
import json
import re
import sys
from html.parser import HTMLParser

PATH = sys.argv[1] if len(sys.argv) > 1 else "index.html"
SECTION_ORDER = [
    "hero", "perche-educazione", "chi-siamo", "progetti", "impatto",
    "cinque-x-mille", "dona", "galleria", "partner", "press", "faq", "newsletter",
]


class Collector(HTMLParser):
    """Raccoglie section, img, script JSON-LD e testo visibile."""

    def __init__(self):
        super().__init__()
        self.sections, self.imgs, self.jsonld, self.text = [], [], [], []
        self.links, self.elements = [], []
        self._in_jsonld = False
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        self.elements.append((tag, attrs_dict))
        if tag == "section" and "id" in attrs_dict:
            self.sections.append(attrs_dict["id"])
        if tag == "img":
            self.imgs.append(attrs_dict)
        if tag == "a":
            self.links.append(attrs_dict)
        if tag == "script" and attrs_dict.get("type") == "application/ld+json":
            self._in_jsonld = True
            self.jsonld.append("")
        elif tag in ("script", "style"):
            self._skip += 1

    def handle_endtag(self, tag):
        if tag == "script" and self._in_jsonld:
            self._in_jsonld = False
        elif tag in ("script", "style") and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if self._in_jsonld:
            self.jsonld[-1] += data
        elif not self._skip:
            self.text.append(data)


html = open(PATH, encoding="utf-8").read()
collector = Collector()
collector.feed(html)
text = " ".join(" ".join(collector.text).split())
results = []


def check(name, ok):
    results.append((name, bool(ok)))


def has_el(tag, **attrs):
    return any(
        element_tag == tag and all(element_attrs.get(key) == value for key, value in attrs.items())
        for element_tag, element_attrs in collector.elements
    )


check("ordine sezioni", collector.sections == SECTION_ORDER)
check("direttivo dentro chi-siamo (niente section propria)", "direttivo" not in collector.sections)
check("font Plus Jakarta Sans caricato", "family=Plus+Jakarta+Sans:wght@400;500;700" in html)
check("Fraunces/Instrument rimossi", "Fraunces" not in html and "Instrument+Sans" not in html)
html_without_social_handle = re.sub(r"comparteonlus", "", html, flags=re.I)
check("nessuna 'ONLUS' nel file", not re.search(r"onlus", html_without_social_handle, re.I))
check("segnaposto denominazione presente", "{{DENOMINAZIONE}}" in html)
check("niente gergo ONG", not re.search(r"\b(beneficiari|empowerment|sinergi)", text, re.I))
check("link elbloqueo.it", any(link.get("href", "").startswith("https://elbloqueo.it") for link in collector.links))
check("El Bloqueo come progetto sostenuto", re.search(r"progett\w* che sosteniamo", text, re.I))
check("El Bloqueo non 'nostro progetto'", not re.search(r"(nostro progetto|progetto di comparte)[^.]{0,40}bloqueo", text, re.I))
check("CF presente come testo", "97977810585" in text)
check("IBAN presente come testo", "IT27J0501803200000016738783" in text)
check("bottone copia CF", has_el("button", **{"data-copy": "97977810585"}))
check("bottone copia IBAN", has_el("button", **{"data-copy": "IT27J0501803200000016738783"}))
check("bottone carta in attesa Mollie", has_el("button", **{"data-mollie-link": ""}))
check("form newsletter in attesa Mailchimp", has_el("form", **{"data-mailchimp-action": ""}))
check("campo email con label", has_el("input", type="email", id="nl-email") and has_el("label", **{"for": "nl-email"}))
check("consenso privacy obbligatorio", any(
    tag == "input" and attrs.get("id") == "nl-consent" and "required" in attrs
    for tag, attrs in collector.elements
))
education = re.search(r'<section id="perche-educazione".*?</section>', html, re.S)
check("educazione: >=2 fonti esterne", education and len(re.findall(r'href="https?://', education.group(0))) >= 2)
check("img con width e height", all("width" in image and "height" in image for image in collector.imgs if image.get("src")))
check("nessuna emoji bandiera/check strutturale", not re.search("[\U0001F1E6-\U0001F1FF]|✓", html))
check("reduced-motion nel CSS", "prefers-reduced-motion" in open("assets/css/style.css", encoding="utf-8").read())
parsed = []
for block in collector.jsonld:
    try:
        parsed.append(json.loads(block))
    except json.JSONDecodeError:
        parsed.append(None)
check("JSON-LD tutti parse OK", collector.jsonld and None not in parsed)


def walk(node):
    """Restituisce tutti i dict annidati in un blocco JSON-LD."""
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk(value)
    elif isinstance(node, list):
        for value in node:
            yield from walk(value)


check("JSON-LD senza Project El Bloqueo", not any(
    item.get("@type") == "Project" and "bloqueo" in json.dumps(item).lower()
    for parsed_block in parsed for item in walk(parsed_block)
))
check("section bilanciate", len(re.findall(r"<section\b", html, re.I)) == len(re.findall(r"</section\s*>", html, re.I)))

failed = 0
for name, ok in results:
    print(("PASS " if ok else "FAIL ") + name)
    failed += not ok
print(f"\n{len(results) - failed}/{len(results)} check passati")
sys.exit(1 if failed else 0)
