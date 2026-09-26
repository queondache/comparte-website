#!/usr/bin/env python3
"""Oracolo della home: controlla struttura, contenuti e metadati per lingua."""
import argparse
import json
import re
import sys
from html.parser import HTMLParser

LANGS = {
    "it": {
        "path": "index.html",
        "section_order": ["hero", "perche-educazione", "chi-siamo", "progetti", "impatto", "cinque-x-mille", "dona", "galleria", "partner", "press", "faq", "newsletter"],
        "jargon": r"beneficiari|empowerment|sinergi",
        "supported_project": r"progett\w* che sosteniamo",
        "not_our_project": r"(nostro progetto|progetto di comparte)[^.]{0,40}bloqueo",
        "el_bloqueo_url": "https://elbloqueo.it",
        "education_id": "perche-educazione",
    },
    "es": {
        "path": "es/index.html",
        "section_order": ["hero", "por-que-educacion", "quienes-somos", "proyectos", "impacto", "dona", "galeria", "aliados", "prensa", "faq", "boletin"],
        "jargon": r"beneficiarios|empoderamiento|sinergia",
        "supported_project": r"proyectos? que apoyamos",
        "not_our_project": r"(nuestro proyecto|proyecto de comparte)[^.]{0,40}bloqueo",
        "el_bloqueo_url": "https://elbloqueo.it/es/",
        "education_id": "por-que-educacion",
        "donation_id": "dona",
        "five_thousand_id": "cinco-x-mil",
    },
    "en": {
        "path": "en/index.html",
        "section_order": ["hero", "why-education", "about", "projects", "impact", "donate", "gallery", "partners", "press", "faq", "newsletter"],
        "jargon": r"beneficiaries|empower|synerg",
        "supported_project": r"projects? we support",
        "not_our_project": r"(our project|comparte's project)[^.]{0,40}bloqueo",
        "el_bloqueo_url": "https://elbloqueo.it/en/",
        "education_id": "why-education",
        "donation_id": "donate",
        "five_thousand_id": "five-x-thousand",
    },
}


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


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--lang", choices=LANGS, default="it", help="lingua della home (default: it)")
parser.add_argument("path", nargs="?", help="percorso HTML alternativo")
args = parser.parse_args()
config = LANGS[args.lang]
html = open(args.path or config["path"], encoding="utf-8").read()
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


check("html lang corretto", has_el("html", lang=args.lang))
check("ordine sezioni", collector.sections == config["section_order"])
check("direttivo dentro chi-siamo (niente section propria)", "direttivo" not in collector.sections)
check("font Plus Jakarta Sans caricato", "family=Plus+Jakarta+Sans:wght@400;500;700" in html)
check("Fraunces/Instrument rimossi", "Fraunces" not in html and "Instrument+Sans" not in html)
html_without_social_handle = re.sub(r"comparteonlus", "", html, flags=re.I)
check("nessuna 'ONLUS' nel file", not re.search(r"onlus", html_without_social_handle, re.I))
check("nessun segnaposto denominazione", "{{" not in html)
check("niente gergo ONG", not re.search(rf"\b({config['jargon']})", text, re.I))
check("link elbloqueo.it", any(link.get("href", "").startswith(config["el_bloqueo_url"]) for link in collector.links))
check("El Bloqueo come progetto sostenuto", re.search(config["supported_project"], text, re.I))
check("El Bloqueo non 'nostro progetto'", not re.search(config["not_our_project"], text, re.I))
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
education = re.search(rf'<section id="{re.escape(config["education_id"])}".*?</section>', html, re.S)
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
ids = [attrs["id"] for _, attrs in collector.elements if "id" in attrs]
check("id univoci", len(ids) == len(set(ids)))
check("un solo box sosteniamo", sum(
    tag == "aside" and "supported" in attrs.get("class", "").split()
    for tag, attrs in collector.elements
) == 1)

if args.lang in ("es", "en"):
    hero = re.search(r'<section id="hero".*?</section>', html, re.S)
    primary_href = f'#{config["donation_id"]}'
    check("CTA primaria hero verso donazione", hero and re.search(
        rf'<a\b(?=[^>]*\bhref="{re.escape(primary_href)}")(?=[^>]*\bclass="[^"]*\bbtn-primary\b)[^>]*>',
        hero.group(0),
    ))
    check("link al 5×1000 italiano", any(
        link.get("href") == "https://www.comparte.it/#cinque-x-mille" for link in collector.links
    ))
    check("box 5×1000 presente", any(
        attrs.get("id") == config["five_thousand_id"] for _, attrs in collector.elements
    ))

failed = 0
for name, ok in results:
    print(("PASS " if ok else "FAIL ") + name)
    failed += not ok
print(f"\n{len(results) - failed}/{len(results)} check passati")
sys.exit(1 if failed else 0)
