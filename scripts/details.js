async function fetchData() {
    try {
        const response = await fetch('https://mindhub-xj03.onrender.com/api/amazing');
        const data = await response.json()
        return data.events
    } catch (error) {
        console.log(error)
    }
}

/* Función main para indicar que la ejecución del código ocurra luego de que las promises para
*  la data esencial se completen
* */
async function main() {
    const eventos = await fetchData()

    const queryString = location.search
    const params = new URLSearchParams(queryString)


    const evento = eventos.find(e => e._id === parseInt(params.get('id')))

    const imgElement = document.getElementById('imagen-evento')
    const imgEvento = document.createElement('img')
    imgEvento.setAttribute('src',`${evento.image}`)
    imgEvento.setAttribute('class',`img-fluid`)

    imgElement.appendChild(imgEvento)

    const title = document.querySelector('title')
    title.innerText = `Details - ${evento.name}`

    const detailsElement = document.getElementById('detalles-evento')
    detailsElement.innerHTML = `
<h1>${evento.name}</h1>
<h4 class="text-success">${evento.category}</h4>
<p>${evento.description}</p>
<div class="ctr">
    <p><strong>Date:</strong> ${evento.date}</p>
    <p><strong>${evento.hasOwnProperty('assistance') ? "Assistance" : "Estimate" }</strong> ${evento.hasOwnProperty('assistance') ? evento.assistance : evento.estimate }</p>
<!--    if (evento.hasOwnProperty){
            return "Assistance"
            }
         else{
            return "Estimate"
         }-->
    <p><strong>Capacity:</strong> ${evento.capacity}</p>
    <p><strong>Place:</strong> ${evento.place}</p>
    <p><strong>Price:</strong> $${evento.price}</p>
</div>
`
}

main()