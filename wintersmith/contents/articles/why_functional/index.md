<!-- ---
title: "Warum funktionale Programmierung"
author: tschaul
date: 2017-08-31
template: article.jade
--- -->

Funktionale Programmierung erlebt derzeit in mehreren Breichen eine Renaissance. Einer der Gründe hierfür liegen meiner Meinung darin, dass sich funktionale Programmierung besser dafür eignet deklarativen Code zu schreiben. Dadurch lässt sich die fachliche Steuerungslogik, die das konkrete anstehende Problem löst besser von darunter liegenden algorithmischen Arbeitslogik trennen, die abstrakte (im Sinne von wiederkehrende) technische Probleme löst.

<span class="more"></span>

### Funktional vs. Imperativ

Bei der imperativen Programmierung wird Code als Abfolge von Befehlen begriffen, die strikt nacheinandern abgearbeitet werden. Dadurch ist die volle Kontrolle über den Ablauf der Befehle gewährleistet. Gerade für Performance-kritische und Hardware-nahe Programmierung ist der Kontrollfluß und insbesondere die volle Kontrolle über den Arbeitsspeicher essenziell. Im folgenden Beispiel wird ein Rührei zubereitet:

```javascript
var mixture = whisk(eggs)
mixture = season(mixture, salt, pepper)
fry(mixture)
return mixture
```

Bei der funktionalen Programmierung hingegen wird der Code als Verschachtelung von Ausdrücken betrachtet die ausgewertet werden sollen.

```javascript
return fry(
  season(
    whisk(eggs),
    salt,  
    pepper
  )
)
```

Obiges Beispiel lässt sich mithilfe der Deklaration von Konstanten einfacher lesbar hinschreiben. 

```javascript
const mixture = whisk(eggs)
const seasonedMix = season(
    mixture,
    salt,  
    pepper
  )
return fry(seasonedMix)
```

Solange es Konstanten sind die nur einmal zugewiesen werden lässt sich der eigentliche Ausdrucksbaum durch einsetzen der Werte in das Endergebnis rekonstruieren. Sobald aber eine wiederholte Zuweisung erfolgt, oder eine Funktion aufgerufen wird die den Parameter verändert, so wie im ersten Codebeispiel, gilt diese einfach Ersetzbarkeit nichtmehr und der Code lässt sich nichtmehr als ein Ausdruck darstellen. Hieraus ergibt sich der Zusammenhang zwischen funktionaler Programmierung und unveränderlichem Zustand. Sobald veränderlicher Zustand benutzt wird opfert man die Kontrolle über den Datenfluß.

### Funktionen höherer Ordnung

Um überhaupt ausschließlich mit Konstanten und ohne Variablen Programme schreiben zu können die echte Probleme lösen benötigt man sogenannte Funktionen höherer Ordnung. Diese sind Funktionen die entweder eine andere Funktion als Parameter nehmen oder eine Funktion als Ergebnis zurück geben. Eines der am häufigsten benutzte Funktion höherer Ordnung ist die Funktion `map` in JavaScript. 

```javascript
const arr = [1,2,3];
const mul = 3;
arr.map(x => mul*x) // [3,6,9]
```

In obigem Beispiel wird ein neues Array erzeugt in dem jedes Element mit 3 mulitpliziert ist. Hier kommen zwei weitere Sprachfeatures zum tragen die die funktionale Programmierung vereinfachen. Zum einen die Funktion die `map` anonym definiert mithilfe eines Pfeilfunktion/Lambda, zum anderen hat diese Funktion Zugriff auf die Konstante mul obwohl sie außerhalb defeniert wurde (genannt Closure). Diese drei Sprachfeatures (Funktionen höhere Ordnung, Lambdas und Closures) ermöglichen zusammen die vielen schönen Fluent-APIs die zeitgemäße Libraries zur Verfügung stellen.

### Funktional vs rein funktional

Weil Fluent-APIs so beliebt sind haben mittlerweile alle großen Sprachen die funktionalen Features nachgerüstet.
...

### Deklarative Programmierung