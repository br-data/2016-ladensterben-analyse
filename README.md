# Einzelhandel Analyse
Sammlung an Tools um die Daten des bayerischen Einzelhandels zu analysieren.

## Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. `node analyse.js` ausführen, um das Skript zu starten.

## Daten extrahieren und bereinigen
Die Originialdaten aus der Anfrage wurden mit [Tabula](http://tabula.technology/) extrahiert und anschließend bereinigt. Beim Bereinigen der Daten wurden in erster Linie die Spaltennamen und die Namen der Landkreise vereinheitlicht. Die PDFs aus der Antwort zur Anfrage liegen im Ordner */original*. Die bereinigten Daten liegen im Ordner */clean*.

Die Spalten sind folgenermaßen benannt:
- **govDistrict**: Name des Regierungsbezirk
- **admDistrict**: Name des Stadt- oder Landkreises
- **admDistrictShort**: Kurzname des Stadt- oder Landkreises
- **districtType**: Stadt- oder Landkreise
- **shopCount**: Anzahl der Supermärkte
- **salesArea**: durchschnittliche Verkaufsfläche
- **employees**: Beschäftigte im Einzelhandel
- **pop**: Bevölkerung

## Daten analysieren


