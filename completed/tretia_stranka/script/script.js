//Chart.register(ChartDataLabels);
let myChart;
let labels = [];
let datasets = [];

function loadXMLData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "xml/z03.xml", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xmlText = xhr.responseText;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            labels = [];
            const data = {
                A: [],
                B: [],
                C: [],
                D: [],
                E: [],
                FX: [],
                FN: []
            };

            const zaznamElements = xmlDoc.getElementsByTagName("zaznam");
            let roky = 2023;
            for (let i = 0; i < zaznamElements.length; i++) {
                const zaznam = zaznamElements[i];
                const rok = zaznam.getElementsByTagName("rok")[0].textContent;
                const hodnotenie = zaznam.getElementsByTagName("hodnotenie")[0];

                labels.push(rok);

                data.A.push(parseInt(hodnotenie.getElementsByTagName("A")[0].textContent));
                data.B.push(parseInt(hodnotenie.getElementsByTagName("B")[0].textContent));
                data.C.push(parseInt(hodnotenie.getElementsByTagName("C")[0].textContent));
                data.D.push(parseInt(hodnotenie.getElementsByTagName("D")[0].textContent));
                data.E.push(parseInt(hodnotenie.getElementsByTagName("E")[0].textContent));
                data.FX.push(parseInt(hodnotenie.getElementsByTagName("FX")[0].textContent));
                data.FN.push(parseInt(hodnotenie.getElementsByTagName("FN")[0].textContent));

                const pieData = [
                    parseInt(hodnotenie.getElementsByTagName("A")[0].textContent),
                    parseInt(hodnotenie.getElementsByTagName("B")[0].textContent),
                    parseInt(hodnotenie.getElementsByTagName("C")[0].textContent),
                    parseInt(hodnotenie.getElementsByTagName("D")[0].textContent),
                    parseInt(hodnotenie.getElementsByTagName("E")[0].textContent),
                    parseInt(hodnotenie.getElementsByTagName("FX")[0].textContent),
                    parseInt(hodnotenie.getElementsByTagName("FN")[0].textContent)
                ];

                createPieChart(`zs${roky}`, pieData, rok); // Pridáme rok ako parameter
                roky--;
            }

            datasets = [
                { label: 'A', data: data.A, backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
                { label: 'B', data: data.B, backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 },
                { label: 'C', data: data.C, backgroundColor: 'rgba(255, 206, 86, 0.6)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 1 },
                { label: 'D', data: data.D, backgroundColor: 'rgba(255, 99, 132, 0.6)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 },
                { label: 'E', data: data.E, backgroundColor: 'rgba(153, 102, 255, 0.6)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1 },
                { label: 'FX', data: data.FX, backgroundColor: 'rgba(255, 159, 64, 0.6)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1 },
                { label: 'FN', data: data.FN, backgroundColor: 'rgba(201, 203, 207, 0.6)', borderColor: 'rgba(201, 203, 207, 1)', borderWidth: 1 }
            ];

            initializeChart();
        }
    };
    xhr.send();
}

// Funkcia na vytvorenie hlavného stĺpcového grafu
function createChart(horizontal = false) {
    console.log(`Vytvára sa stĺpcový graf`);
    const ctx = document.getElementById('myBarChart').getContext('2d');

    const options = {
        type: 'bar',
        data: {
            labels: labels, // Roky ako štítky na osi X
            datasets: datasets // Datasety pre jednotlivé známky
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: horizontal ? 'y' : 'x', // Orientácia grafu
            scales: {
                x: {
                    stacked: false, // Zobrazí jednotlivé známky vedľa seba
                    title: {
                        display: true,
                        text: horizontal ? 'Počet študentov' : 'Rok'
                    }
                },
                y: {
                    beginAtZero: true,
                    stacked: false, // Zobrazí jednotlivé známky vedľa seba
                    title: {
                        display: true,
                        text: horizontal ? 'Rok' : 'Počet študentov'
                    }
                }
            }
        }
    };

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, options);
}

// Nová funkcia na vytvorenie koláčového grafu pre daný rok
function createPieChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const total = data.reduce((acc, val) => acc + val, 0);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['A', 'B', 'C', 'D', 'E', 'FX', 'FN'],
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(201, 203, 207, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${percentage}% (${value})`;
                        }
                    }
                },
                datalabels: {
                    formatter: (value, context) => {
                        const percentage = ((value / total) * 100).toFixed(1);
                        //return percentage === "0.0" ? '' : `${percentage}%`;
                    },
                    color: '#333', // Zmeňte farbu na tmavšiu pre lepšiu čitateľnosť
                    font: {
                        weight: 'bold',
                        size: 12 // Mierne zmenšite veľkosť textu
                    },
                    anchor: 'end', // Nastaví umiestnenie mimo okraj koláča
                    align: 'start', // Zosúladí text do začiatku (mimo koláč)
                    offset: 10 // Pridá vzdialenosť od stredu koláča
                }
            }
        }
    });
}
// Ostatné pomocné funkcie
function rotateChart() {
    createChart(true);
}

function resetChart() {
    createChart(false);
}

function checkScreenSize() {
    if (window.matchMedia("(max-width: 768px)").matches) {
        rotateChart(); // Otočí graf pri šírke obrazovky 768px alebo menej
    } else {
        resetChart(); // Vráti graf do pôvodnej orientácie pri väčších rozlíšeniach
    }
}

function initializeChart() {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Dáta pre čiarový graf
const lineChartData = {
    labels: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
    datasets: [{
        label: 'Teplota v °C',
        data: [-1, 0.8, 5.2, 9.8, 15.1, 17.8, 19.9, 19.8, 15.3, 9.9, 3.7, 0.4],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true, // Vypĺňa oblasť pod čiarou
        tension: 0.4 // Ohnutie čiary (0 = rovná, 1 = veľmi zakrivená)
    }]
};

// Konfigurácia čiarového grafu
const lineChartConfig = {
    type: 'line',
    data: lineChartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Mesiac'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Teplota (°C)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `Teplota: ${context.raw} °C`;
                    }
                }
            }
        }
    }
};

// Vykreslenie grafu
const lineChartCtx = document.getElementById('myLineChart').getContext('2d');
new Chart(lineChartCtx, lineChartConfig);

document.addEventListener("DOMContentLoaded", function () {
    loadXMLData();
});



