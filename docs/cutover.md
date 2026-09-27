# Passaggio al sito nuovo

1. Andrea approva l'anteprima (screenshot e `npm run preview`) e la PR `sito-nuovo`.
2. Cambio impostazione Pages da "branch" a "GitHub Actions":
   gh api -X POST repos/queondache/comparte-website/pages -f build_type=workflow   # se non esiste
   gh api -X PUT  repos/queondache/comparte-website/pages -f build_type=workflow   # se esiste (oggi: legacy, main /)
3. Merge della PR su main → parte "Deploy".
4. Attendi il completamento del workflow Deploy:
   gh run watch $(gh run list --workflow=deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
   Conferma che il run è riuscito.
5. Verifica live: curl -sI https://www.comparte.it/ /es/ /en/ /cuba/ /dona/ /trasparenza/ /en/transparency/ /es/transparencia/ → 200.
6. Ritorno indietro, se serve:
   (a) git revert -m 1 <merge-sha> e push verso main
   (b) Conferma che il commit di revert è su main e i file originali (index.html) sono tornati alla root
   (c) Solo allora: gh api -X PUT repos/queondache/comparte-website/pages -f build_type=legacy -f 'source[branch]=main' -f 'source[path]=/'
   (d) Attendi il completamento del run "pages build and deployment", poi curl gli URL live.
   
   ⚠️ NOTA: Cambiare a legacy PRIMA del revert servirebbe un sito senza index.html alla root.
