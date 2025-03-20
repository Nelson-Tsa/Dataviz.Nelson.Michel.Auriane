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


let codeInseeArriver 
let codeInseeDepart 
let dateDepart 
let timeoutId;
let timeStart

let dateArriver
let timeEnd

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

time.addEventListener('input', (e) => {
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
        const apiDepart = `https://api.navitia.io/v1/coverage/sncf/journeys?to=${codeInseeArriver}&from=${codeInseeDepart}&datetime_represents=departure&datetime=${dateDepart}T${timeStart}&`
        

        const response = await fetch(apiDepart, { headers: { Authorization: apiKey }
    });
;
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
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