document.addEventListener("DOMContentLoaded", function () {
    initializeGraph();
    startDataStream();

    document.getElementById("endBtn").addEventListener("click", endDataStream);
    document.getElementById("continueBtn").addEventListener("click", resumeDataStream);
    document.getElementById("sinCheckbox").addEventListener("change", toggleDatasetVisibility);
    document.getElementById("cosCheckbox").addEventListener("change", toggleDatasetVisibility);

    // Počúvanie zmeny amplitúdy od používateľského prvku
    const amplitudeControl = document.querySelector("amplitude-control");
    amplitudeControl.addEventListener("amplitude-change", (event) => {
        amplitudeFactor = event.detail.value;
    });
});

let generatingGraph;
let eventSource;
let amplitudeFactor = 1; // Počiatočný faktor amplitúdy
let lastXValue = null; // Uložíme poslednú hodnotu x
let isStreaming = false; // Stav streamovania

// Inicializácia grafu
function initializeGraph() {
    const ctx = document.getElementById('generatingGraph').getContext('2d');
    generatingGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Noisy Sine',
                    data: [],
                    borderColor: 'rgb(255,0,0)',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    fill: false
                },
                {
                    label: 'Noisy Cosine',
                    data: [],
                    borderColor: 'rgb(0,72,255)',
                    backgroundColor: 'rgba(0,72,255, 0.2)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'none'
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y'
                    }
                }
            }
        }
    });
}

// Pridanie nových bodov s použitím aktuálnej amplitúdy
function addDataPoint(x, y1, y2) {
    generatingGraph.data.labels.push(x);
    generatingGraph.data.datasets[0].data.push(y1 * amplitudeFactor); // Aplikácia amplitúdy na sínus
    generatingGraph.data.datasets[1].data.push(y2 * amplitudeFactor); // Aplikácia amplitúdy na kosínus
    generatingGraph.update();
    lastXValue = x; // Aktualizácia poslednej hodnoty x
}

// Funkcia na pripojenie k SSE serveru a prijímanie dát
function startDataStream() {
    if (isStreaming) return; // Zamedzenie viacerému otvoreniu pripojenia
    isStreaming = true;

    eventSource = new EventSource('https://old.iolab.sk/evaluation/sse/sse.php');

    eventSource.onmessage = function(event) {
        const dataLine = JSON.parse(event.data);
        const x = parseFloat(dataLine.x);
        const y1 = parseFloat(dataLine.y1);
        const y2 = parseFloat(dataLine.y2);

        // Skontrolujeme, či x je väčšie ako lastXValue
        if (lastXValue === null || x > lastXValue) {
            addDataPoint(x, y1, y2); // Pridáme iba nové body
        }
    };

    eventSource.onerror = function(error) {
        console.error("Error loading SSE data:", error);
        eventSource.close();
        isStreaming = false;
    };
}

// Funkcia na ukončenie streamovania dát
function endDataStream() {
    if (eventSource) {
        eventSource.close(); // Zavrie pripojenie SSE
        console.log("Data stream ended");
        isStreaming = false; // Nastavenie stavu streamovania
    }
}

// Funkcia na obnovenie streamovania dát
function resumeDataStream() {
    if (!isStreaming) {
        startDataStream(); // Znovu otvorí pripojenie SSE
        console.log("Data stream resumed");
    }
}

// Funkcia na prepínanie viditeľnosti datasetov na základe checkboxov
function toggleDatasetVisibility() {
    const sinCheckbox = document.getElementById("sinCheckbox").checked;
    const cosCheckbox = document.getElementById("cosCheckbox").checked;

    generatingGraph.data.datasets[0].hidden = !sinCheckbox;
    generatingGraph.data.datasets[1].hidden = !cosCheckbox;

    generatingGraph.update();
}

// Custom Element pre Amplitude Control zostáva nezmenený...

class AmplitudeControl extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        const container = document.createElement('div');
        container.classList.add('amplitude-control');

        // Slider
        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = this.getAttribute('min') || '0';
        this.slider.max = this.getAttribute('max') || '5';
        this.slider.step = this.getAttribute('step') || '0.1';
        this.slider.value = this.getAttribute('value') || '1';
        this.slider.classList.add('slider');

        // Custom thumb (value display)
        this.valueDisplay = document.createElement('div');
        this.valueDisplay.classList.add('value-display');
        this.valueDisplay.textContent = this.slider.value;

        // Container for slider and value display
        const sliderWrapper = document.createElement('div');
        sliderWrapper.classList.add('slider-wrapper');
        sliderWrapper.appendChild(this.slider);
        sliderWrapper.appendChild(this.valueDisplay);

        // Checkbox for toggle
        this.toggleCheckbox = document.createElement('input');
        this.toggleCheckbox.type = 'checkbox';
        this.toggleCheckbox.checked = true;
        this.toggleCheckbox.classList.add('toggle-checkbox');

        const label = document.createElement('label');
        label.textContent = "Použiť slider";

        // Number input
        this.numberInput = document.createElement('input');
        this.numberInput.type = 'number';
        this.numberInput.min = this.slider.min;
        this.numberInput.max = this.slider.max;
        this.numberInput.step = this.slider.step;
        this.numberInput.value = this.slider.value;
        this.numberInput.classList.add('number-input');
        this.numberInput.style.display = 'none'; // Skryté na začiatku

        // Append elements
        container.appendChild(this.toggleCheckbox);
        container.appendChild(label);
        container.appendChild(sliderWrapper);
        container.appendChild(this.numberInput);
        this.shadowRoot.append(container);

        // Sync slider and display value
        this.syncValues = (value) => {
            this.slider.value = value;
            this.numberInput.value = value;
            this.valueDisplay.textContent = value;
            this.positionValueDisplay();
            this.dispatchEvent(new CustomEvent('amplitude-change', { detail: { value: parseFloat(value) } }));
        };

        this.slider.addEventListener('input', (event) => {
            this.syncValues(event.target.value);
        });

        this.numberInput.addEventListener('input', (event) => {
            this.syncValues(event.target.value);
        });

        // Toggle between slider and text input
        this.toggleCheckbox.addEventListener('change', () => {
            const useSlider = this.toggleCheckbox.checked;
            this.slider.style.display = useSlider ? 'inline-block' : 'none';
            this.valueDisplay.style.display = useSlider ? 'block' : 'none';
            this.numberInput.style.display = useSlider ? 'none' : 'inline-block';
        });

        // Initialize visibility
        this.slider.style.display = 'inline-block';
        this.valueDisplay.style.display = 'block';
        this.numberInput.style.display = 'none';

        // Styles for the component
        const style = document.createElement('style');
        style.textContent = `
            .amplitude-control {
                display: flex;
                align-items: center;
                gap: 8px;
                position: relative;
            }
            .slider-wrapper {
                position: relative;
                width: 100px;
            }
            .slider {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 8px;
                background: #ddd;
                border-radius: 5px;
                outline: none;
            }
            /* Custom thumb styling */
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 30px; /* Width of the custom thumb */
                height: 30px;
                background: transparent; /* Transparent to make it invisible */
                cursor: pointer;
            }
            .slider::-moz-range-thumb {
                width: 30px;
                height: 30px;
                background: transparent;
                cursor: pointer;
            }
            .value-display {
                position: absolute;
                top: -20px;
                left: 0;
                width: 30px;
                height: 30px;
                background-color: #007bff;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
                font-size: 12px;
                font-weight: bold;
                pointer-events: none;
            }
            .toggle-checkbox {
                margin-right: 8px;
            }
            .number-input {
                width: 60px;
            }
        `;
        this.shadowRoot.appendChild(style);

        // Set initial position of the value display
        this.positionValueDisplay();
    }

    positionValueDisplay() {
        const sliderRect = this.slider.getBoundingClientRect();
        const thumbPosition = ((this.slider.value - this.slider.min) / (this.slider.max - this.slider.min)) * sliderRect.width;
        this.valueDisplay.style.left = `${thumbPosition - 15}px`; // Adjust -15px to center align the box
    }
}

customElements.define('amplitude-control', AmplitudeControl);
