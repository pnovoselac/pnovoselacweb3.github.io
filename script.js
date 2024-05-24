// Get elements
const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');



let items = [
    {
        name: 'Nike_sneakers',
        price: 100,
        image: 'Nike_sneakers.jpg',
    },
    {
        name: 'Adidas_sneakers',
        price: 150,
        image: 'Adidas_sneakers.jpg',
    },
    {
        name: 'Puma_sneakers',
        price: 80,
        image: 'Puma_sneakers.jpg',

    },
    {
        name: 'NB_sneakers',
        price: 120,
        image: 'NB_sneakers.jpg',

    },
    {
        name: 'Guess_sneakers',
        price: 180,
        image: 'Guess_sneakers.jpg',

    },
    {
        name: 'LVTN_sneakers',
        price: 200,
        image: 'LVTN_sneakers.jpg',

    },
    {
        name: 'TNF_sneakers',
        price: 130,
        image: 'TNF_sneakers.jpg',

    },
    {
        name: 'Vans_sneakers',
        price: 105,
        image: 'Vans_sneakers.jpg',

    },
    {
        name: 'Converse_sneakers',
        price: 110,
        image: 'Converse_sneakers.jpg',

    },
    {
        name: 'KarlLagerfeld_sneakers',
        price: 190,
        image: 'KarlLagerfeld_sneakers.jpg',

    },
];

let cart = [];

// An example function that creates HTML elements using the DOM.
function fillItemsGrid() {
    itemsGrid.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.id = i;
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="images/${item.image}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
            <input type="number" class="quantity-input" min="1" value="1">
            <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
        `;
        itemsGrid.appendChild(itemElement);
    }
}


function sortItemsByName(order) {
    items.sort((a, b) => {
        if (order === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    fillItemsGrid();
}

fillItemsGrid();

document.getElementById('sortAscBtn').addEventListener('click', () => {
    sortItemsByName('asc');
});

document.getElementById('sortDescBtn').addEventListener('click', () => {
    sortItemsByName('desc');
});


function addToCart(item, quantity) {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        item.quantity = quantity;
        cart.push(item);
    }
    renderCart();
    updateCartBadge(); 
}

function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    let totalQuantity = 0;
    for (const item of cart) {
        totalQuantity += item.quantity;
    }
    cartBadge.textContent = totalQuantity; 
}
    updateCartBadge();


function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    updateCartBadge();
}

function calculateTotal() {
    let total = 0;
    for (const item of cart) {
        total += item.price * item.quantity;

    }
    return total;
}

function renderCart() {
    cartItemsList.innerHTML = ''; 
    let total = 0; 
    for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
        <p>-----------</p>
            <p>${cartItem.name} 
            <p>Quantity: ${cartItem.quantityToRemove !== undefined ? cartItem.quantityToRemove : cartItem.quantity || 1}                
                <button class="add-quantity-btn" data-index="${i}">+</button>
                <button class="remove-quantity-btn" data-index="${i}">-</button>
                <button class="remove-from-cart-btn" data-index="${i}">Remove</button>
                <p>$${cartItem.price * (cartItem.quantityToRemove || cartItem.quantity || 1)}</p>
                </p>
            </p>
        <p>-----------</p>
        `;
        cartItemsList.appendChild(cartItemElement);
        total += cartItem.price * (cartItem.quantityToRemove || cartItem.quantity || 1);
    }
    cartTotal.textContent = `${total}`;
    updateCartBadge();
}


itemsGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const itemId = parseInt(event.target.getAttribute('data-id'));
        const itemToAdd = items.find(item => item.id === itemId);
        const quantityInput = event.target.parentElement.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value);
        if (itemToAdd && !isNaN(quantity) && quantity > 0) {
            addToCart(itemToAdd, quantity);
        }
    }
});

let walletAmount = 1000;

buyButton.addEventListener('click', () => {
    let totalCost = calculateTotal();

    if (cart.length === 0) {
        alert("Vaša košarica je prazna, nastavite s kupovinom.");
        return;
    }

    let availableFunds = walletAmount;
    for (const cartItem of cart) {
        availableFunds -= cartItem.price * cartItem.quantity;
    }

    if (availableFunds < 0) {
        alert("Nedovoljno kredita. Uklonite neki od proizvoda");
        return;
    }
    walletAmount -= totalCost;
    document.getElementById('walletAmount').textContent = walletAmount.toFixed(2);
    alert("Kupovina uspješna!");
    cart = [];
    renderCart();
});


cartItemsList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('add-quantity-btn')) {
        const index = parseInt(target.getAttribute('data-index'));
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        renderCart();
    } else if (target.classList.contains('remove-quantity-btn')) {
        const index = parseInt(target.getAttribute('data-index'));
        if (cart[index].quantity && cart[index].quantity > 1) {
            cart[index].quantity--;
            renderCart();
        }
    } else if (target.classList.contains('remove-from-cart-btn')) {
        const indexToRemove = parseInt(target.getAttribute('data-index'));
        if (!isNaN(indexToRemove)) {
            cart.splice(indexToRemove, 1);
            renderCart();
        }
    }
});

document.getElementById('walletAmount').textContent = walletAmount.toFixed(2);


// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
  modal.classList.toggle('show-modal');
}

// Call fillItemsGrid function when page loads
fillItemsGrid();
updateCartBadge();
// Example of DOM methods for adding event handling
cartButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);