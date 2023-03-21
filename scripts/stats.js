/* Trae la data desde la API "https://mindhub-xj03.onrender.com/api/amazing"
* */
async function fetchData() {
    try {
        const response = await fetch('https://mindhub-xj03.onrender.com/api/amazing')
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

/* Función main para indicar que la ejecución del código ocurra luego de que las promises para
*  la data esencial se completen
* */
async function main() {
    const currentDate = new Date((await fetchData()).currentDate)
    const events = (await fetchData()).events
    const pastEvents = events.filter(e => (new Date(e.date) < currentDate))
    const futureEvents = events.filter(e => (new Date(e.date) > currentDate))

    let eventsPercentages = pastEvents.map((e) => ({
        id: e._id,
        name: e.name,
        capacity: e.capacity,
        percentage: percentage((e.hasOwnProperty('assistance') ? e.assistance : e.estimate), e.capacity)
    }))

    // Events statistics
    statistics(eventsPercentages)
    // Upcoming events statistics by category
    statisticsByCategory(futureEventsStatistics, futureEvents)
    // Past Events statistics by category
    statisticsByCategory(pastEventsStatistics, pastEvents)

}

const pastEventsStatistics = document.getElementById('past-events')
const futureEventsStatistics = document.getElementById('future-events')

// Mostrar Estadisticas
function statistics(eventsPercentages) {
    const objetoMasPorcentaje = getObjectWithLargestAttributeValue(eventsPercentages, "percentage")
    const objetoMasCapacidad = getObjectWithLargestAttributeValue(eventsPercentages, "capacity")
    const objetoMenosPorcentaje = getObjectWithLowestAttributeValue(eventsPercentages, "percentage")
    const tableNode = document.getElementById('statistics')
    const rowTable = document.createElement('tr')
    rowTable.innerHTML = `
                    <td>${objetoMasPorcentaje.name}: ${objetoMasPorcentaje.percentage}%</td>
                    <td>${objetoMenosPorcentaje.name}: ${objetoMenosPorcentaje.percentage}%</td>
                    <td>${objetoMasCapacidad.name}: ${objetoMasCapacidad.capacity}</td>
    `
    tableNode.appendChild(rowTable)
}
// Mostrar estadisticas por categoria
function statisticsByCategory(tableNode, events) {
    let categories = events.map(x => x.category)
    categories = [...new Set(categories)]
    for (let i = 0; i < categories.length; i++) {
        let revenue = 0
        let assistTotal = 0
        let capacityTotal = 0

        events.forEach((e) => {
            if (e.category === categories[i]){
                assistTotal += (e.hasOwnProperty('assistance') ? e.assistance : e.estimate)
                capacityTotal += e.capacity
                revenue += ((e.hasOwnProperty('assistance') ? e.assistance : e.estimate) * e.price)
            }
        })
        let category = categories[i].replace(" ", "-").toLowerCase()
        let containerCats = document.createElement('tr')
        containerCats.setAttribute('class', `${category}`)
        containerCats.innerHTML = `
                <td>${categories[i]}</td>
                <td>$${revenue}</td>
                <td>${percentage(assistTotal, capacityTotal)}%</td>`

        tableNode.appendChild(containerCats)
    }

}
// Calculo de porcentaje
function percentage(assist, capacity) {
    return parseFloat(((assist * 100) / capacity).toFixed(2))
}

// Funciones para obtener objeto de una lista de objetos con el mayor/menor valor en el atributo indicado
function getObjectWithLargestAttributeValue(objectsArray, attribute) {
    let largestValueObject = objectsArray[0]

    objectsArray.forEach(function (currentObject) {
        if (currentObject[attribute] > largestValueObject[attribute]) {
            largestValueObject = currentObject
        }
    })

    return largestValueObject
}
function getObjectWithLowestAttributeValue(objectsArray, attribute) {
    let lowestValueObject = objectsArray[0]

    objectsArray.forEach(function (currentObject) {
        if (currentObject[attribute] < lowestValueObject[attribute]) {
            lowestValueObject = currentObject
        }
    })

    return lowestValueObject
}

main()