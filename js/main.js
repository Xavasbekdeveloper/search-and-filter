const hamburgerBtn = document.querySelector('.header__hamburger-btn');
const toggle = document.querySelector('.header__list');
const cancelBtn = document.querySelector('.cancel-btn');
const cards = document.querySelector('.cards')
const moreBtn = document.querySelector('.more-btn')
const Load = document.querySelector(".loading")
const loginBtn = document.querySelector('.header__login-btn')
const loginModal = document.querySelector('.login')
const loginBackground = document.querySelector('.background')
const loginCancel = document.querySelector('.login-cancel-btn');
const registerCancel = document.querySelector('.register-cancel-btn')
const categoriesList = document.querySelector('.Cards__categories')
const SearchInput = document.querySelector('.header__search-input');

const API_URL = 'https://dummyjson.com';

function Toggle() {
    toggle.classList.toggle('show-list')
}

hamburgerBtn.addEventListener('click', () => {
    Toggle();
})

cancelBtn.addEventListener('click', () => {
    Toggle();
})

loginCancel.addEventListener('click', () => {
    loginBackground.style.display = "none"
    loginModal.style.display = "none"
})


var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});


let limitCard = 4
let count = 1

async function getProduct(api, option, searchValue) {
    let url = ''
    if (option === "all") {
        if (searchValue) {
            url = `${api}/products/search?q=${searchValue}`
        } else {
            url = `${api}/products`
        }
    } else {
        url = `${api}/products/category/${option}`
    }

    let data = await fetch(url, {
        method: "GET",
    })

    data
        .json()
        .then(res => mapProducts(res))
        .catch(err => console.log(err))
        .finally(() => {
            moreBtn.innerHTML = "See more"
            moreBtn.removeAttribute("disabled")
            Load.style.display = "none"
        })

}

getProduct(API_URL, 'all')



function mapProducts(products) {
    let card = ""

    products.products.forEach(product => {
        card += `
        <div class="card">
            <div class="card__img">
                <img class="card-img" data-id="${product.id}" src=${product.thumbnail} alt="img">
            </div>  
            <div class="card__info">
                <h3 class="card__title">${product.title}</h3>
                <p class="card__text">${product.price} USD</p>
            </div>
        </div>
        `
    })

    cards.innerHTML = card
}


moreBtn.addEventListener('click', () => {
    count++
    moreBtn.innerHTML = "Loading..."
    getProduct(API_URL)
    moreBtn.setAttribute("disabled", true)

})




function Loading(load) {
    let loading = ""
    for (let i = 0; i < load; i++) {
        loading += `
            <div class="loading__card">
                    <div class="loading__img"></div>
                <div class="loading__info">
                    <div class="loading__title"></div>
                    <div class="loading__title"></div>
                </div>
            </div>
        `
    }
    Load.innerHTML = loading
}

Loading(4)



const form = document.querySelector(".form");
const username = document.querySelector(".input__username");
const password = document.querySelector(".input__password");

form.addEventListener('submit', e => {
    e.preventDefault();

    let user = {
        username: username.value,
        password: password.value,
    }

    signIn(user);

})

async function signIn(user) {
    await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(res => {
            console.log("ress>>>", res);
            if (res.message === "Invalid credentials") {
                return alert("username or password is incorrect")
            }
            localStorage.setItem("x-auth-token", res.token)
            window.open(`/pages/admin.html`, "_self")
        })
        .catch(err => console.log("err>>>", err))
}

const register = document.querySelector('.register')
const registerBtnHover = document.querySelector('.register-btn2')
const loginBtnHover = document.querySelector('.login-btn')

registerBtnHover.addEventListener("click", () => {
    register.classList.add('show-register')
    loginModal.classList.add('hide-login')
})

loginBtnHover.addEventListener("click", () => {
    register.classList.remove('show-register')
    loginModal.classList.remove('hide-login')
})


registerCancel.addEventListener("click", () => {
    loginBackground.style.display = "none";
    register.style.display = "none";
    register.classList.remove('show-register')
})

loginBtn.addEventListener('click', () => {
    loginBackground.style.display = "block"
    loginModal.style.display = "flex"
    loginModal.classList.remove('hide-login')
})


cards.addEventListener('click', (e) => {
    if (e.target.className === "card-img") {
        let id = e.target.dataset.id
        window.open(`./pages/product.html?id=${id}`, "_self")
    }
})

async function getCategory(api) {
    let data = await fetch(`${api}/products/categories`, {
        method: 'GET',
    })

    data
        .json()
        .then(res => mapCategory(res))
        .catch(err => console.log(err))
}

getCategory(API_URL)

function mapCategory(categories) {
    let categorys = `
    <li class="Cards__categories__item">all</li>
    `

    categories.forEach(category => {
        categorys += `
        <li class="Cards__categories__item">${category}</li>
        `
    })

    categoriesList.innerHTML = categorys
}

categoriesList.addEventListener('click', (e) => {
    let optionValue = e.target.innerHTML
    getProduct(API_URL, optionValue)
})


SearchInput.addEventListener('input', (e) => {
    let value = e.target.value.trim()
    if (value) {
        getProduct(API_URL, "all", value)
    }
})