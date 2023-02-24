let current = new Date(data.currentDate)
let futureDates
data.events.forEach((el) => {
    futureDates = data.events.filter(e => (new Date(e.date) > current))
})


const dataElement = document.getElementById('eventos')


for (let i = 0; i < futureDates.length; i++){
    containerCart = document.createElement('div');
    containerCart.setAttribute("class", "col-lg-4 d-flex align-items-stretch")
    containerCart.innerHTML = `
                <div class="card">
                    <img src=${futureDates[i].image} class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title ">${futureDates[i].name}</h5>
                        <p class="card-text text-black mb-0">${futureDates[i].date}</p>
                        <p class="card-text text-success mb-0">${futureDates[i].category}</p>
                        <p class="card-text ">${futureDates[i].description}</p>
                        <div class="row">
                            <div class="col">
                                <span class="fs-5">Price $${futureDates[i].price}</span>
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
