# GDPR opt-in modal

De GDPR opt-in modal kan gebruikt worden in kader van de GDPR. Meer informatie en bijkomende tekst en uitleg zal later nog aangevuld worden door de GDPR verantwoordelijke.

## Gebruik

Het gebruik van de GDPR opt-in modal is zeer eenvoudig. Je moet alleen maar een script tag toevoegen aan de head sectie van de HTML pagina Opgelet, de script tag moet het id attribuut gdpr_script hebben. Dit script zal later nog toegevoegd worden aan een CDN zodat het niet nodig is om het bestand toe te voegen aan jouw project.

### Voorbeeld gebruik

```
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js"></script>
```

Als demo kan het script live op elke website toegevoegd worden door onderstaande code uit te voeren in de browser:

```
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://gdpr.milieuinfo.be/gdpr.js';
head.appendChild(script);
GDPR.open();
```

Na het toevoegen van bovenstaand script zal er automatisch bij het laden van de pagina een GDPR modal getoond worden:

![Alt text](https://github.com/milieuinfo/gdpr/blob/master/img/readme1.png?raw=true "GDPR modal voorbeeld")

Om in te schakelen dat de opt-in modal automatisch aan de gebruiker wordt getoond bij het openen van de pagina, moet je het "data-auto-open" attribuut van de script tag toevoegen of op "true" zetten:

```
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-auto-open></script>
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-auto-open="true"></script>
```

### Functionele cookies

Standaard zal de gebruiker geïnformeerd worden dat er gebruik gemaakt wordt van functionele of noodzakelijke cookies. De gebruiker kan deze optie niet uitschakelen en zal dus verplicht akkoord moeten zijn dat dit soort cookies gebruikt worden. Indien dergelijke cookies niet van toepassing zijn, kan deze optie uitgeschakeld worden.

```
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-opt-in-functional="false"></script>
```

### Gebruikersstatistieken

Zoals je in het voorbeeld kan zien, zal er standaard gevraagd worden aan de gebruiker of hij de toestemming geeft voor gebruikersstatistieken. Indien hij hiermee toestemt, zal achterliggend en automatisch Matomo ingeschakeld worden en zullen er voor heel de applicatie gebruikersstatistieken bijgehouden worden.

#### Opgelet Matomo activatie
Uiteraard moet Matomo ook geactiveerd worden door infra. Hiervoor kan best een Helpdesk ticket aangemaakt worden via help@omgevingvlaanderen.be

#### Opgelet domein
Opgelet, voor het correct registreren van de gebruikersstatistieken moet het domein moet wel correct zijn: bijvoorbeeld domein.milieuinfo.be.

Het is uiteraard ook mogelijk om de standaard opt-in aan te passen:

```
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-opt-in-analytics="false"></script>
```

### Beschikbare functies

De GDPR voorziet enkele publieke functies die vrij en altijd aangeroepen kunnen worden.

#### GDPR opt-in leegmaken
De GDPR opt-in modal maakt gebruik van cookies om de opt-in waarden te bewaren. Het is mogelijk om de cookies te resetten.

```
GDPR.reset();
```

#### GDPR opt-in modal openen
De GDPR opt-in modal wordt slechts één keer getoond aan de gebruiker. Indien je de gebruiker bijvoorbeeld de optie wilt geven om nadien de opt-in waarden aan te passen, kan de GDPR modal manueel geopend worden.

```
GDPR.open();
```

#### Opt-in keuzes toevoegen
Je kan ook extra opt-in keuzes toevoegen aan de modal met een label en beschrijving. Dit kan met behulp van een attribuut op de script tag:

```
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-opt-in-socialmedia-label="sociale media" data-opt-in-socialmedia-description="beschrijving sociale media"></script>
```

Standaard is een opt-in uitgeschakeld, maar een opt-in kan initieel ook ingeschakeld worden. Dit kan bereikt worden door het verplicht attribuut:

```
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-opt-in-socialmedia-label="sociale media" data-opt-in-socialmedia-description="beschrijving sociale media" data-opt-in-socialmedia-value="true"></script>
```

Standaard is een opt-in niet verplicht, maar een opt-in kan ook verplicht zijn. In dat geval krijgt de gebruiker niet de mogelijkheid krijgt om de keuze te wijzigen. Dit kan bereikt worden door het verplicht attribuut:

```
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-opt-in-socialmedia-label="sociale media" data-opt-in-socialmedia-description="beschrijving sociale media" data-opt-in-socialmedia-required></script>
<script id="gdpr_script" src="https://gdpr.milieuinfo.be/gdpr.js" data-opt-in-socialmedia-label="sociale media" data-opt-in-socialmedia-description="beschrijving sociale media" data-opt-in-socialmedia-required="true"></script>
```

Of, als je liever met JavaScript werkt:

```
GDPR.addOptIn('socialmedia', 'sociale media', 'beschrijving sociale media', () => { if (aangevinkt) { return true; } else { return false; } }, () => { if (required) { return true; } else { return false; } }, () => console.log('activation'), () => console.log('deactivation'));
```

Zoals je ziet kan je via JavaScript ook callbacks toevoegen die opgeroepen worden bij het activeren van een opt-in keuze of het deactiveren ervan. Dit kan ook wanneer je een extra opt-in keuze hebt toevoegd via een attribuut op de script tag:

```
GDPR.addActivationCallback('socialmedia', () => console.log('activation'));
GDPR.addDeactivationCallback('socialmedia', () => console.log('deactivation'));
```

## Stijl

De DOM zal uitgebreid worden met 2 elementen:
* modal element
* overlay element

Standaard werd er een zeer eenvoudige stijl voorzien die gebaseerd is op de Vlaamse overheid huisstijl. Uiteraard is het mogelijk om deze stijl te overschrijven. Wij hebben enkele id's voorzien die hiervoor gebruikt kunnen worden. Het stijlen via HTML element tags is mogelijk, maar me garanderen niet dat deze in toekomstige versies ongewijzigd zullen blijven. Indien er nood is om specifieke elementen te stijlen, kan hiervoor altijd een id toegevoegd worden.

Momenteel zijn volgende id's voorzien:
* ![#gdpr_overlay](https://placehold.it/15/fc0d1c/000000?text=+) `#gdpr_overlay`
* ![#gdpr_modal](https://placehold.it/15/fffd38/000000?text=+) `#gdpr_modal`
* ![#gdpr_modal_titel](https://placehold.it/15/0e7e12/000000?text=+) `#gdpr_modal_titel`
* ![#gdpr_modal_tekst](https://placehold.it/15/fda429/000000?text=+) `#gdpr_modal_tekst`
* ![#gdpr_modal_confirm_btn](https://placehold.it/15/0b24fb/000000?text=+) `#gdpr_modal_confirm_btn`

![Alt text](https://github.com/milieuinfo/gdpr/blob/master/img/readme2.png?raw=true "GDPR HTML id")

## Ontwikkelaars

* **Tom Coemans** - [Coemans](https://github.com/coemans)
* **Sander Kleykens** - [SanderKleykens](https://github.com/SanderKleykens)

Zie ook de lijst van [ontwikkelaars](https://github.com/milieuinfo/gdpr/graphs/contributors) die mee geholpen hebben aan dit project.

## Contact

Heb je suggesties, opmerkingen, tips of complimenten? Voel je dan vrij om ons te contacteren via help@omgevingvlaanderen.be.