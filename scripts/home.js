/* Trae la data desde la API "https://mindhub-xj03.onrender.com/api/amazing"
* */
async function fetchData() {
    try {
        const response = await fetch('https://mindhub-xj03.onrender.com/api/amazing');
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

/* Función main para indicar que la ejecución del código ocurra luego de que las promises para
*  la data esencial se completen
* */
async function main() {
    const rawEventsData = await fetchData()
    addCards(dataElement, rawEventsData.events)
    listCategories(catElement, rawEventsData.events)
    // Agregado de listener para poder modificar el comportamiento de la busqueda y evitar que refresque la pagina en submit
    const formSearch = document.querySelector('form')
    formSearch.addEventListener('submit', function (e){
        e.preventDefault()
        const url = new URL(window.location);
        url.searchParams.delete("category")
        let checkboxes = document.getElementById('search-filter').querySelectorAll("input[type=checkbox]")
        let selectedCategories = [...checkboxes].reduce((acc, categoryCheckbox) => {
            if (categoryCheckbox.checked) acc.push(categoryCheckbox.id);
            return acc
        }, [])

        let searchBox = document.querySelector('.form-control').value

        if (selectedCategories){
            selectedCategories.forEach(e => {
                url.searchParams.append("category", e)
            })
        }
        url.searchParams.set("q", searchBox)
        window.history.pushState({}, '', url)
        if (location.search) {
            filterEvents(rawEventsData.events)
        }
    })

}

const catElement = document.getElementById('search-filter')
const dataElement = document.getElementById('eventos')

/*Agrega eventos en forma de card
* dataNode: Nodo padre de los eventos
* data: Array de eventos*/
function addCards(dataNode, data) {
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
function listCategories(catNode, data) {
    let containerCats;
    let categories = data.map(x => x.category)
    categories = [...new Set(categories)]
    const formNode = document.getElementById("search-box")
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i].replace(" ", "-").toLowerCase()
        containerCats = document.createElement('div')
        containerCats.setAttribute('class', 'checkbox')
        containerCats.innerHTML = `
                    <input type="checkbox" name="category" id="${category}" value="${category}">
                    <label for="${category}">${categories[i]}</label>`

        containerCats.addEventListener('click', () => filterByCats(data))
        catNode.insertBefore(containerCats, formNode)
    }
}

/*Provee un texto en caso de que la busqueda no de resultados*/
function noResults() {
    const emptyEventsNode = document.getElementById('eventos')
    let msgContainer = document.createElement('div')
    msgContainer.setAttribute('class', 'text-center m-5 p-5')
    msgContainer.innerHTML = `<h3>No se encontraron eventos. Pruebe con diferentes filtros</h3>`
    emptyEventsNode.appendChild(msgContainer)
}

/*Filtra en el momento
* escucha al click y acciona el filtro por categorias*/
function filterByCats(d) {
    let checkboxes = catElement.querySelectorAll("input[type=checkbox]")
    let filteredData = d
    let selectedCategories = [...checkboxes].reduce((acc, categoryCheckbox) => {
        if (categoryCheckbox.checked) acc.push(categoryCheckbox.id);
        return acc
    }, [])
    if (selectedCategories) {
        filteredData = filteredData.filter(e => (selectedCategories.includes(normalizeCategory(e.category))))
    }
    if (selectedCategories.length === 0) {
        filteredData = d
    }
    addCards(dataElement, filteredData)

}

/*Normaliza texto
* text: string texto */
function normalizeText(text) {
    return text.trim().toLowerCase()
}

/*Normaliza categoria pasando a minuscula y reemplazando espacios por "-"
* category: string categoria a normalizar*/
function normalizeCategory(category) {
    return category.replace(" ", "-").toLowerCase() // Book Exchange => book-exchange
}

/*Filtrar eventos a partir de input de busqueda por casillas y por texto
* rawEventsData = array de eventos sin filtrar
* */
function filterEvents(rawEventsData) {
    const querystring = location.search
    const params = new URLSearchParams(querystring);
    let q = params.get('q') // ?q=algo
    q = normalizeText(q) // normalizeText(algo)
    let catQuery = params.getAll('category') // category=cat1&category=cat2 [book-exchange, cinema, ...]
    let filteredEventsData = []
    if (catQuery.length && q.length) { //category=cat1&category=cat2&q=algo
        filteredEventsData = rawEventsData.filter(e => (
            (catQuery.includes(normalizeCategory(e.category))) // [book-exchange, cinema, ...].includes(e.category) => TRUE
            &&
            (normalizeText(e.name).includes(q) || normalizeText(e.description).includes(q)) // "comicon".includes("com") OR "...Come...".includes("com")
        ))
        if (filteredEventsData.length === 0) {
            addCards(dataElement, filteredEventsData)
            noResults()
        } else
            addCards(dataElement, filteredEventsData)
    } else if (catQuery.length && !q.length) {
        filteredEventsData = rawEventsData.filter(e => (
            catQuery.includes(normalizeCategory(e.category))))

        if (filteredEventsData.length === 0) {
            addCards(dataElement, filteredEventsData)
            noResults()
        } else
            addCards(dataElement, filteredEventsData)
    } else if (!catQuery.length && q.length) {
        filteredEventsData = rawEventsData.filter(e => (
            normalizeText(e.name).includes(q) || normalizeText(e.description).includes(q)))

        if (filteredEventsData.length === 0) {
            addCards(dataElement, filteredEventsData)
            noResults()
        } else
            addCards(dataElement, filteredEventsData)
    }
    else {
        addCards(dataElement, rawEventsData)
    }
}



main()
