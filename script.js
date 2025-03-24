const input = document.getElementById('cityInput');
const inputArriver = document.getElementById('villeArriver');
const resultsDiv = document.getElementById('results');
const resultsDiv2 = document.getElementById('results2');
const loadingDiv = document.getElementById('loading');
const loadingDiv2 = document.getElementById('loading2');
const date = document.getElementById('date');
const heureDepart = document.getElementById('time');
const boutonRecherche = document.getElementById('rechercheDepart');
const boutonRecherche2 = document.getElementById('RechercheArrivee');
const date2 = document.getElementById('date2');
const heureArriver = document.getElementById('time2');


const departureRadio = document.getElementById('departureSearch');
const arrivalRadio = document.getElementById('arrivalSearch');
const departureBlock = document.getElementById('departureBlock');
const arrivalBlock = document.getElementById('arrivalBlock');

const ligneItineraire = document.querySelector('.itineraire');

// affichage des icônes de transport dans la ligne itinéraire
let iconTGV = () => "<img id='icon-tgv' src='images/tgv-front.svg' alt='Icone train grande vitesse' />";
let iconTMD = () => "<img id='icon-TMD' src='images/ter-front.svg' alt='Icone train moyenne distance' />";
let iconBus = () => "<img id='icon-bus' src='images/bus-front.svg' alt='Icone autocar' />";

let codeInseeArriver 
let codeInseeDepart 
let dateDepart 
let timeoutId;
let timeStart

let dateArriver
let timeEnd

// Initialisation de l'interface
window.addEventListener('DOMContentLoaded', () => {
    // Par défaut, afficher le bloc de recherche par départ et cacher le bloc de recherche par arrivée
    departureBlock.style.display = 'block';
    arrivalBlock.style.display = 'none';
});

// Gestion des boutons radio pour changer le type de recherche
departureRadio.addEventListener('change', () => {
    if (departureRadio.checked) {
        departureBlock.style.display = 'block';
        arrivalBlock.style.display = 'none';
    }
});

arrivalRadio.addEventListener('change', () => {
    if (arrivalRadio.checked) {
        departureBlock.style.display = 'none';
        arrivalBlock.style.display = 'block';
    }
});

//---------------------Ville Depart---------------------


// Détecte la saisie utilisateur avec délai de 300ms
input.addEventListener('input', (e) => {
    clearTimeout(timeoutId);
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        resultsDiv.innerHTML = '';
        return;
    }

    timeoutId = setTimeout(() => searchCity(query), 300);
});

async function searchCity(query) {
    try {
        loadingDiv.style.display = 'block';
        resultsDiv.innerHTML = '';

        const response = await fetch(
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=code,nom,codesPostaux&limit=5`
        );

        if (!response.ok) throw new Error('Erreur API');
        
        const cities = await response.json();
        
        if (cities.length === 0) {
            resultsDiv.innerHTML = 'Aucun résultat trouvé';
            return;
        }

        // Affiche les résultats
        ligneItineraire.innerHTML = ``
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = cities.map(city => `
            <div class="result-item" 
                 data-code="${city.code}"
                 style="padding: 5px; cursor: pointer; border-bottom: 1px solid #eee;">
                ${city.nom} (CP: ${city.codesPostaux[0]}) - INSEE: ${city.code}
            </div>
        `).join('');

        // Gère le clic sur un résultat
        document.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.textContent.split(' - ')[0].trim();
                resultsDiv.innerHTML = `${item.dataset.code}`;
                codeInseeDepart = `admin:fr:${item.dataset.code}`;
                console.log(codeInseeDepart)
                resultsDiv.style.display = 'none';
                return codeInseeDepart
                //alert(`Code INSEE sélectionné : ${item.dataset.code}`);
            });
        });

    } catch (error) {
        resultsDiv.innerHTML = 'Erreur lors de la recherche';
        console.error(error);
    } finally {
        loadingDiv.style.display = 'none';
    }
    
}



//---------------------Ville Arriver---------------------
villeArriver.addEventListener('input', (e) => {
    clearTimeout(timeoutId);
    const villeData = e.target.value.trim();
    
    if (villeData.length < 3) {
        resultsDiv2.innerHTML = '';
        return;
    }

    timeoutId = setTimeout(() => searchCityArriver(villeData), 300);
});

async function searchCityArriver(villeData) {
    try {
        loadingDiv2.style.display = 'block';
        resultsDiv2.innerHTML = '';

        const response = await fetch(
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(villeData)}&fields=code,nom,codesPostaux&limit=5`
        );

        if (!response.ok) throw new Error('Erreur API');
        
        const cities2 = await response.json();
        
        if (cities2.length === 0) {
            resultsDiv2.innerHTML = 'Aucun résultat trouvé';
            return;
        }

        // Affiche les résultats
        resultsDiv2.style.display = 'block';
        resultsDiv2.innerHTML = cities2.map(city => `
            <div class="result2-item" 
                 data-code="${city.code}"
                 style="padding: 5px; cursor: pointer; border-bottom: 1px solid #eee;">
                ${city.nom} (CP: ${city.codesPostaux[0]}) - INSEE: ${city.code}
            </div>
        `).join('');

        // Gère le clic sur un résultat
        document.querySelectorAll('.result2-item').forEach(item2 => {
            item2.addEventListener('click', () => {
                
                inputArriver.value = item2.textContent.split(' - ')[0].trim();
                resultsDiv2.innerHTML = `${item2.dataset.code}`;
            
                codeInseeArriver = `admin:fr:${item2.dataset.code}`
                resultsDiv2.style.display = 'none';
                console.log(codeInseeArriver)
                return codeInseeArriver
                
                //alert(`Code INSEE sélectionné : ${item.dataset.code}`);
            });
        });

    } catch (error) {
        resultsDiv2.innerHTML = 'Erreur lors de la recherche';
        console.error(error);
    } finally {
        loadingDiv2.style.display = 'none';
    }
    
    
}




//-----------------------Fonction API départ a partir d'une heure----------------------

date.addEventListener('input', (e) => {
   const dateDepartChoix = e.target.value.split('-').join('').trim();
   dateDepart = dateDepartChoix
    console.log(dateDepart)
});

heureDepart.addEventListener('input', (e) => {
    const heureDepartChoix = e.target.value.split(':').join('').trim();
    timeStart = `${heureDepartChoix}00`
    console.log(timeStart)
})


boutonRecherche.addEventListener('click', () => {
    searchJourneys()
})

const apiKey = 'f3a26e07-0df5-48e8-b17a-b9d05b5a820a'
async function searchJourneys() {
    try {
        const apiDepart = `https://api.navitia.io/v1/coverage/sncf/journeys?to=${codeInseeArriver}&from=${codeInseeDepart}&datetime_represents=departure&datetime=${dateDepart}T${timeStart}&min_nb_journeys=3&`
        
        const response = await fetch(apiDepart, { headers: { Authorization: apiKey }
        });
        
        const data = await response.json();
        console.log(data);  // Vérifiez les données dans la console

        const journey = data.journeys
        //console.log(journey)
        
        for (y=0 ; y < journey.length ; y++){
            
            const itinerary = journey[y].sections
            // console.log(itinerary)

             // --------- Récupération latitude et longitude ------------
            // Coordonnées de départ (section 1)
            const departureSection = itinerary[1];
            const departureCoords = departureSection?.from?.stop_point?.coord || {};
            
            // Coordonnées d'arrivée (dernière section de transport)
            const arrivalSection = itinerary.findLast(s => s.type === 'public_transport');
            const arrivalCoords = arrivalSection?.to?.stop_point?.coord || {};

            departLatitude = departureCoords.lat
            departLongitude = departureCoords.lon
            arriveeLatitude = arrivalCoords.lat
            arriveeLongitude = arrivalCoords.lon
            
            // ------ Fin de récupération de latitude et longitude ------------

            let departureTime = formatTime(journey[y].departure_date_time)
            let arrivalTime = formatTime(journey[y].arrival_date_time)

            let fullItinerary = ''; // Variable pour cumuler/joindre les portions d'itinéraires
            let visitedCities = []; // Track cities to avoid duplication
            let journeySteps = []; // Store the names of cities as steps

            for (i=0 ; i < itinerary.length ; i++ ) {
    
                const itineraryType = itinerary[i].type
                let currentCity = ''; // Variable to hold the current city's name
                let itineraryElement = ''; // Variable pour contenir la chaîne HTML pour chaque portion d'itinéraire

                // Fonction pour extraire uniquement le nom de la ville sans la région entre parenthèses
                const getCityName = (location) => {
                    return location.name.split(' (')[0]; 
                };
            
                switch (itineraryType) {
                    
                    case "public_transport":
                        // let departureName = getCityName(itinerary[i].from);
                        // let arrivalName = getCityName(itinerary[i].to);
                        let public_tranport = itinerary[i].display_informations.physical_mode

                        // // console.log(`${departureName} (${departureTime})`)
                        // // console.log(`${arrivalName} (${arrivalTime})`)
                        // // console.log(public_tranport)

                        // --Ajout des gares de depart et d'arriver sur la carte--
                        addGareDepart(departLatitude, departLongitude, departureName)
                        addGareArriver(arriveeLatitude, arriveeLongitude, arrivalName)
                        // --Fin de l'ajout des gares de depart et d'arriver sur la carte--
                       
                        currentCity = getCityName(itinerary[i].from); // Ville de départ
                        if (!visitedCities.includes(currentCity)) {
                            visitedCities.push(currentCity); // Ajouter si non déjà ajouté
                            journeySteps.push(currentCity); // Ajouter à l'itinéraire
                        }
                    
                        // Ajout du transport TGV
                        itineraryElement = `${iconTGV()}`;
                        if (public_tranport === "Train grande vitesse"){
                            itineraryElement = `${iconTGV()}`;
                        } else if (public_tranport === "TER / Intercités"){
                            itineraryElement = `${iconTMD()}`;
                        } else if (public_tranport === "Autocar"){
                            itineraryElement = `${iconBus()}`
                        } else 

                        // if (public_tranport === "Train grande vitesse"){
                        //     itineraryElement = `${departureName} ${iconTGV()} ${arrivalName} > `;
                        // } else if (public_tranport === "TER / Intercités"){
                        //     itineraryElement = `${departureName} ${iconTMD()} ${arrivalName} > `;
                        // } else if (public_tranport === "Autocar"){
                        //     itineraryElement = `${departureName} ${iconBus()} ${arrivalName} > `;
                        // } else 

                        break
                    
                    case "waiting":
                        // console.log(departureTime)
                        // console.log(arrivalTime)
                        // itineraryElement = ` correspondance > `
                        break
    
                    case "crow_fly":
                        // console.log("marche")
                        break
    
                    default :
                        // console.log("autre type")
                }

                // // Joint la portion d'itinéraire au fullItinerary
                // fullItinerary += `<span>${itineraryElement}</span>`;

                // Si l'étape est un transport ou une ville qui n'a pas été ajoutée, on l'ajoute
                fullItinerary += `${journeySteps.join(' > ')} ${itineraryElement} > `;
                
                // if (itineraryElement !== "Correspondance") {
                //     fullItinerary += `${journeySteps.join(' > ')} ${itineraryElement} > `;
                // }
            }

                // console.log(itineraryElement);
                
            
            
            if (ligneItineraire) {
                ligneItineraire.innerHTML += `<div>${departureTime} > ${fullItinerary}> ${arrivalTime}</div>`;
            }

        }

        
    } catch (error) {
        console.error(error);
    }
}

// sortir du format "YYYYMMDDTHHMMSS" l'information heure en HH:MM

function formatTime(dateArray) {
    
    const selectTime = dateArray.split('T')[1];
    
    
    const hours = selectTime.slice(0, 2);
    const minutes = selectTime.slice(2, 4);
    
    
    return `${hours}:${minutes}`;
}

// -----------------------Fonction API arrivée a partir d'une heure----------------------

const apiKey2 = 'f3a26e07-0df5-48e8-b17a-b9d05b5a820a'
async function searchJourneys2() {
    try {
        const apiArriver = `
https://api.sncf.com/v1/coverage/sncf/journeys?to=${codeInseeArriver}&from=${codeInseeDepart}&datetime_represents=arrival&datetime=${dateArriver}T${timeEnd}&`
        const response2 = await fetch(apiArriver, { headers: { Authorization: apiKey2 }
    });
        const data2 = await response2.json();
        console.log(data2);
    } catch (error) {
        console.error(error);
    }
}

// sortir du format "YYYYMMDDTHHMMSS" l'information heure en HH:MM

function formatTime(dateArray) {
    
    const selectTime = dateArray.split('T')[1];
    
    
    const hours = selectTime.slice(0, 2);
    const minutes = selectTime.slice(2, 4);
    
    
    return `${hours}:${minutes}`;
}



date2.addEventListener('input', (e) => {
    const dateArriverChoix = e.target.value.split('-').join('').trim();
    dateArriver = dateArriverChoix
     console.log(dateArriver)
 });
 
 time2.addEventListener('input', (e) => {
     const heureArriverChoix = e.target.value.split(':').join('').trim();
     timeEnd = `${heureArriverChoix}00`
     console.log(timeEnd)
 })


 boutonRecherche2.addEventListener('click', () => {
     searchJourneys2()
 })


// ---Fonction qui ajoute des marqueurs sur la carte---


function addGareDepart(lat, lng, nom) {
    L.marker([lat, lng])
     .addTo(map)
     .bindPopup(nom)
     .openPopup();
  }
  function addGareArriver(lat, lng, nom) {
    L.marker([lat, lng])
     .addTo(map)
     .bindPopup(nom)
     .openPopup();
  }
