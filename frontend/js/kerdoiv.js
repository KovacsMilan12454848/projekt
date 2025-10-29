let index = 0;
const kitoltes_eredmeny = {};

window.addEventListener("load", function () {
    {
        Betoltes(index);
    }
})


function Betoltes(i) {
    const oldal = document.getElementById("Kerdesek");
    const adat = kerdesek[i];

    oldal.innerHTML = `
        <h1 class="mt-4 p3 text-center">${adat.szoveg}</h1>
        <hr>
        <form id="Form" class="p-3 g-3"></form>
    `;

    Valasz_lehetosegek(adat);

    const szoveg = (i === kerdesek.length - 1) ? "Befejezés" : "Következő";

    oldal.innerHTML += `
        <div class="text-end p-3">
            <button type="button" class="btn btn-secondary btn-lg" onclick="Elozo()">Előző</button>
            <button type="button" class="btn btn-success btn-lg" onclick="Kovetkezo()">${szoveg}</button>
        </div>
        <div class="text-center" id="helyzet"></div>
    `;

    Gombok();
}

function Valasz_lehetosegek(adat) {
    const ker = document.getElementById("Form");
    ker.innerHTML = "";
    let lep = 0;
    for (const val of adat.valaszok) {
        ker.innerHTML += `<label class="h3">
            <input type="radio" name="valasz" value="${lep}" class="big-radio"> ${val}
        </label><br>`;
        lep++;
    }
}

function ugras(ugras) {
    index = ugras;
    Betoltes(index);
}

function Gombok() {
    const helyzet = document.getElementById("helyzet");
    helyzet.innerHTML = "";
    kerdesek.forEach(k => {
        const cls = (k.sorszam - 1 === index) ? "btn-success" : (k.megcsinalta ? "btn-secondary" : "btn-warning");
        helyzet.innerHTML += `<button class="btn m-1 p-2 col-1 ${cls}" onclick="ugras(${k.sorszam - 1})">${k.sorszam}</button>`;
    });
}

function Kovetkezo() {
    const selected = document.querySelector('input[name="valasz"]:checked');
    if (!selected) return alert("Jelöljön meg valamelyik választ!");

    const valIndex = parseInt(selected.value);
    const adat = kerdesek[index];

    adat.megcsinalta = true;
    kitoltes_eredmeny[adat.sorszam] = adat.valaszok[valIndex];


    if (index == kerdesek.length - 1 && kerdesek.every(n => n.megcsinalta)) {
        Befejezes();
    }
    else if (index < kerdesek.length - 1) {
        index++;
        Betoltes(index);
    }
    else { alert("Kérem töltse ki a tesztet, mert igy nem lehet beküldeni!") }
}

function Elozo() {
    if (index === 0) return alert("Ettől visszább nem lehet menni!");
    index--;
    Betoltes(index);
}

function Befejezes() {
    console.log("Kitöltés eredménye:", kitoltes_eredmeny);

    sendResultsToBackend();

    const oldal = document.getElementById("Kerdesek");
    oldal.innerHTML = `
        <h1 class="mt-4 p3 text-center">Köszönjük, hogy kitöltötte a tesztet!</h1>
        <br>
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <h4>Ha szeretne, átmehet az ajánlás oldalra</h4>
                    <a href="#"><button class="btn btn-primary btn-lg">Ajánlás</button></a>
                </div>
                <div class="col-6">
                    <h4>Vagy visszatérhet a főoldalra</h4>
                    <a href="../html/index.html"><button class="btn btn-primary btn-lg">Főoldal</button></a>
                </div>
            </div>
        </div>
    `;

}


function sendResultsToBackend() {
    fetch('http://localhost:3000/kerdoiv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(kitoltes_eredmeny)
    })
        .then(res => res.json())
        .then(data => console.log('Backend response:', data))
        .catch(err => console.error('Error sending results:', err));
}