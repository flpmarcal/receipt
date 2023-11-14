const receiptContainer = document.getElementById('receipt-container')
const listItems = document.getElementById('receipt-list')

const itemsListJson = localStorage.getItem('items-list')
const itemsList = JSON.parse(itemsListJson)

const extraInfoJson = localStorage.getItem('extra-info')
const extraInfo = JSON.parse(extraInfoJson)

const nameElement = document.getElementById('receiptName')
const dateElement = document.getElementById('receiptDate')
const paragraphMessage = document.getElementById('receiptMessage')

// Para cada item no local storage.
itemsList.forEach(function(item) {
    // Insere o item no HTML do recibo.
    listItems.innerHTML += `
    <li class="list-item">
        <span class="item-title">${item.title}</span>
        <span class="item-amount">${item.amount}x </span>
        <span class="item-value">$ ${item.price}</span>
    </li>
    `
})

const companyValue = extraInfo.company
const dateValue = extraInfo.date
const msgValue = extraInfo.message

// Insere as informações adicionais no HTML do recibo.
nameElement.innerHTML = `${companyValue}`
dateElement.innerHTML = `${dateValue}`
paragraphMessage.innerHTML = `${msgValue}`

calcTotal()

// Cria a função que calcula o valor total.
function calcTotal() {
    let itemsValues = []

    // Para cada item no array de itens do local storage.
    itemsList.forEach((item) => {
        // Converte o preço para number
        const valueToNumber = Number(item.price)
        // Envia para a array 'itemsValues'.
        itemsValues.push(valueToNumber)
    })

    // Soma o valor de todos os itens.
    let sum = itemsValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    // Força duas casas decimais.
    sum = sum.toFixed(2)
    
    // Mostra no HTML do recibo a linha de valor total.
    const totalValueElement = `
    <li class="list-item">
        <span class="item-title total">TOTAL</span>
        <span class="item-amount total"> </span>
        <span class="item-value total">$ ${sum}</span>
    </li>
    `
    listItems.insertAdjacentHTML('beforeend', totalValueElement)
}
