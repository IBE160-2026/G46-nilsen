Samtalestøtte – blind A/B-test mellom GPT-5.6 Luna og GPT-5.6 Terra

1. Kopier test-model-compare.js inn i prosjektmappen:
   C:\Users\cenil\Documents\Samtalestotte-git

2. Sørg for at serveren IKKE allerede kjører i andre testvinduer på testportene.

3. Kjør standardtesten med 5 krevende caser:
   node test-model-compare.js

4. Resultatene lagres i mappen test-results:
   - modelltest-blind-....md  = les denne først
   - modelltest-fasit-....md  = IKKE åpne før du har valgt A/B
   - modelltest-data-....json = rådata

5. Hvis du senere vil kjøre 10 caser:
   node test-model-compare.js --all

Standardtesten gir normalt 20 API-kall:
5 caser × 2 modeller × (analyse + råd).
