# Einzelhandel Analyse
Sammlung an Tools um die Daten des bayerischen Einzelhandels zu analysieren.

## Verwendung
1. Repository klonen `git clone https://...`
2. Erforderliche Module installieren `npm install`
3. `node analyse.js` ausführen, um das Skript zu starten.

## Datenquelle
Die Daten stammen aus mehreren schriftlichen Anfragen des Abgeordneten Klaus Adelt (SPD), welche vom bayerischen Wirtschaftministerium beantwortet wurden. Die Daten wurde von der Firma TradeDimensions für die bayerische Landesregierung erhoben. 
- Anfrage 2014: https://kleineanfragen.de/bayern/17/3014-nahversorgung-in-bayern
- Anfrage 2015:

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
Folgen Felder werden mit dem Skript *analyse.js* berechnet und hinzugefügt:

- **popDelta**: Veränderung der Bevölkerung von 2005 bis 2014
- **shopCountDelta**: Veränderung der Anzahl der Supermärkten von 2005 bis 2015
- **salesAreaDelta**: Veränderung der durchschnittlichen Ladenfläche von 2005 bis 2015
- **employeesDelta**: Veränderung der Anzahl der Beschäftigen von 2007 bis 2015
- **shopCount2014**: Anzahl der Supermärkte 2014
- **lastShopCountDelta**: Veränderung der Anzahl der Supermärkten von 2014 bis 2015
- **noSupermarketCount**: Anzahl der Gemeinden ohne Supermarkt 2014
- **noStoreCount**: Anzahl der Gemeinden ohne Lebensmittelgeschäft 2014
- **ruralStoresNames**: Namen der Dorfläden in jedem Landkreis
- **ruralStoresCount**: Anzahl der Dorfläden in jedem Landkreis
- **biggestChain**: Name oder Namen der größten Supermarktkette
- **biggestChainCount**: Anzahl der der Filialen der größten Supermarktkette
- **biggestChainDelta**: Unterschied zur zweitgrößten Supermarktkette
