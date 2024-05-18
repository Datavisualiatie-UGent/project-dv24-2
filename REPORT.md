# Verslag Criminaliteitscijfers in Gent
## Groep 2: Brent Matthys, Warre Provoost & Mats Van Belle

## Week 3

**Iedereen**: zoeken van datasets en bespreken met het team.

Datavisualisatie - top 3 onderwerpen - groep 2
+ (Warre) **Criminaliteitcijfers stad Gent**: Deze dataset bevat de criminaliteitcijfers van stad Gent per maand tussen 2018 en 2023.
  - Relevantie: Criminaliteitscijfers zijn altijd een belangrijk onderwerp van maatschappelijk belang. Door deze gegevens te visualiseren, kun je inzicht krijgen in de trends en patronen van criminaliteit in Gent gedurende een periode van vijf jaar. De data is ook opgedeeld per regio.
  - Tijdgebonden analyse: Door maandelijkse gegevens te hebben, kunnen we seizoensgebonden trends in criminaliteit identificeren.
  - Impact van gebeurtenissen: We kunnen ook proberen te visualiseren als specifieke gebeurtenissen invloed hebben gehad op de criminaliteitscijfers. Bijvoorbeeld, hoe reageerde de criminaliteit tijdens de COVID-19-pandemie?
+ (Brent) **Stiptheid treinen Infrabel**: Deze dataset bevat stiptheid data van alle treinen in België per dag.
  - Algemene stiptheid
  - Stiptheid per provicie / per station
  - Stiptheid per type trein (L, P, IC, …)
  - Stiptheid in functie van de tijd op de dag. (wss minder stipt in de spits)
  - Stiptheid per maand
+ (Mats) **Geolocatie van verkeersongevallen**: Deze dataset bevat de locaties van de verkeersongevallen in België.
  - op kaart weergeven, ook per provincie/regio
  - Per verkeersongeval bekijken
  - Weersomstandigheden bekijken
  - Tijd van het ongeval
  - Gevaarlijkste wegen/regio’s van belgie?
  - …

## Week 4

**Iedereen**: Meeting voor het kiezen van de dataset met de prof.

**Gewonnen keuze**: [**Criminaliteitcijfers stad Gent**](https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=explore.popularity_score&refine.keyword=Criminaliteitscijfers)

**Feedback meeting met de prof**:
1) Brainstormfase tegen volgende week of langer
2) DAARNA pas programmeren (week erna les over tools voor implementatie) + framework die we moeten gebruiken
3) Na paasvakantie polsen we hoe ver we staan + feedback

Opmerkingen:
+ documenteer alles (ook brainstorm)

## Week 5

**Iedereen**: Brainstorm: bedenken welke visualisaties we willen tonen. Bijwonen presentatie verschillende tools voor de visualisaties.

## Week 6

**Iedereen**: Verdere brainstorm: bedenken welke visualisaties we willen tonen. Meeting 19 maart met verdeling taken.

**Brent**: Opzetten observable framework + implementatie van datafetching.

**Mats & Warre**: Verdere brainstorm en bedenken met welke plots we starten.

## Week 7

**Iedereen**: Meeting met de keuzes van de visualisaties.

**Gekozen visualisaties**:
- Barcharts voor een overzicht van de dataset.
- Heatmap van Gent.
- Linecharts voor de trend in de tijd.

**Brent**: Verdere verbetering van het framework + helpen Warre met bugfixes.

**Warre**: start implementatie van de kaart van Gent in d3.

**Mats**: Basic plots (barcharts) en verbetering van de fetching van de data.

## Paasvakantie

**Iedereen**: Start visualisaties & opzetten van het observable plot framework.

**Brent**: Datafetching geupgrade met o.a. offline datafiles. (Grote snelheidswinst)

**Warre**: lang zoeken op hoe je geoJson visualiseerd met d3.

**Mats**: Vakantie, start ontwikkelen query-klasse. 

## Week 8

**Iedereen**: Afwerking van de initïele visualisaties en meeting met verdere plannen.

**Brent**: Bekijken extra plot: radar chart of parallel coördinaten plot.

**Warre**: Heatmap gemaakt van de data met de d3 map.

**Mats**: Implementeren van de [Query-class](docs/components/README.md) om het bevragen van de dataset makkelijker te maken.

## Week 9

**Iedereen**: Implementeren verdere ideeën & meeting met de prof op 22 april.

**Brent**: Parallele coördinaten geïmplementeerd.

**Mats**: implementeren linechart plot.

**Warre**: verder werken heatmap (breedte geupdate, filtering van de data, etc)

**Feedback meeting met de prof**:
- Zoeken naar patronen/verhalen zoals de Gentse Feesten
- Parallele coördinaten niet in orde: niet echt een doel/nut.
- Map fout geschaald, bekijken observable plot.
- Meer uitleg bij de plots, zeker als er veel interactie is.

## Week 10

**Iedereen**: Implementeren verdere ideeën en meeting rond de verhalen die we willen vertellen.

**3 verhalen**: 
- Gentse Feesten (Mats)
- Corona (Warre)
- Vergelijking ernst van de criminaliteit (Warre)

**Kaart layout herbekijken**: Brent

## Week 11

**Iedereen**: Afwerken 3 opmerkelijke verhalen en voorbereiden presentatie.

**Brent**: Herwerkt kaart via observable plot, nu goed geschaald. Verbetering layout pagina. Vergelijking van de ernst van de criminaliteit.

**Warre**: 3 statische kaarten gemaakt & de covid grafiek ontwikkeld met tekst + voorbereiding presentatie.

**Mats**: Verbetering linecharts met o.a. toevoegen linechart voor de regio's. Herwerken barcharts met observable plot. Kleine extensie Query-klasse (delete en multiples). Visualisatie van de zakkenrollerij tijdens de Gentse Feesten.

## Week 12

**Iedereen**: Presenteren van de dataset en de visualisaties met onze opmerkingen. Afwerken deployment naar github en finaliseren verslag.
