# GDPR opt in modal

De GDPR opt in modal kan gebruikt worden in kader van de GDPR. Meer informatie en bijkomende tekst en uitleg zal later nog aangevuld worden door de GDPR verantwoordelijke.

## Gebruik

Het gebruik van de GDPR opt in modal is zeer eenvoudig. Je moet alleen maar een script tag toevoegen aan de head sectie van de HTML pagina. Dit script zal later nog toegevoegd worden aan een CDN zodat het niet nodig is om het bestand toe te voegen aan jouw project.

### Voorbeeld gebruik

```
<script src="gdpr.js"></script>
```

Na het toevoegen van bovenstaand script zal er automatisch bij het laden van de pagina een GDPR modal getoond worden:

![Alt text](https://github.com/milieuinfo/gdpr/blob/master/img/readme1.png?raw=true "GDPR modal voorbeeld")

Zoals je in het voorbeeld kan zien, zal er standaard gevraagd worden aan de gebruiker of hij de toestemming geeft voor gebruikersstatistieken. Indien hij hiermee toestemt, zal achterliggend en automatisch Matomo ingeschakeld worden en zullen er voor heel de applicatie gebruikersstatistieken bijgehouden worden.

Het is uiteraard ook mogelijk om de standaard opt in aan te passen:

```
<script src="gdpr.js" analytics="false"></script>
```

## Stijl

De DOM zal uitgebreid worden met 2 elementen:
* modal element
* overlay element

Standaard werd er een zeer eenvoudige stijl voorzien die gebaseerd is op de Vlaamse overheid huisstijl. Uiteraard is het mogelijk om deze stijl te overschrijven. Wij hebben enkele id's voorzien die hiervoor gebruikt kunnen worden. Het stijlen via HTML element tags is mogelijk, maar me garanderen niet dat deze in toekomstige versies ongewijzigd zullen blijven. Indien er nood is om specifieke elementen te stijlen, kan hiervoor altijd een id toegevoegd worden.

Momenteel zijn volgende id's voorzien:
* <span style='color:red'>#gdpr_overlay</span>
* <span style='color:yellow'>#gdpr_modal</span>
* <span style='color:green'>#gdpr_modal_titel</span>
* <span style='color:orange'>#gdpr_modal_tekst</span>
* <span style='color:blue'>#gdpr_modal_confirm_btn</span>

![Alt text](https://github.com/milieuinfo/gdpr/blob/master/img/readme2.png?raw=true "GDPR HTML id")

## Ontwikkelaars

* **Tom Coemans** - *setup en eerste ontwikkling* - [Coemans](https://github.com/coemans)

Zie ook de lijst van [ontwikkelaars](https://github.com/milieuinfo/gdpr/graphs/contributors) die mee geholpen hebben aan dit project.