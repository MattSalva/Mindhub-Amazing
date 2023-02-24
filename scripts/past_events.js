let current = new Date(data.currentDate)
let pastDates
data.events.forEach((el) => {
    pastDates = data.events.filter(e => (new Date(e.date) < current))
})


const dataElement = document.getElementById('eventos')


for (let i = 0; i < pastDates.length; i++){
    containerCart = document.createElement('div');
    containerCart.setAttribute("class", "col-lg-4 d-flex align-items-stretch")
    containerCart.innerHTML = `
                <div class="card">
                    <img src=${pastDates[i].image} class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title ">${pastDates[i].name}</h5>
                        <p class="card-text text-black mb-0">${pastDates[i].date}</p>
                        <p class="card-text text-success mb-0">${pastDates[i].category}</p>
                        <p class="card-text ">${pastDates[i].description}</p>
                        <div class="row">
                            <div class="col">
                                <span class="fs-5">Price $${pastDates[i].price}</span>
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
