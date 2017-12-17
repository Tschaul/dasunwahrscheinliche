---
title: "Warum funktionale Programmierung?"
author: tschaul
date: 2017-12-13
template: article.jade
---

Funktionale Programmierung erlebt derzeit in mehreren Breichen eine Aufleben. Sie erlaubt es einfacher deklarativ zu programmieren. So lässt sich die fachliche Steuerungslogik besser von der darunter liegenden algorithmischen Arbeitslogik trennen.

<span class="more"></span>

### Funktional vs. Imperativ

Bei der imperativen Programmierung wird Code als Abfolge von Befehlen begriffen, die strikt nacheinandern abgearbeitet werden. Dadurch ist die volle Kontrolle über den Ablauf der Befehle gewährleistet. Gerade für Performance-kritische und Hardware-nahe Programmierung ist der Kontrollfluß und insbesondere die volle Kontrolle über den Arbeitsspeicher essenziell. Als Beispiel zur Demonstration der Konzepte dient im folgenden die Zubereitung eines Rühreis.

```javascript
var mixture = whisk(eggs)
mixture = season(mixture, salt, pepper)
fry(mixture)
return mixture
```

Bei der funktionalen Programmierung hingegen wird der Code als Verschachtelung von Ausdrücken betrachtet, die ausgewertet werden sollen. 

```javascript
return fry(
  season(
    whisk(eggs),
    salt,  
    pepper
  )
)
```
Hierbei geht die Kontrolle über die Abfolge der Befehle etwas verloren. Die als erste ausgewertete Funktion `whisk(eggs)` steht z.B. unscheinbar in der Mitte des Ausdrucks. In vielen rein funktionalen Sprachen ist es vom Programmcode her oft nicht vorherzusehen zu welchem Zeitpunkt die Auswertung stattfindet, weil die Auswertung zum spätestmöglichen Zeitpunkt verschoben wird. Auf der anderen Seite lässt sich für jeden Teilausdruck eindeutig zurückverfolgen, wo die einzelnen Werte herkommen, beziehungsweise wie die Daten durch den Ausdruck hindurchfließen. Diese Art der Programmierung gewährleistet also volle Kontrolle über den Datenfluß.

Mithilfe der Deklaration von Konstanten lässt sich die Kontrolle über die Abfolge der Aufrufe wieder herstellen. Dadruch wird der Code auch einfacher zu lesen.

```javascript
const mixture = whisk(eggs)
const seasonedMix = season(
    mixture,
    salt,  
    pepper
  )
return fry(seasonedMix)
```

Solange es Konstanten sind - also Variablen, die nur einmal zugewiesen werden - lässt sich der eigentliche Ausdrucksbaum durch Einsetzen der Werte in das Endergebnis rekonstruieren. Sobald aber eine wiederholte Zuweisung erfolgt oder eine Funktion aufgerufen wird, die den Wert eines Parameter verändert, so wie `fry(mixture)` im ersten Codebeispiel, gilt diese einfache Ersetzbarkeit nicht mehr und der Code lässt sich nicht mehr als ein Ausdruck darstellen. Hieraus ergibt sich der Zusammenhang zwischen funktionaler Programmierung und unveränderlichem Zustand. Sobald veränderliche Zustandsvariablen benutzt werden, opfert man die Kontrolle über den Datenfluß.

### Funktionen höherer Ordnung

Um überhaupt ausschließlich mit Konstanten Programme schreiben zu können, die echte Probleme lösen, benötigt man sogenannte Funktionen höherer Ordnung. Diese sind Funktionen die entweder eine andere Funktion als Parameter annehmen oder eine Funktion als Ergebnis zurückgeben. Eine der am häufigsten benutzten Funktionen höherer Ordnung ist die Funktion `map` in JavaScript. 

```javascript
const arr = [1,2,3];
const mul = 3;
arr.map(x => mul*x) // [3,6,9]
```

In obigem Beispiel wird ein neues Array erzeugt, in dem jedes Element mit 3 multipliziert ist. Hier kommen zwei weitere Sprachfeatures zum Tragen, die die funktionale Programmierung vereinfachen. Zum einen die Funktion, die an `map` als Parameter übergeben wird, anonym definiert mithilfe einer Pfeilfunktion (Lambda). Zum anderen hat diese Funktion Zugriff auf die Konstante `mul`, obwohl sie außerhalb definiert wurde (genannt Closure). Diese drei Sprachfeatures (Funktionen höherer Ordnung, Lambdas und Closures) ermöglichen zusammen die vielen ausdrucksstarken Fluent-APIs, die zeitgemäße Libraries zur Verfügung stellen.

### Funktional vs rein funktional

Weil Fluent-APIs so beliebt sind haben die meistgenutzen Sprachen mittlerweile alle die funktionalen Features nachgerüstet. Die meisten Programmiersprachen kann man also als funktional bezeichnen, weil sie in ihrer Mächtigkeit den _rein_ funktionalen Sprachen (wie Haskel, Clojure und F#) in nichts nachstehen. Rein funktionale Sprachen verankern aber zusätzlich das Prinzip von unveränderlichem Zustand in sich. Sie erlauben entweder gar keine wiederholte Zuweisung von Variablen oder nur in bestimmten transaktionsartigen Kontexten. Das heißt rein funktionale Sprachen haben eine absichtlich reduzierte Mächtigkeit, die die Komplexität der Programme begrenzen soll. Dadurch werden die Programme schwerer zu schreiben, aber dafür einfach zu verstehen und zu warten.

Ein anderes Beispiel für eine solche freiwillige Beschränkung der Mächtigkeit sind statische Typ-Systeme. Hier wird dem Programm die Möglichkeit genommen, den Typ einer Variable zur Laufzeit zu verändern. Auch hierdurch soll Komplexität eingegrenzt werden.

### Deklarative Programmierung

Beispiele für FLuent-APIs, die in letzter Zeit beliebt geworden sind, sind LinQ in .Net, Java-Streams, ReactiveX sowie viele Frameworks für Dependency-Injection. Ein Grund für ihre Beliebtheit ist das dahinterliegende Paradigma der deklarativen Programmierung, was soviel bedeutet wie die Trennung von Arbeits- und Steuerungscode. Dabei ergibt sich oft, dass sich Arbeitscode weit besser wiederverwenden lässt als Steuerungscode, der ja von der konkreten Geschäftslogik abhängt. Nehmen wir als Beispiel im folgenden die Array-Operation `filter` in JavaScript.

```javascript
// Ohne Trennung
let activeUsers = [];
for (let i = 0; i < users.length; i++) {
  if(users[i].active){
    activeUsers.push(users[i])
  }
}

// Deklarativ
const activeUsers = users.filter(x => x.active)
```

Man sieht sofort, dass die Version mit herausgetrenntem Arbeitscode viel kompakter und einfacher zu lesen ist. Es gebietet schon das DRY-Prinzip (don't repeat yourself), dass `filter` benutzt wird statt überall im Code dieselbe For-Schleife auszuprogrammieren. Bei rein funktionaler Programmierung ergibt sich also die Trennung von Arbeits- und Steuerungscode auf natürliche Weise. Dadurch, dass Arbeitscode (wie obiges filter-Beispiel) nur schwer rein funktional auszudrücken ist, ist man hierfür auf die Runtime/Infrastruktur/Frameworks angewiesen. So bleibt der eigene Code, der das konkrete Problem der Anwendung löst, lesbar und leicht zu verstehen, während die schwierigen wiederkehrenden Probleme outgesourced werden.
