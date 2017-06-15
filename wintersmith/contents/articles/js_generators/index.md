---
title: Generator-Funktionen in JavaScript
author: tschaul
date: 2017-06-15
template: article.jade
---

Vielleicht hat der ein oder anderen schon einmal bemerkt, dass einige Supermarktkassen den Kassenbon bereits während des Scannvorgangs der Waren drucken. Das macht eine Menge Sinn und reduziert gerade bei größeren Einkäufen die Wartezeit beim Bezahlvorgang erheblich.

Nun ist diese häppchenweise Verarbeitung der Eingaben sicher ein schickes Feature, aber es erhöht die technische Komplexität. Generator-Funktionen sind eine Abstraktion um diese Komplexitätserhöhung einzugrenzen, indem sie es erlauben Iterationen von außerhalb zu steuern.

<span class="more"></span>

In JavaScript kamen Generator-Funktionen mit dem ECMAScript-2015-Standard (ES6) dazu. Sie werden mit einem Asterisk-Symbol nach dem `function`-Keyword gekennzeichnet. Ruft man eine solche Funktion auf erhält man nicht direkt einen Wert, sondern ein Generator-Objekt, welches die Erzeugung neuer Werte steuert. Durch den Aufruf von `next()` erhält man ein Objekt mit dem nächsten Wert und der Information ob die Iteration abgeschlossen ist.

```javascript
function* oneToThree() {
  yield 1
  yield 2
  return 3
}

var gen = oneToThree();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: true }
```

Das erhaltene Generator-Objekt kann auch als Iterator verwendet werden. Dadurch lässt sich über die Ergebnisse auch mittels `for ... of` iterieren:

```javascript
for (var num of oneToThree()){
    console.log(num)
}
// 1
// 2
// 3
```

Für unser Eingangsbeispiel der Supermarktkasse sind wir jetzt aber nur einen kleinen Schritt weiter. Denn dort sollen in der gesteuerten Schleife keine Werte erzeugt werden wie oben, sondern die Werte sollen in der Schleife Eingabe für Eingabe verarbeitet werden. In diesem benutzt man das Generator-Objekt als Observer. Ein Generator ist schlicht die Vereinigung von Iterator und Observer. 

```javascript
function* logSomeStuff(){
    While(true){
        nextInput = yield;
        console.log(nextInput);
    }
}
var gen = logSomeStuff();
gen.next("foo") // foo
gen.next("bar") // bar
```

Hier wird das Schlüsselwort `yield` als Ausdruck benutzt und nicht als Statement. Die Auswertung des Ausdrucks hat den Effekt, dass die Funktion an dieser Stelle gestoppt wird bis der Observer mittels `next(...)` mit einem neuen Wert gefüttert wird. Dann wird der neue Wert an Stelle des `yield`-Ausdrucks gestellt und die Funktion läuft weiter.

Mit diesem letzten Beispiel haben wir bereits den eingangs erwähnten Anwendungsfall des Supermarktkassen-Druckers erschlagen. Generator-Funktionen haben aber noch weit mehr zu bieten. Insbesondere für die asynchrone Programmierung sind Generatpr-Funktionen ein mächtiges Werkzeug, wie wir weiter unten sehen werden.

Man kann nämlich auch beide Aspekte des Generators (Observer und Iterator) kombinieren um bei jeder Iteration ein Teilergebnis zurückzugeben. Hier tritt aber die sprachliche Obskurität auf, dass `yield` sowohl als Statement als auch als Ausdruck verwendet wird. Dabei gilt, dass erst das `yield`-Statement ausgeführt wird, also ein Wert für die Iteration generiert wird, und anschließend das `yield`-Statement durch den Wert ersetzt wird mit dem der Generator gefüttert wurde. Folgendes Beispiel stellt einen Generator dar, der zurückgibt ob der zuletzt gefütterte Werte größer ist als der vorletzte.

```javascript
function* goingUp(){
    var old = yield;
    var now = yield;
    while(true){
        var now = yield now > old;
        old = now;
    }
}

var gen = goingUp();
console.log(gen.next(0).value)  // undefined 
console.log(gen.next(2).value)  // undefined
console.log(gen.next(1).value)  // true // 2 > 0
console.log(gen.next(0).value)  // false // 1 < 2
```

Eine solcher Generator kann z.B. benutzt werden um das erste lokale Maximum einer Zahlenreihe zu finden, ohne dass der Konsument der Funktion alle Werte zur Verfügung stellen muss. Das kann nützlich sein, wenn z.B. die Werte einzeln oder Batch-weise aus einer Datenbank gelesen werden müssen.

Die doppelte Natur von Generator-Funktionen lässt sich außerdem ausnutzen um asynchronen JavaScript-Code leichter lesbar zu gestalten. Dazu schreiben wir uns eine wiederverwendbare Funktion `runAsync` die als einzigen Parameter eine Generator-Funktion erwartet, welche Promise-Objekte zurückgibt. Promises sind Stellvertreter-Objekte für zukünftige Rückgabewerte und entsprechen etwa Futures in Java/C++ oder Tasks in c#. Die `runAsync`-Funktion nimmt die Promises entgegen und füttert asynchron nach deren Auflösung das Ergebnis zurück in den Generator. Zwecks der Kürze ist in folgendem Beispiel die Fehlerbehandlung absichtlich ausgelassen.

```javascript
function runAsync(generator){
    var it = generator();
    (function iterate(val){
        var ret = it.next( val );
        if (!ret.done) {
            ret.value.then( iterate );
        }
    })();
}
```

Dadurch können wir nun eine asynchrone Funktion so schreiben als wäre sie synchron. Im Folgenden geben die Funktionen `getFoo` und `getBar` asynchron die Strings "foo" und "bar" zurück.

```javascript
function* printFooBar(){
    var part1 = yield getFoo()
    var part2 = yield getBar()
    console.log(part1+part2)
}

runAsync(printFooBar) // foobar
```

Nach der Auflösung des von `getFoo` erhaltenen Promise-Objekts wird das `yield`-Statement "`yield getFoo()`" durch den String "foo" ersetzt und der Variable `part1` zugewiesen. Erst danach wird mit `getBar` das nächste Promise-Objekt angefordert.

Im neueren ECMAScript-2016-Standard (ES7), welcher noch im Draft-Zustand ist, erhält dieser spezielle Anwendungsfall für Generator-Funktionen mit `async/await` seine eigene Syntax. Dadurch braucht man keine eigene `runAsync`-Funktion mehr.

```javascript
async function printFooBar(){
    var part1 = await getFoo()
    var part2 = await getBar()
    console.log(part1+part2)
}

printFooBar() // foobar
```

Unter der Haube läuft in beiden Fällen genau das selbe ab. Bis zur Finalisierung von ES7 lässt sich diese Funktionalität aber ebenfalls wie gezeigt erzielen. Für den produktiven Einsatz empfehle ich die Library "co" (https://github.com/tj/co).

#### Referenzen:
<br/>
[Video] Evolution of JavaScript: from ES5 to ES6 to ES7 <br/>
https://www.youtube.com/watch?v=_8Qyk5j_b-g

The Basics Of ES6 Generators<br/>
https://davidwalsh.name/es6-generators