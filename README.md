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
Die Originialdaten aus der Anfrage wurden mit [Tabula](http://tabula.technology/) extrahiert und anschließend bereinigt. Beim Bereinigen der Daten wurden in erster Linie die Spaltennamen und die Namen der Landkreise vereinheitlicht. Die bereinigten Daten liegen im Ordner `/input`:

- **1-allSupermarkets-2015.csv**: Anlage 1: Alle Lebensmitteleinzelhandelsgeschäfte in Bayern pro Gemeinde mit Unternehmensgruppenzugehörigkeit
- **2-shopCountPerAdmDistrict-2005-2015.csv**: Anlage 2: Vergleich der Landkreise mit Zahlen zur Anzahl der Geschäfte, durchschnittliche Verkaufsfläche und Zahl der Angestellten, jeweils damals iund heute
- **3-shopCountPerTown-2014.csv**: Anlage 3: Gemeinden mit der Anzahl der Supermärkte und der kleinen Lebensmittelbetriebe (Bäcker, Metzger usw.) 
- **4-allRuralStores-2015.csv**: Anlage 4: Gemeinden mit einem Dorfladen 

## Daten analysieren
Das Skript `analyse.js` lädt die Tabellen aus `/input`, führt Berechnungen durch und speichert die Ergebnisse im Ordner `/output`. Dabei wird eine CSV-Tabelle und eine JSON-Datei erzeugt:

```javascript
{
  "govDistrict": "Oberbayern", // Name des Regierungsbezirk
  "admDistrict": "Ingolstadt", // Name des Stadt- oder Landkreises
  "admDistrictShort": "", // Kurzname des Stadt- oder Landkreises, falls anwendbar
  "districtType": "Stadt", // Stadt- oder Landkreise
  "id": "09161", // Landkreisschlüssel (nach AGS)
  "pop2014": 131002, // Bevölkerung 2014
  "pop2005": 121314, // Bevölkerung 2014
  "popDeltaAbs": 9688, // absolute Veränderung der Bevölkerung von 2005 bis 2014
  "popDeltaPrc": 7.99, // prozentuale Veränderung der Bevölkerung von 2005 bis 2014
  "shopCount2005": 53, // Anzahl der Supermärkte 2005
  "shopCount2014": 56, // Anzahl der Supermärkte 2014
  "shopCount2015": 56, // Anzahl der Supermärkte 2015
  "shopCountDeltaAbs": 3, // absolute Veränderung der Anzahl der Supermärkten von 2005 bis 2015
  "shopCountDeltaPrc": 5.66, // prozentuale Veränderung der Anzahl der Supermärkten von 2005 bis 2015
  "lastShopCountDeltaAbs": 0, // absolute Veränderung der Anzahl der Supermärkten von 2014 bis 2015
  "lastShopCountDeltaPrc": 0, // prozentuale Veränderung der Anzahl der Supermärkten von 2014 bis 2015
  "salesArea2005": 1013, // durchschnittliche Verkaufsfläche 2005
  "salesArea2015": 1258, // durchschnittliche Verkaufsfläche 2015
  "salesAreaDeltaAbs": 245, // absolute Veränderung der durchschnittlichen Verkaufsfläche von 2005 bis 2015
  "salesAreaDeltaPrc": 24.19, // prozentuale Veränderung der durchschnittlichen Verkaufsfläche von 2005 bis 2015
  "employees2007": 166, // Beschäftigte im Einzelhandel 2007
  "employees2015": 476, // Beschäftigte im Einzelhandel 2015
  "employeesDeltaAbs": 310, // absolute Veränderung der Anzahl der Beschäftigen von 2007 bis 2015
  "employeesDeltaPrc": 186.75, // prozentuale Veränderung der Anzahl der Beschäftigen von 2007 bis 2015
  "noSupermarketCount": 0, // Anzahl der Gemeinden ohne Supermarkt 2014
  "noStoreCount": 0, // Anzahl der Gemeinden ohne Lebensmittelhandwerk 2014
  "ruralStoresNames": "", // Namen der Dorfläden in jedem Landkreis
  "ruralStoresCount": 0, // Anzahl der Dorfläden in jedem Landkreis
  "biggestChain": "Edeka", // Name oder Namen der größten Supermarktkette
  "biggestChainCount": 18, // Anzahl der der Filialen der größten Supermarktkette
  "biggestChainDeltaAbs": 12, // absoluter Unterschied zur zweitgrößten Supermarktkette
  "biggestChainDeltaPrc": 66.67, // prozentualer Unterschied zur zweitgrößten Supermarktkette
  "biggestChainDeltaFctr": 3 // // faktorieller Unterschied zur zweitgrößten Supermarktkette
}
```

## Verbesserungsmöglichkeiten

