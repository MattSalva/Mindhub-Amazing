const dataElement = document.getElementById('eventos')


/*Información parcial que se muestra en la tarjeta. El resto se visualizara en "Details"*/
for (let i = 0; i < data.events.length; i++){
    containerCart = document.createElement('div');
    containerCart.setAttribute("class", "col-lg-4 d-flex align-items-stretch")
    containerCart.innerHTML = `
                <div class="card">
                    <img src=${data.events[i].image} class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title ">${data.events[i].name}</h5>
                        <p class="card-text text-black mb-0">${data.events[i].date}</p>
                        <p class="card-text text-success mb-0">${data.events[i].category}</p>
                        <p class="card-text ">${data.events[i].description}</p>
                        <div class="row">
                            <div class="col">
                                <span class="fs-5">Price $${data.events[i].price}</span>
                            </div>
                            <div class="col">
                                <a href="details.html" class="btn btn-secondary">Ver mas...</a>
                            </div>
                        </div>

                    </div>
                </div>
            `
    dataElement.appendChild(containerCart)
}
