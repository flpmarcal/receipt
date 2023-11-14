const receiptContainer = document.getElementById('receipt-container')
const listItems = document.getElementById('receipt-list')

const itemsListJson = localStorage.getItem('items-list')
const itemsList = JSON.parse(itemsListJson)

const extraInfoJson = localStorage.getItem('extra-info')
const extraInfo = JSON.parse(extraInfoJson)

const nameElement = document.getElementById('receiptName')
const dateElement = document.getElementById('receiptDate')
const paragraphMessage = document.getElementById('receiptMessage')

itemsList.forEach(function(item) {
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

nameElement.innerHTML = `${companyValue}`
dateElement.innerHTML = `${dateValue}`
paragraphMessage.innerHTML = `${msgValue}`

calcTotal()

function calcTotal() {
    let itemsValues = []

    itemsList.forEach((item) => {
        const valueToNumber = Number(item.price)
        itemsValues.push(valueToNumber)
    })

    let sum = itemsValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    sum = sum.toFixed(2)
    const totalValueElement = `
    <li class="list-item">
        <span class="item-title total">TOTAL</span>
        <span class="item-amount total"> </span>
        <span class="item-value total">$ ${sum}</span>
    </li>
    `

    listItems.insertAdjacentHTML('beforeend', totalValueElement)
}
