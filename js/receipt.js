const itemsData = localStorage.getItem('items-data');
const items = JSON.parse(itemsData)

const receiptInfoData = localStorage.getItem('receipt-info-data')
const receiptInfo = JSON.parse(receiptInfoData)

const listItems = document.getElementById('receipt-list-items')

function calcTotal() {

    let itemsValues = []

    items.forEach((item) => {
        const valueToNumber = Number(item.value)
        itemsValues.push(valueToNumber)
    })

    let sum = itemsValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const totalValueElement = `<li class="list-item">
        <span class="item-title total">TOTAL</span>
        <span class="item-amount total"> </span>
        <span class="item-value total">$ ${sum}</span>
    </li>`

    listItems.insertAdjacentHTML('beforeend', totalValueElement)
}

function generateReceipt() {

    items.forEach(function(item) {
        
        listItems.innerHTML += `<li class="list-item">
            <span class="item-title">${item.title}</span>
            <span class="item-amount">${item.amount}x </span>
            <span class="item-value">$ ${item.value}</span>
        </li>`
    })

    calcTotal()
    
    const nameValue = receiptInfo[0]
    const dateValue = receiptInfo[1]
    const msgValue = receiptInfo[2]

    const nameElement = document.getElementById('receiptName')
    nameElement.innerHTML = `${nameValue}`

    const dateElement = document.getElementById('receiptDate')
    dateElement.innerHTML = `${dateValue}`

    const paragraphMessage = document.getElementById('receiptMessage')
    paragraphMessage.innerHTML = `${msgValue}`
}

generateReceipt()