# Notizen

Deutschsprachige, lokale Notizen-PWA mit acht festen Listen und eigenen editierbaren Notizen. React, TypeScript und Vite; keine Datenbank, kein Konto und keine externen Laufzeitdienste. Die Oberfläche orientiert sich an klassischen iOS-Notizen. Keine Apple-App und keine iCloud-Synchronisation.

## Entwicklung

Node.js 22 oder neuer und npm installieren. `npm ci`, dann `npm run dev`. Tests: `npm test`. Produktion: `npm run build`. Vorschau: `npm run preview`.

## Veröffentlichung

GitHub Pages veröffentlicht jeden Push auf `main` nach erfolgreichen Tests. Der Workflow setzt die Basis-URL auf `/notizen/`. Das Repository enthält ausschließlich App-Code und Startlisten; persönliche Notizen bleiben im Browser.

Linux-VPS: `npm ci && npm test && npm run build`, anschließend den Inhalt von `dist/` in das Webroot kopieren. Nginx oder Caddy mit gültigem HTTPS-Zertifikat verwenden. Beispiel Caddy: `notizen.example.com { root * /srv/notizen; file_server }` (Direktiven jeweils in eigener Zeile). `sw.js` und `index.html` mit `Cache-Control: no-cache` ausliefern; gehashte Assets dürfen langfristig gecacht werden. Keine serverseitige Anwendung nötig.

## iPhone

Die HTTPS-Adresse in Safari öffnen. Nach vollständigem Erstladen über Teilen → Zum Home-Bildschirm → Hinzufügen installieren. Danach das Symbol „Notizen“ öffnen. Die App startet in der Übersicht und besitzt im Standalone-Modus keine Safari-Adressleiste. Nach erstmaligem Caching funktioniert sie offline. Daten sind an Gerät und Browser gebunden; Löschen von Website-Daten entfernt eigene Notizen und Einstellungen. Wichtige eigene Notizen über Teilen oder Kopieren sichern.

## Bedienung

Notiz antippen. Über die Lupe oder „Mehr → In Notiz suchen“ suchen. Text mit der Suchen-Taste bestätigen; Pfeile wechseln zwischen Treffern. Über das Stiftsymbol eigene Notizen anlegen. Eigene Notizen lassen sich bearbeiten und im Mehr-Menü löschen. Änderungen werden sofort lokal gespeichert. Eingebaute Listen bleiben unveränderlich verfügbar.

Nur in „Sehenswürdigkeiten“ setzt eine bestätigte ganze Zahl von 1 bis 100 den Schiefen Turm von Pisa an diese Position. Jede Anwendung beginnt mit der unveränderlichen Ausgangsliste und tauscht genau zwei Positionen. Die zuletzt gewählte Position bleibt lokal gespeichert. In anderen Notizen werden Zahlen normal gesucht. Die Tests prüfen alle 100 Positionen, Eindeutigkeit, Wiederholungen, ungültige Eingaben und Persistenz.

## Geräteprüfung

Safe Areas, dynamischer Viewport und VisualViewport-Anpassung berücksichtigen die iOS-Tastatur. Die Zielposition wird unmittelbar und nach der Tastaturanimation ausgerichtet. Eine reale iPhone-Prüfung bleibt für systemabhängiges Tastatur- und Installationsverhalten erforderlich.
