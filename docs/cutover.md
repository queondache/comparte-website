# Passaggio al sito nuovo

1. Andrea approva l'anteprima (screenshot e `npm run preview`) e la PR `sito-nuovo`.
2. Cambio impostazione Pages da "branch" a "GitHub Actions":
   gh api -X POST repos/queondache/comparte-website/pages -f build_type=workflow   # se non esiste
   gh api -X PUT  repos/queondache/comparte-website/pages -f build_type=workflow   # se esiste (oggi: legacy, main /)
3. Merge della PR su main → parte "Deploy".
4. Verifica live: curl -sI https://www.comparte.it/ /es/ /en/ /cuba/ /dona/ /trasparenza/ /en/transparency/ /es/transparencia/ → 200.
5. Ritorno indietro, se serve: gh api -X PUT repos/queondache/comparte-website/pages -f build_type=legacy -f 'source[branch]=main' -f 'source[path]=/' e revert del merge.
