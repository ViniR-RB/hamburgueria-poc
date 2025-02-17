const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModal = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const inputAddress = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []
updateCartCouter()

cartBtn.addEventListener("click", function() {
    updateCartModal();
    updateCartCouter()
    cartModal.style.display = "flex";
})
cartModal.addEventListener("click", function (event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})
closeModal.addEventListener("click", function () {
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)
        updateCartCouter()
        
    }
})



function addToCart(name,price) {
   const existingItem = cart.find(item => item.name === name)
   if(existingItem) {
    existingItem.quantity += 1
    return;
   } else {
    cart.push({
        name,
        price,
        quantity: 1,
       })
   }
  


   
}
function updateCartModal() {
 cartItemsContainer.innerHTML = "";
 let total = 0
 cart.forEach(item => {
    const cartItemElement = document.createElement("div")
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}" >
            Remover
        </button>
        

    </div>`

    total = total + (item.price * item.quantity);
    cartItemsContainer.appendChild(cartItemElement)

    
    
})
cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
})
updateCartCouter();
}

function updateCartCouter () {
    cartCounter.innerHTML = cart.length
}


cartItemsContainer.addEventListener("click",function (event) {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];
        if(item.quantity > 1) {
            item.quantity -= 1
            updateCartModal();
            return;
        }
        cart.splice(index, 1)
        updateCartModal();
    }
}

inputAddress.addEventListener("click", function (event) {
    let {value}= event.target



    if(value !== "" ) {
        inputAddress.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen()
    if(!isOpen) {
        Toastify({
            text: "Ops o Restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "#ef4444",
            },
        }).showToast()
        return;
    }
    if(cart.length === 0) return;


    if(inputAddress.value === "") {
        addressWarn.classList.remove("hidden")
        inputAddress.classList.add("border-red-500")
        return;
    }
    let total = 0
    const cartItems = cart.map((item) => {
        total = total + (item.quantity * item.price)
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço ${item.price} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "12345678910"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${inputAddress.value} Preço Total: ${total}`, "_blank")
    cart = []
    updateCartModal()
})

function checkRestaurantOpen() {
    const data = new Date()
    const hour = data.getHours()
    console.log(hour)
    return hour >= 18 && hour < 22;
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}