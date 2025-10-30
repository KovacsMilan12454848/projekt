class Kalkulator {
    constructor(sorszam, szoveg, valaszok, weight = 1) {
        this.sorszam = sorszam;
        this.szoveg = szoveg;
        this.valaszok = valaszok;
        this.weight = weight;
        this.megcsinalta = false;
        this.valasztott = null;
    }
}
const Kalkulator_adat = [

    new Kalkulator(1, "Milyen gyakran eszel csontlevest, bőrös húst vagy zselatint?", [{ ker: "Nem szoktam", ert: 0 }, { ker: "Hetente párszor", ert: 2 }, { ker: "Hetente egyszer", ert: 1 }, { ker: "Szinte naponta", ert: 3 }], 1.5),
    new Kalkulator(2, "Milyen arányban eszel izomhúst vs kötőszövetes részeket?", [{ ker: "Nem szoktam", ert: 0 }, { ker: "Főleg izomhús", ert: 0 }, { ker: "Vegyesen", ert: 1 }, { ker: "Több kötőszövetes", ert: 3 }], 1.2),
    new Kalkulator(3, "Hogyan gyógyulnak a sebeid/karcolások?", [{ ker: "Lassan (hetek)", ert: 0 }, { ker: "Normál", ert: 1 }, { ker: "Gyorsan (napok)", ert: 3 }], 1),
    new Kalkulator(4, "Tapasztalsz-e ízületi/izomfájdalmat?", [{ ker: "Gyakran tapasztalok", ert: 0 }, { ker: "Néha tapasztalok ", ert: 1 }, { ker: "Ritkán tapasztalok ", ert: 3 },{ ker: "Nem tapasztalok ", ert: 3 }], 1),
    new Kalkulator(5, "Milyen az alvásminőséged?", [{ ker: "Rosszul alszom", ert: 0 }, { ker: "Közepesen alszom", ert: 1 }, { ker: "Jól alszom", ert: 3 }], 0.9),
    new Kalkulator(6, "Mennyire vagy stresszes, ideges általában?", [{ ker: "Gyakran vagok ideges", ert: 0 }, { ker: "Néha vgaok ideges", ert: 1 }, { ker: "Ritkán, általában jól vagyok", ert: 3 },{ ker: "Nem szoktam", ert: 3 }], 0.9),
    new Kalkulator(7, "Szedtél-e glicint/kollagént valaha?", [{ ker: "Nem ", ert: 0 }, { ker: "Igen, ritkán", ert: 1 }, { ker: "Igen, napi szinten", ert: 3 }], 1),
    new Kalkulator(8, "Ha szedsz, mennyi glicint/kollagént viszel be naponta?", [{ ker: "Nem szedek", ert: 0 },{ ker: "0–2 g", ert: 0 }, { ker: "3–5 g", ert: 2 }, { ker: "6–10 g", ert: 3 }, { ker: "11 g fölött", ert: 1 }], 1.1),
    new Kalkulator(9, "Tapasztaltál mellékhatásokat (puffadás, hányinger, álmosság) szedés után?", [{ ker: "Nem szedek", ert: 0 },{ ker: "Igen, gyakran tapasztaltam", ert: 1 }, { ker: "Néha, tapasztaltam", ert: 2 }, { ker: "Nem tapasztaltam", ert: 3 }], 1)];

let currentIndex = -1;
let userMeta = { nem: "", testsuly: null, magassag: null };
const vegeredmeny = {};

window.addEventListener('load', () => {
    Elso_Oldal();
});

function kerdes_felteves(i) {
    const area = document.getElementById("questionArea");

    // védelem hibás indexek ellen
    if (i === -1 || i === null || i === undefined) {
        if (area) area.innerHTML = "";
        return;
    }
    if (i < 0 || i >= Kalkulator_adat.length) {
        if (area) area.innerHTML = `<p>Hiba: érvénytelen kérdésszám.</p>`;
        return;
    }

    const q = Kalkulator_adat[i];
    const selected = q.valasztott;

    let html = `<h3 class="mb-3">${q.szoveg}</h3>`;
    html += `<form id="Form">`;
    q.valaszok.forEach((v, idx) => {
        const checked = (selected === idx) ? "checked" : "";
        html += `<label class="d-block h4"><input type="radio" name="valasz" value="${idx}" class="big-radio" ${checked}> ${v.ker}</label>`;
    });
    html += `</form>`;
    if (area) area.innerHTML = html;

    document.querySelectorAll('input[name="valasz"]').forEach(r => {
        r.addEventListener('change', (ev) => {
            q.valasztott = Number(ev.target.value);
            q.megcsinalta = true;
            navigacios_gomb();
        });
    });
}

function Elso_Oldal() {
    const root = document.getElementById("Kerdesek");

    root.innerHTML = `
        <div class="row pt-5">
            <div class="col-md-4">
                <div class="mb-4">
                    <label class="form-label h4">Nem</label>
                    <select id="nem" class="form-select" >
                        <option value="">(válassz)</option>
                        <option value="férfi">Férfi</option>
                        <option value="nő">Nő</option>
                        <option value="egyéb">Egyéb</option>
                    </select>
                </div>
                <div class="mb-4 ">
                    <label class="form-label  h4">Testsúly (kg)</label>
                    <input id="testsuly" type="number" min="20" max="400" class="form-control" >
                </div>
                <div class="mb-4  h4">
                    <label class="form-label">Magasság (cm)</label>
                    <input id="magassag" type="number" min="80" max="260" class="form-control" >
                </div>
            </div>
            <div class="col-md-8"></div>
        </div>

        <div class="mt-3 p-3">
            <div id="helyzet" class="mt-2 text-center"></div>
        </div>

        <br>
        <div class="text-end">
            <button class="btn btn-secondary btn-lg" onclick="Elozo()">Előző</button>
            <button class="btn btn-success btn-lg" id="kov" onclick="Kovetkezo()">Következő</button>
        </div>`;

    const nemEl = document.getElementById("nem");
    const tsEl = document.getElementById("testsuly");
    const mgEl = document.getElementById("magassag");

    if (userMeta.nem) nemEl.value = userMeta.nem;
    if (userMeta.testsuly !== null) tsEl.value = userMeta.testsuly;
    if (userMeta.magassag !== null) mgEl.value = userMeta.magassag;

    // event listenerek, hogy frissítsék a userMeta-t
    nemEl.addEventListener("change", e => { userMeta.nem = e.target.value; });
    tsEl.addEventListener("input", e => {
        userMeta.testsuly = e.target.value ? Number(e.target.value) : null;
    });
    mgEl.addEventListener("input", e => {
        userMeta.magassag = e.target.value ? Number(e.target.value) : null;
    });
    navigacios_gomb();


}

function renderAll() {
    const root = document.getElementById("Kerdesek");
    root.innerHTML = `
    <div class="row mb-2">
        <div class="col-md-6">
            <div id="questionArea"></div>
        </div>
    </div> 
    <div class="mt-3 p-3">
        <div id="helyzet" class="mt-2 text-center"></div>
    </div>

    <br>
    <div class="text-end">
        <button class="btn btn-secondary btn-lg" onclick="Elozo()">Előző</button>
        <button class="btn btn-success btn-lg" id="kov" onclick="Kovetkezo()">Következő</button>
    </div>`;
    navigacios_gomb();
}

function navigacios_gomb() {
    const helyzet = document.getElementById("helyzet");
    if (!helyzet) return;

    // építsük fel egyszerre

    const kimutatas = (currentIndex == -1) ? "btn-success" : "btn-secondary";
    helyzet.innerHTML = `<button class="btn m-1 p-2 col-1 ${kimutatas}" onclick="ugras(-1)">0</button>`;
    Kalkulator_adat.forEach(k => {
        const idx = k.sorszam - 1;
        const cls = (idx === currentIndex) ? "btn-success" : (k.megcsinalta || k.valasztott !== null) ? "btn-secondary" : "btn-warning";
        helyzet.innerHTML += `<button class="btn m-1 p-2 col-1 ${cls}" onclick="ugras(${idx})">${k.sorszam}</button>`;
    });


}

function Kovetkezo() {
    if (currentIndex === -1) {
        currentIndex = 0;
        renderAll();
        kerdes_felteves(currentIndex);
        navigacios_gomb();
        return;
    }

    const selected = document.querySelector('input[name="valasz"]:checked');
    if (!selected) {
        alert("Válassz egy választ, vagy használd a kérdésszám gombokat.");
        return;
    }

    Kalkulator_adat[currentIndex].valasztott = selected.value;
    Kalkulator_adat[currentIndex].megcsinalta = true;

    if (currentIndex === Kalkulator_adat.length - 1) {
        if (Kalkulator_adat.every(q => q.megcsinalta || q.valasztott !== null)) {
            alert("Lejebb görgetve megtekintheti az eredményét")
            Befejezes();
            return;
        } else {
            alert("Töltsd ki az összes kérdést a befejezéshez.");
            return;
        }
    }
    currentIndex++;
    kerdes_felteves(currentIndex);
    navigacios_gomb();
}

function Elozo() {
    if (currentIndex === -1) {
        alert("Nem lehet visszább menni");
        return;
    }
    if (currentIndex === 0) {
        Elso_Oldal();
        currentIndex = -1;
        return;
    }
    currentIndex--;
    kerdes_felteves(currentIndex);
    navigacios_gomb();
}

function ugras(szam) {

    if (szam == -1) {
        currentIndex = -1;
        Elso_Oldal();

        return;
    }
    currentIndex = szam;
    renderAll();
    kerdes_felteves(currentIndex);
    navigacios_gomb();
}

// EREDMÉNY SZÁMITÁS
function BMI_calculator() {
    if (!userMeta.testsuly || !userMeta.magassag) return null;
    const m = userMeta.magassag / 100;
    const bmi = +(userMeta.testsuly / (m * m)).toFixed(1);
    return bmi;
}

function eredmenysz() {
    let user_ossz = 0;
    let max = 0;
    Kalkulator_adat.forEach(q => {
        const maxOpt = Math.max(...q.valaszok.map(v => v.ert));
        max += maxOpt * q.weight;
        if (q.valasztott !== null && q.valasztott !== undefined) {
            user_ossz += q.valaszok[q.valasztott].ert * q.weight;
        }
    });

    let bmi = BMI_calculator();
    if (bmi) {
        if (bmi < 18.5) user_ossz *= 0.9;
        else if (bmi > 30) user_ossz *= 0.8;
        else user_ossz *= 1.0;
    }

    const szazalek = Math.round((user_ossz / max) * 100);
    return { user_ossz, max, szazalek };
}




/* ---------- EREDMÉNYOLDAL ---------- */
function Befejezes() {
    const { user_ossz, max, szazalek } = eredmenysz();
    const bmi = BMI_calculator();
    let status, tanacs = [];

    if (szazalek < 40) {
        status = "Glicin/kollagén bevitel valószínű hiányos.";
        tanacs.push("Növeld a kollagénben gazdag ételek (csontlé, bőr, zselatin) fogyasztását.");
        tanacs.push("Próbálj 5–10 g napi glicint vagy kollagénport 1–2 hétig, és figyeld a változásokat.");
    } else if (szazalek < 70) {
        status = "Közel optimális";
        tanacs.push("3–5 g/nap valószínűleg elegendő; tartsd a változatos fehérjebevitelt.");
    } else {
        status = "Magas/gyakori glicinbevitel vagy túl sok kiegészítő.";
        tanacs.push("Fontold meg a bevitel csökkentését 3–5 g/nap alá, ha mellékhatásokat tapasztalsz.");
        tanacs.push("Ha gyakran érzel álmosságot vagy emésztési panaszt, tarts szünetet.");
    }

    if (bmi !== null) {
        if (bmi < 18.5) tanacs.push("Alacsony testsúly: növeld a kalória- és fehérjebevitelt.");
        else if (bmi > 30) tanacs.push("Magas BMI: konzultálj dietetikussal a fehérjebevitel optimalizálásához.");
    }
    if (userMeta.nem === "nő") {
        tanacs.push("Nők esetén fontos a bőr és csontok kollagénellátása; figyeld a havi ciklus és energiaszint változásait.");
    }

    const eredmeny_kod = genCode()
    vegeredmeny["kod"] = eredmeny_kod;
    vegeredmeny["szazalek"] = szazalek.toString();
    vegeredmeny["tanacs"] = tanacs.toString();
    vegeredmeny["status"] = status.toString();
    vegeredmeny["bmi"] = bmi;


    sendResultsToBackend()
    const out = document.getElementById("resultArea");
    out.innerHTML = `
    <div class="card p-3">
      <h4>Eredmény</h4>
      <p class="mb-1"><strong>Kód (ezzel később is megnézheted az eredményed):</strong> ${eredmeny_kod}</p>
      <p class="mb-1"><strong>Kategória:</strong> ${status}</p>
      <p class="mb-1"><strong>Pontszám:</strong> ${user_ossz} / ${max} (${szazalek.toFixed(2)}%)</p>
      ${bmi !== null ? `<p class="mb-1"><strong>BMI:</strong> ${bmi}</p>` : `<p class="mb-1 text-muted">BMI kiszámításához add meg a testsúlyt és magasságot.</p>`}
      <hr>
      <h6>Ajánlások</h6>
      <ul>
        ${tanacs.map(a => `<li>${a}</li>`).join("")}
      </ul>
    </div>
  `;
}

function eredmeny_kimutatas() {

}
function genCode() {
    const abc = "abcdefghijklmnopqrstuvwxyz";
    const betu = abc[Math.floor(Math.random() * abc.length)];
    const szam = Math.floor(Math.random() * 1000);
    return betu + szam;
}





function sendResultsToBackend() {
    fetch('http://localhost:3000/ajanlas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vegeredmeny)
    })
        .then(res => res.json())
        .then(data => console.log('Backend response:', data))
        .catch(err => console.error('Error sending results:', err));
}


function getSzazalekFromRow(data) {
    if (!data) return null;
    return data.szazalek ?? data.eredmeny ?? data.ertek ?? null;
}


window.handleAjanlas = function (data) {
    console.log('Raw row:', data);

    
    
    let tanacsok = data.tanacs.split(".,");
    const out = document.getElementById("resultArea");
    out.innerHTML = `
    <div class="card p-3">
      <h4>Eredmény</h4>
      <p class="mb-1"><strong>Kód (ezzel később is megnézheted az eredményed):</strong> ${data.kod}</p>
      <p class="mb-1"><strong>Kategória:</strong> ${data.status}</p>
      ${data.bmi !== null ? `<p class="mb-1"><strong>BMI:</strong> ${data.bmi}</p>` : `<p class="mb-1 text-muted">BMI kiszámításához add meg a testsúlyt és magasságot.</p>`}
      <hr>
      <h6>Ajánlások</h6>
     <ul>
        ${tanacsok.map(a => `<li>${a}</li>`).join("")}
      </ul>
    </div>
  `;

  
};

document.getElementById('lekeres').addEventListener('click', () => {
    const kod = document.getElementById('kod').value;

    fetch('/ajanlas/' + kod)
        .then(r => r.json())
        .then(data => {


            if (window.handleAjanlas) window.handleAjanlas(data);
        })
        .catch(err => { console.log('Hiba: ' + err); });
});