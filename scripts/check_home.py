#!/usr/bin/env python3
"""Oracolo della home: controlla struttura, contenuti e metadati per lingua."""
import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

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
        self.forms = []
        self._form = None
        self._in_jsonld = False
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        self.elements.append((tag, attrs_dict))
        if tag == "form":
            self._form = {"attrs": attrs_dict, "elements": []}
            self.forms.append(self._form)
        elif self._form is not None:
            self._form["elements"].append((tag, attrs_dict))
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
        if tag == "form":
            self._form = None
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
check("link carta Mollie", any(
    link.get("href", "").startswith("https://payment-links.mollie.com/")
    and "noopener" in link.get("rel", "").split()
    and link.get("target") == "_blank"
    and "btn-primary" in link.get("class", "").split()
    for link in collector.links
))
thanks_paths = {"it": "grazie/index.html", "es": "es/gracias/index.html", "en": "en/thank-you/index.html"}
thanks_path = Path(thanks_paths[args.lang])
check("pagina grazie presente", thanks_path.is_file())
thanks = Collector()
if thanks_path.is_file():
    thanks.feed(thanks_path.read_text(encoding="utf-8"))
check("pagina grazie noindex e lingua corretta", any(
    tag == "meta" and attrs.get("name") == "robots"
    and "noindex" in attrs.get("content", "").split(",")
    for tag, attrs in thanks.elements
) and any(tag == "html" and attrs.get("lang") == args.lang for tag, attrs in thanks.elements))
check("pagina grazie canonical e hreflang reciproci", all(
    any(tag == "link" and attrs.get("rel") == "alternate"
        and attrs.get("hreflang") == lang
        and attrs.get("href") == "https://www.comparte.it/" + path.removesuffix("index.html")
        for tag, attrs in thanks.elements)
    for lang, path in {**thanks_paths, "x-default": thanks_paths["it"]}.items()
) and any(tag == "link" and attrs.get("rel") == "canonical"
          and attrs.get("href") == "https://www.comparte.it/" + thanks_paths[args.lang].removesuffix("index.html")
          for tag, attrs in thanks.elements))
newsletter_paths = {"it": "newsletter/index.html", "es": "es/newsletter/index.html", "en": "en/newsletter/index.html"}
newsletter_path = Path(newsletter_paths[args.lang])
newsletter = Collector()
newsletter_html = newsletter_path.read_text(encoding="utf-8") if newsletter_path.is_file() else ""
newsletter.feed(newsletter_html)
newsletter_forms = [form for form in newsletter.forms if "nl-form" in form["attrs"].get("class", "").split()]


def infomaniak_connected(form):
    attrs, elements = form["attrs"], form["elements"]
    form_id = {"it": "26059", "es": "26060", "en": "26062"}[args.lang]
    return (
        attrs.get("action") == f"https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/{form_id}/submit"
        and attrs.get("method", "").lower() == "post"
        and attrs.get("target") == "_self"
        and "novalidate" not in attrs
        and not any(tag == "fieldset" and "disabled" in a for tag, a in elements)
        and any(tag in ("button", "input") and a.get("type") == "submit" and "disabled" not in a for tag, a in elements)
        and any(tag == "input" and a.get("name") == "inf[1]" and a.get("type") == "email"
                and "required" in a and "disabled" not in a for tag, a in elements)
        and any(tag == "input" and a.get("id") == "nl-consent" and a.get("type") == "checkbox"
                and "required" in a and "checked" not in a and "disabled" not in a for tag, a in elements)
        and all(any(tag == "input" and a.get("name") == name and a.get("type") == "text"
                    and a.get("aria-hidden") == "true" and a.get("tabindex") == "-1"
                    and ("display:none" in a.get("style", "") or "left:-9999px" in a.get("style", ""))
                    and "disabled" not in a for tag, a in elements) for name in ("inf_email_check", "website"))
        and any(tag == "input" and a.get("name") == "webform_id" and a.get("value") == form_id for tag, a in elements)
        and any(tag == "input" and a.get("name") == "key" and len(a.get("value", "")) > 100 for tag, a in elements)
        and any(tag == "altcha-widget" and a.get("challengeurl") == "https://newsletter.infomaniak.com/v3/altcha-challenge" for tag, a in elements)
    )


check("form Infomaniak collegato", len(newsletter_forms) == 1 and infomaniak_connected(newsletter_forms[0])
      and any(link.get("href") == "/" + newsletter_paths[args.lang].removesuffix("index.html")
              and "data-newsletter-link" in link for link in collector.links))
check("newsletter: nessuno script esterno al caricamento", bool(newsletter_html) and all(
    not a.get("src", "").startswith(("https:", "http:", "//"))
    for tag, a in collector.elements + newsletter.elements if tag == "script"
))
check("newsletter: antispam solo dopo attivazione", all(
    any(tag == "script" and a.get("type") == "application/json"
        and urlsplit(a.get("data-newsletter-script", "")).path == path
        and urlsplit(a.get("data-newsletter-script", "")).netloc == "newsletter.infomaniak.com"
        and "src" not in a for tag, a in newsletter.elements)
    for path in ("/v3/static/mcaptcha/altcha.min.js", "/v3/static/mcaptcha/altcha-index.js", "/v3/static/webform_index.js")
) and any(tag == "button" and a.get("id") == "nl-load" and a.get("type") == "button" for tag, a in newsletter.elements)
  and any(tag == "script" and a.get("src") == "/assets/js/newsletter.js" for tag, a in newsletter.elements)
  and not any(tag == "iframe" for tag, _ in newsletter.elements))
check("newsletter: lingua corretta", any(tag == "html" and a.get("lang") == args.lang for tag, a in newsletter.elements))
privacy_paths = {"it": "/trasparenza/#privacy", "es": "/es/transparencia/#privacidad", "en": "/en/transparency/#privacy"}
privacy_href = privacy_paths[args.lang]
privacy_url = urlsplit(privacy_href)
privacy_path = Path(privacy_url.path.lstrip("/")) / "index.html"
privacy_page = Collector()
if privacy_path.is_file():
    privacy_page.feed(privacy_path.read_text(encoding="utf-8"))
check("ancora privacy esistente", any(
    tag == "a" and attrs.get("href") == privacy_href
    for form in newsletter_forms for tag, attrs in form["elements"]
) and any(attrs.get("id") == privacy_url.fragment for _, attrs in privacy_page.elements)
  and any(tag == "html" and attrs.get("lang") == args.lang for tag, attrs in privacy_page.elements))
check("campo email con label", any(tag == "input" and a.get("type") == "email" and a.get("id") == "nl-email" for tag, a in newsletter.elements)
      and any(tag == "label" and a.get("for") == "nl-email" for tag, a in newsletter.elements))
check("consenso privacy obbligatorio", any(
    tag == "input" and attrs.get("id") == "nl-consent" and "required" in attrs
    for tag, attrs in newsletter.elements
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
