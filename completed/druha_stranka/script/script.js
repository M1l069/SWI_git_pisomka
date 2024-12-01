// funkcia na počítanie veku podľa zadaného dátumu narodenia
function calculateAge() {
    const dateOfBirth = document.getElementById("dot");
    const ageField = document.getElementById("age");
    const dateError = document.getElementById("date-error");

    // Vymaž existujúce chybové správy
    dateError.textContent = "";

    if (dateOfBirth.value) {
        const birthDate = new Date(dateOfBirth.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        if (age > 70) {
            dateOfBirth.style.borderColor = "red";
            dateError.textContent = "Zadaný dátum narodenia je príliš ďaleko v minulosti";
            return;
        }


        if (today < birthDate) {
            dateOfBirth.style.borderColor = "red";
            dateError.textContent = "Zadaný dátum narodenia je v budúcnosti";
            return;
        }


        if (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--; // Ak narodeniny ešte neboli tento rok, odpočítaj jeden rok
        }


        ageField.value = age;
    }
}

// odkrytie textového poľa na zadanie špeciálnej požiadavky vo forme checkboxu
function toggleHiddenText() {
    const checkbox = document.getElementById("otherOption");
    const hiddenText = document.getElementById("hiddenText");
    const textLabel = document.getElementById("hiddenTextLabel");
    const hiddenCharCount = document.getElementById("currentCharsOther");

    if (checkbox.checked) {
        hiddenText.style.display = "block"; // Zobrazenie textového poľa
        hiddenCharCount.style.display = "block"; // Zobrazenie počítadla znakov
        textLabel.style.display = "block"; // Zobrazenie labelu
        hiddenText.addEventListener("input", countChars); // Pridanie event listeneru na vstup
    } else {
        hiddenText.style.display = "none"; // Skrytie textového poľa
        textLabel.style.display = "none"; // Skrytie labelu
        hiddenCharCount.style.display = "none"; // Zobrazenie počítadla znakov
    }
}

// odkrytie textového poľa na zobrazenie mena autora vo forme buttonu
function toggleHiddenName() {
    const button = document.getElementById("displayNameOfCreator");
    const hiddenName = document.getElementById("nameOfCreator");
    const nameLabel = document.getElementById("creatorLabel");
    const hiddenCharCount = document.getElementById("currentCharsCreator");

    if (button.textContent === "Zobraziť meno autora") {
        hiddenName.style.display = "block";
        nameLabel.style.display = "block";
        button.textContent = "Skryť meno autora";
        hiddenCharCount.style.display = "block";
    }
    else {
        hiddenName.style.display = "none";
        nameLabel.style.display = "none";
        hiddenCharCount.style.display = "none";
        button.textContent = "Zobraziť meno autora";
    }
}

//odkrytie textových polí na prezývky ďaľších hráčov
document.getElementById("firstRadio").addEventListener("change", revealNameInputs);
document.getElementById("secondRadio").addEventListener("change", revealNameInputs);
document.getElementById("thirdRadio").addEventListener("change", revealNameInputs);

function createPlayer1And2() {
    const nameBox = document.getElementById("nameBox");

    nameBox.classList.remove("hidden-box-usernames");
    const firstBox = document.createElement("div");
    nameBox.appendChild(firstBox);
    firstBox.classList.add("dot-section");
    firstBox.innerHTML = `<label for="firstPlayer">Meno prvého hráča:</label> 
            <input type="text" name="meno_prveho_hraca" id="firstPlayer" class="text-input" placeholder="Janko">
            <span class="char-count">0/30</span>
            <p class="error-text"></p>`;
    const secondBox = document.createElement("div");
    nameBox.appendChild(secondBox);
    secondBox.classList.add("age-section");
    secondBox.innerHTML = `<label for="secondPlayer">Meno druhého hráča:</label>
            <input type="text" name="meno_druheho_hraca" id="secondPlayer" class="text-input" placeholder="Janko">
            <span class="char-count">0/30</span>
            <p class="error-text"></p>`;

    document.getElementById("firstPlayer").addEventListener('input', countChars);
    document.getElementById("secondPlayer").addEventListener('input', countChars);
}

function createPlayer3() {
    const nameBox = document.getElementById("nameBox");

    const nameBox2 = document.createElement("div");
    nameBox2.classList.add("form-element-box");
    nameBox2.id = "nameBox2";
    const thirdBox = document.createElement("div");
    nameBox2.appendChild(thirdBox);
    thirdBox.classList.add("dot-section");
    thirdBox.innerHTML = `<label for="thirdPlayer">Meno tretieho hráča:</label>
                        <input type="text" name="meno_tretieho_hraca" id="thirdPlayer" class="text-input" placeholder="Janko">
                        <span class="char-count">0/30</span>
                        <p class="error-text"></p>`;

    nameBox.parentNode.insertBefore(nameBox2, nameBox.nextSibling);

    document.getElementById("thirdPlayer").addEventListener('input', countChars);
}

function createPlayer4() {
    const nameBox2 = document.getElementById("nameBox2");

    const fourthBox = document.createElement("div");
    nameBox2.appendChild(fourthBox);
    fourthBox.classList.add("age-section");
    fourthBox.innerHTML = `<label for="fourthPlayer">Meno štvrtého hráča:</label>
                        <input type="text" name="meno_stvrteho_hraca" id="fourthPlayer" class="text-input" placeholder="Janko">
                        <span class="char-count ">0/30</span>
                        <p class="error-text"></p>`;
    document.getElementById("fourthPlayer").addEventListener('input', countChars);
}

function clearNameInputs() {
    const nameBox2 = document.getElementById("nameBox2");
    // Ak existuje druhý nameBox (pre tretieho a štvrtého hráča), vymaže sa
    if (nameBox2) {
        nameBox2.remove();
    }
}

function revealNameInputs() {
    // id radio buttonov, podľa ktorých sa odkryjú polia firstRadio, secondRadio, thirdRadio
    const firstRadio = document.getElementById("firstRadio");
    const secondRadio = document.getElementById("secondRadio");
    const thirdRadio = document.getElementById("thirdRadio");

    clearNameInputs();


    if (firstRadio.checked) {
        if (!document.getElementById("firstPlayer") && !document.getElementById("secondPlayer")) {
            createPlayer1And2();
        }
    }

    if (secondRadio.checked) {
        if (document.getElementById("firstPlayer") && document.getElementById("secondPlayer")) {
            if (!document.getElementById("thirdPlayer")) {
                createPlayer3();
            }
        }
        if (!document.getElementById("firstPlayer") && !document.getElementById("secondPlayer") && !document.getElementById("thirdPlayer")) {
            createPlayer1And2();
            createPlayer3();
        }
    }

    if(thirdRadio.checked) {
        if (document.getElementById("firstPlayer") && document.getElementById("secondPlayer") && document.getElementById("thirdPlayer")) {
            if (!document.getElementById("fourthPlayer")) {
                createPlayer4();
            }
        }

        else if(document.getElementById("firstPlayer") && document.getElementById("secondPlayer")) {
            if (!document.getElementById("thirdPlayer")) {
                createPlayer3();
            }
            if (!document.getElementById("fourthPlayer")) {
                createPlayer4();
            }
        }

        else if (!document.getElementById("firstPlayer") && !document.getElementById("secondPlayer") && !document.getElementById("thirdPlayer") && !document.getElementById("fourthPlayer")) {
            createPlayer1And2();
            createPlayer3();
            createPlayer4();
        }
    }
}

// Počítanie znakov v textovom poli
function countChars(event) {

    const inputElement = event.target;
    const maxLength = 30;
    const textAreaMaxLength = 150;
    const counter = document.querySelector(`#${inputElement.id} ~ span.char-count`);
    const error = document.querySelector(`#${inputElement.id} ~ p.error-text`);




    if ((inputElement.id !== "message") && (inputElement.id !== "age") && (inputElement.value.length > maxLength)) {

        inputElement.value = inputElement.value.substring(0, maxLength);
        if (error) {
            error.textContent = `Pole môže mať maximálne ${maxLength} znakov.`;
        }
        inputElement.style.borderColor = "red";
    } else if((inputElement.id !== "message") && (inputElement.id !== "age") && (inputElement.value.length <= maxLength)){
        if (error) {
            error.textContent = "";
        }
        inputElement.style.borderColor = "";
        if (counter) {
            counter.textContent = `${inputElement.value.length}/${maxLength}`;
        }
    }
    else if ( (inputElement.id === "message") && (inputElement.value.length <= textAreaMaxLength)) {
        if (error) {
            error.textContent = "";
        }
        inputElement.style.borderColor = "";
        if (counter) {
            counter.textContent = `${inputElement.value.length}/${textAreaMaxLength}`;
        }
    }

    else if ((inputElement.id === "message") && (inputElement.value.length > textAreaMaxLength)) {

        inputElement.value = inputElement.value.substring(0, textAreaMaxLength);
        if (error) {
            error.textContent = `Pole môže mať maximálne ${textAreaMaxLength} znakov.`;
        }
        inputElement.style.borderColor = "red";
    }
}

// aplikovanie countChars na všetky inputy a textarea
const inputsWithCounter = document.querySelectorAll('input.text-input, textarea');

inputsWithCounter.forEach(input => {
    input.addEventListener('input', countChars);
});

// kontrola emailovej adresy
function validateEmail() {
    const mail = document.getElementById("email");
    const error = document.querySelector(`#${mail.id} ~ p.error-text`);


    mail.style.borderColor = "";
    error.textContent = "";

    if (!mail.value.includes("@")) {
        mail.style.borderColor = "red";
        error.textContent = "Emailová adresa musí obsahovať znak @";
        return;
    }

    if (!mail.value.includes(".")) {
        mail.style.borderColor = "red";
        error.textContent = "Emailová adresa musí obsahovať bodku";
        return;
    }


    const atIndex = mail.value.indexOf("@");
    if (atIndex < 3) {
        mail.style.borderColor = "red";
        error.textContent = "Pred znakom @ musí byť aspoň 3 znaky";
        return;
    }


    if (mail.value.substring(atIndex + 1, mail.value.lastIndexOf(".")).length < 3) {
        mail.style.borderColor = "red";
        error.textContent = "Za znakom @ musí byť aspoň 3 znaky";
        return;
    }

    const topDomainPart = mail.value.substring(mail.value.lastIndexOf(".") + 1);
     if (topDomainPart.length < 2 || topDomainPart.length > 4) {
        mail.style.borderColor = "red";
        error.textContent = "Za bodkou musí byť aspoň 2 až 4 znaky";
     }
}

document.getElementById("email").addEventListener("input", validateEmail);

// kotrola telefónneho cisla
function validatePhoneNumber() {
    const phoneNumber = document.getElementById("number");
    const error = document.querySelector(`#${phoneNumber.id} ~ p.error-text`);

    phoneNumber.style.borderColor = "";
    error.textContent = "";
    //kontrola či číslo obsahuje + alebo 00 na začiatku
    if (phoneNumber.value.indexOf("+") !== 0 || (phoneNumber.value.indexOf("0") !== 0 && phoneNumber.value.indexOf("0") !== 1)) {

        if (phoneNumber.value.startsWith("+") && !phoneNumber.value.startsWith("00")) {}

        if (phoneNumber.value.startsWith("00") && !phoneNumber.value.startsWith("+")) {}

        if (!phoneNumber.value.startsWith("+") && !phoneNumber.value.startsWith("00")) {
            phoneNumber.style.borderColor = "red";
            error.textContent = "Číslo musí na začiatku obsahovať + alebo 00";
        }
    }

    //kontrola či číslo obsahuje písmeno
    if (isNaN(phoneNumber.value)) {
        phoneNumber.style.borderColor = "red";
        error.textContent = "Číslo nesmie obsahovať písmená";
    }

    //kontrola či číslo je dostatočne dlhé ak neobsahuje medzeru
    if (!phoneNumber.value.includes(" ")) {
        if (phoneNumber.value.indexOf("+") === 0 || (phoneNumber.value.indexOf("0") === 0 && phoneNumber.value.indexOf("0") === 1)) {
            if (phoneNumber.value.indexOf("+") === 0) {
                if (phoneNumber.value.length < 11 || phoneNumber.value.length > 13) {
                    phoneNumber.style.borderColor = "red";
                    error.textContent = "Číslo nie je dostatočne dlhé alebo je príliš krátke s predvoľbou +";
                }

            }

            if (phoneNumber.value.indexOf("0") === 0 && phoneNumber.value.indexOf("0") === 1) {
                if (phoneNumber.value.length < 11 || phoneNumber.value.length > 11) {
                    phoneNumber.style.borderColor = "red";
                    error.textContent = "Číslo musí mať pre predvoľbu 00 11 číslic";
                }
            }
        }
    }

    else {
       phoneNumber.style.borderColor = "red";
       error.textContent = "Číslo píšte bez medzery";
    }
}

document.getElementById("number").addEventListener("input", validatePhoneNumber);

// previazanie troch rozbaľovaacích zoznamov
function chainedSelects() {
    var selectedOption = document.getElementById('states');
    var vypisMiest = document.getElementById("cities");
    var vypisAdries = document.getElementById("addresses");

    // Zoznam miest
    var zoznamMiest = new Array();
    zoznamMiest["Slovensko"] = ["Bratislava", "Košice", "Dolný Kubín"];
    zoznamMiest["Česko"] = ["Praha", "Brno", "Ostrava"];
    zoznamMiest["Rakúsko"] = ["Graz", "Salzburg", "Berg"];

    // Zoznam adries
    var zoznamAdries = new Array();
    zoznamAdries["Bratislava"] = ["Dolnozemská 17", "Rumančeková 22", "Hradská 60"];
    zoznamAdries["Košice"] = ["Biela 13", "Gorkého 36", "Kadlubská 8"];
    zoznamAdries["Dolný Kubín"] = ["Janoškova 3", "Chočská 19", "Matúškova 19"];
    zoznamAdries["Praha"] = ["Batelovská 2", "Bohuslavická 26", "Jahodová 33"];
    zoznamAdries["Brno"] = ["Holzova 12", "Údolní 31", "Černovická 5"];
    zoznamAdries["Ostrava"] = ["Hrabová 4", "Čapkova 7", "Denisova 20"];
    zoznamAdries["Graz"] = ["Abstaller 26", "Haffner 18", "Ragnitz 15"];
    zoznamAdries["Salzburg"] = ["Dietrichstein 41", "Mauermann 29", "Hagenau 1"];
    zoznamAdries["Berg"] = ["Rainer 13", "Otilo 16", "Eich 20"];


    function initialize() {
        selectedOption.value = "Slovensko"; // Predvolený štát: Slovensko
        updateCities("Slovensko");          // Načítaj mestá pre Slovensko
        updateAddresses("Bratislava"); // Načítaj adresy pre Bratislavu
    }


    function updateCities(countryCode) {
        var cities = zoznamMiest[countryCode];
        vypisMiest.options.length = 0; // Vymaže staré možnosti
        cities.forEach(function(city) {
            vypisMiest.options[vypisMiest.options.length] = new Option(city);
        });

        updateAddresses(cities[0]);
    }


    function updateAddresses(city) {
        var addresses = zoznamAdries[city];
        vypisAdries.options.length = 0; // Vymaže staré adresy
        addresses.forEach(function(address) {
            vypisAdries.options[vypisAdries.options.length] = new Option(address);
        });
    }


    selectedOption.onchange = function() {
        var selectedCountry = selectedOption.value;
        updateCities(selectedCountry);
    };


    vypisMiest.onchange = function() {
        var selectedCity = vypisMiest.value;
        updateAddresses(selectedCity);  // Aktualizuje adresy pre vybrané mesto
    };


    initialize();
}

// Inicializácia funkcie pri načítaní stránky
document.addEventListener("DOMContentLoaded", chainedSelects);

const subButton = document.getElementById("subButton");

subButton.addEventListener("click", function(event) {
    event.preventDefault();
    checkMandatoryInformation();
});

function checkMandatoryInformation() {

    const requiredElements = document.querySelectorAll('input.text-input, textarea, select, input[type="date"], input[type="checkbox"], input[type="radio"]');
    const summaryContainer = document.getElementById("summary");
    const genderMale = document.getElementById("male");
    const genderFemale = document.getElementById("female");
    const genderOther = document.getElementById("other");

    for (let element of requiredElements) {
        if (element.style.borderColor === "red") {
            return;
        }

        if (element.value === "" && element.type !== "checkbox" && element.type !== "radio" && element.type !== "textarea" && element.id !== "hiddenText") {
            return;
        }
    }

    if (!genderMale.checked && !genderFemale.checked && !genderOther.checked) {
        return;
    }

    const form = document.getElementById("form");
    form.style.visibility = "hidden";

    summaryContainer.innerHTML = "";
    summaryContainer.classList.remove("form-summary");
    summaryContainer.classList.add("form-summary-success");

    const summaryBox = document.createElement("div");
    summaryBox.classList.add("form-summary-success-box");

    summaryBox.innerHTML = `<h2>Meno:</h2>
                            <p>${document.getElementById("name").value}</p>
                            <h2>Priezvisko:</h2>
                            <p>${document.getElementById("surename").value}</p>
                            <h2>Pohlavie:</h2> 
                            <p>${genderMale.checked ? "Muž" : genderFemale.checked ? "Žena" : "Iné"}</p>
                            <h2>Dátum narodenia:</h2>
                            <p>${document.getElementById("dot").value}</p>
                            <h2>Vek:</h2>
                            <p>${document.getElementById("age").value}</p>
                            <h2>Email:</h2>
                            <p>${document.getElementById("email").value}</p>
                            <h2>Telefónne číslo:</h2>
                            <p>${document.getElementById("number").value}</p>
                            <h2>Štát:</h2>
                            <p>${document.getElementById("states").value}</p>
                            <h2>Mesto:</h2> 
                            <p>${document.getElementById("cities").value}</p>
                            <h2>Adresa:</h2>    
                            <p>${document.getElementById("addresses").value}</p>
                            <h2>Špeciálne požiadavky:</h2>
                            <p>${document.getElementById("firstOption").checked ? "Špeciálne kolky" : ""}</p>
                            <p>${document.getElementById("secondOption").checked ? "Špeciálne lopty" : ""}</p>
                            <p>${document.getElementById("otherOption").checked ? document.getElementById("hiddenText").value : "Žiadne"}</p>
                            <h2>Pripomienky:</h2>
                            <p>${document.getElementById("message").value}</p>    
                            <h2>Meno autora:</h2>
                            <p>${document.getElementById("displayNameOfCreator").textContent === "Skryť meno autora" ? document.getElementById("nameOfCreator").value : ""}</p>
                            <h2>Mená hráčov: </h2>
                            <p>${document.getElementById("firstPlayer") ? document.getElementById("firstPlayer").value : ""}</p>
                            <p>${document.getElementById("secondPlayer") ? document.getElementById("secondPlayer").value : ""}</p>
                            <p>${document.getElementById("thirdPlayer") ? document.getElementById("thirdPlayer").value : ""}</p>
                            <p>${document.getElementById("fourthPlayer") ? document.getElementById("fourthPlayer").value : ""}</p>`;


    const cancelButton = document.createElement("button");
    cancelButton.classList.add("submit-button");
    cancelButton.textContent = "Vrátiť sa k formuláru";
    cancelButton.style.marginBottom = "2%";
    cancelButton.addEventListener("click", function() {
        form.style.visibility = "visible";
        summaryContainer.innerHTML = "";
        summaryContainer.classList.remove("form-summary-success");
        summaryContainer.classList.add("form-summary");
    });

    summaryBox.appendChild(cancelButton);
    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Odoslať";
    submitButton.classList.add("submit-button");
    submitButton.addEventListener("click", function() {
        form.submit();
    });
    summaryBox.appendChild(submitButton);

    summaryContainer.appendChild(summaryBox);
}








