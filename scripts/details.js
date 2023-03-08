const eventos = data.events

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
    <p><strong>Capacity:</strong> ${evento.capacity}</p>
    <p><strong>Place:</strong> ${evento.place}</p>
    <p><strong>Price:</strong> $${evento.price}</p>
</div>
`