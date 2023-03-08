const catElement = document.getElementById('search-filter')
const dataElement = document.getElementById('eventos')
let current = new Date(data.currentDate)
let futureDates
data.events.forEach((el) => {
    futureDates = data.events.filter(e => (new Date(e.date) > current))
})


/*Agrega eventos en forma de card
* dataNode: Nodo padre de los eventos
* data: Array de eventos*/
function addCards(dataNode, data){
    let containerCart;
    dataNode.replaceChildren()
    for (let i = 0; i < data.length; i++) {
        containerCart = document.createElement('div');
        containerCart.setAttribute("class", "col-lg-4 d-flex align-items-stretch")
        containerCart.innerHTML = `
                <div class="card">
                    <img src=${data[i].image} class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title ">${data[i].name}</h5>
                        <p class="card-text text-black mb-0">${data[i].date}</p>
                        <p class="card-text text-success mb-0">${data[i].category}</p>
                        <p class="card-text ">${data[i].description}</p>
                        <div class="row">
                            <div class="col">
                                <span class="fs-5">Price $${data[i].price}</span>
                            </div>
                            <div class="col">
                                <a href="details.html?id=${data[i]._id}" class="btn btn-secondary">More...</a>
                            </div>
                        </div>

                    </div>
                </div>
            `
        dataNode.appendChild(containerCart)
    }
}

/*
* Listar categorias dinamicamente a partir de los eventos disponibles
* catNode: Nodo parent de las categorias
* data: Data de los eventos
* */
function listCategories(catNode, data){
    let containerCats;
    let categories = data.map(x => x.category)
    categories = [...new Set(categories)]
    const formNode = document.getElementById("search-box")
    for (let i = 0; i < categories.length; i++){
        let category = categories[i].replace(" ","-").toLowerCase()
        containerCats = document.createElement('div')
        containerCats.innerHTML = `
                    <input type="checkbox" name="category" id="${category}" value="${category}" onclick="filterByCats()">
                    <label for="${category}">${categories[i]}</label>`

        catNode.insertBefore(containerCats, formNode)
    }
}
/*Normaliza texto
* text: string texto */

/*Provee un texto en caso de que la busqueda no de resultados*/
function noResults(){
    const emptyEventsNode = document.getElementById('eventos')
    let msgContainer = document.createElement('div')
    msgContainer.setAttribute('class', 'text-center m-5 p-5')
    msgContainer.innerHTML = `<h3>No se encontraron eventos. Pruebe con diferentes filtros</h3>`
    emptyEventsNode.appendChild(msgContainer)
}

/*Filtra en el momento
* escucha al click y acciona el filtro por categorias*/


function filterByCats(){
    let checkboxes = catElement.querySelectorAll("input[type=checkbox]")
    let filteredData = futureDates
    let selectedCategories = [...checkboxes].reduce((acc, categoryCheckbox) => {if(categoryCheckbox.checked) acc.push(categoryCheckbox.id); return acc}, [])
    if (selectedCategories){
        filteredData = filteredData.filter(e => (selectedCategories.includes(normalizeCategory(e.category))))
    }
    if (selectedCategories.length === 0){
        filteredData = futureDates
    }
    addCards(dataElement, filteredData)

}

function normalizeText(text){
    return text.trim().toLowerCase()
}
/*Normaliza categoria pasando a minuscula y reemplazando espacios por "-"
* category: string categoria a normalizar*/
function normalizeCategory(category){
    return category.replace(" ","-").toLowerCase()
}

/*Filtrar eventos a partir de input de busqueda por casillas y por texto
* rawEventsData = array de eventos sin filtrar
* */
function filterEvents(rawEventsData){
    const querystring = location.search
    const params = new URLSearchParams(querystring);
    let q = params.get('q')
    q = normalizeText(q)
    let catQuery = params.getAll('category')
    let filteredEventsData = []
    if (catQuery.length && q.length){
        filteredEventsData = rawEventsData.filter(e => (
            (catQuery.includes(normalizeCategory(e.category)))
            &&
            (normalizeText(e.name).includes(q) || normalizeText(e.description).includes(q))
        ))
        if (filteredEventsData.length === 0) {
            addCards(dataElement, filteredEventsData)
            noResults()
        }
        else
            addCards(dataElement, filteredEventsData)
    }
    else if (catQuery.length && !q.length){
        filteredEventsData = rawEventsData.filter(e => (
            catQuery.includes(normalizeCategory(e.category))))

        if (filteredEventsData.length === 0) {
            addCards(dataElement, filteredEventsData)
            noResults()
        }
        else
            addCards(dataElement, filteredEventsData)
    }
    else if (!catQuery.length && q.length){
        filteredEventsData = rawEventsData.filter(e => (
            normalizeText(e.name).includes(q) || normalizeText(e.description).includes(q)))


        if (filteredEventsData.length === 0) {
            addCards(dataElement, filteredEventsData)
            noResults()
        }
        else
            addCards(dataElement, filteredEventsData)

    }
}


addCards(dataElement, futureDates)
listCategories(catElement, futureDates)



if (location.search){
    filterEvents(futureDates)
}



//
// for (let i = 0; i < futureDates.length; i++){
//     let containerCart = document.createElement('div');
//     containerCart.setAttribute("class", "col-lg-4 d-flex align-items-stretch")
//     containerCart.innerHTML = `
//                 <div class="card">
//                     <img src=${futureDates[i].image} class="card-img-top" alt="">
//                     <div class="card-body">
//                         <h5 class="card-title ">${futureDates[i].name}</h5>
//                         <p class="card-text text-black mb-0">${futureDates[i].date}</p>
//                         <p class="card-text text-success mb-0">${futureDates[i].category}</p>
//                         <p class="card-text ">${futureDates[i].description}</p>
//                         <div class="row">
//                             <div class="col">
//                                 <span class="fs-5">Price $${futureDates[i].price}</span>
//                             </div>
//                             <div class="col">
//                                 <a href="details.html" class="btn btn-secondary">Ver mas...</a>
//                             </div>
//                         </div>
//
//                     </div>
//                 </div>
//             `
//     dataElement.appendChild(containerCart)
// }
