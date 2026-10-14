# ErektoMax — landing (PL)

Statyczna strona: HTML + CSS + JS, bez budowania.

## Struktura
- `index.html` — treść strony
- `css/styles.css` — style (kolory w `:root`)
- `js/config.js` — **tu edytujesz**: cena, dane produktu, webhook, ID piksela, opinie
- `js/docs.js` — teksty dokumentów prawnych (Regulamin, Polityka prywatności itd.)
- `js/main.js` — logika: formularz, maska telefonu, cookies + Meta Pixel, animacje
- `assets/` — zdjęcia (opakowanie, zdjęcia w bloku „Skład”)

## Deploy na Vercel
**Najprościej (CLI):** `npm i -g vercel`, w tej folderze `vercel`, potem `vercel --prod`.
**Przez GitHub:** wrzuć folder do repozytorium → vercel.com → Add New → Project →
Framework Preset: *Other*, Build Command i Output Directory zostaw puste → Deploy.
Własna domena: Project → Settings → Domains.

## Po wdrożeniu sprawdź
1. Wyślij testowe zgłoszenie — powinno pojawić się w Make (webhook).
2. W Meta Events Manager (Test Events) po akceptacji cookies widać `PageView`, po wysłaniu formularza `Lead`.
3. Uzupełnij/zweryfikuj z prawnikiem teksty w `js/docs.js`.
