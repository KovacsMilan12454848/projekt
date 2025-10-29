window.addEventListener("DOMContentLoaded", () => {

    async function fetchAdat() {

        const response = await fetch('http://localhost:3000/statisztikak');
        const data = await response.json();
        const tarto = document.getElementById("abracont")

        const adatok = diagramadat(kerdesek, data)

        const felirat = Object.keys(adatok);
        var row = document.createElement("div");
        row.className = "row gx-1 my-2";

        console.log(Object.keys(adatok[felirat[0]]));


        for (let i = 0; i < felirat.length; i++) {
            if (i % 3 == 0) {
                row = document.createElement("div");
                row.className = "row gx-1 my-2";
                tarto.appendChild(row);
            }


            const col = document.createElement("div");

            col.className = "col-md-4 col-sm-12"

            col.innerHTML += `

      <h3 class="text-center my-2">${felirat[i]}</h3>
      <div class="d-flex justify-content-center">
        <canvas id="${i}" style="scale: 0.7;"></canvas>
      </div>
    `;

            row.appendChild(col)
            var nem = new Chart(document.getElementById(i), {
                type: 'pie',
                data: {
                    labels: Object.keys(adatok[felirat[i]]),
                    datasets: [{
                        label: '# of Votes',
                        data: Object.values(adatok[felirat[i]]),
                    }]
                },
                options: {
                    responsive: true,
                }
            });

            nem.update();

        }

    }

    function diagramadat(kerdesek, data) {
        const res = {};


        kerdesek.forEach(k => {
            res[k.tipus] = {};
            k.valaszok.forEach(option => {
                res[k.tipus][option] = 0;
            });
        });


        const map = {
            halott: "Halott-e",
            haigenhonnan: "Honnan halott",
            nemzetiseg: "Nemzetiség",
            orszag: "Ország",
            nem: "Nem",
            lakhely: "Lakhely",
            kor: "Életkor",
            egeszsegallapot: "Egészségi állapot",
            vegzettseg: "Végzettség"
        };


        data.forEach(row => {
            for (const [field, tipus] of Object.entries(map)) {
                const valasz = row[field];
                if (res[tipus] && res[tipus][valasz] !== undefined) {
                    res[tipus][valasz]++;
                }
            }
        });


        return res;
    }

    fetchAdat();
});
