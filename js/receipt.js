const receiptContainer = document.getElementById('receipt-container')
const listItems = document.getElementById('receipt-list')

const itemsData = localStorage.getItem('items-data')
const items = JSON.parse(itemsData)

const receiptInfoData = localStorage.getItem('receipt-info-data')
const receiptInfo = JSON.parse(receiptInfoData)

generateReceipt()

function generateReceipt() {

    // Gera a lista de items do recibo com base nos dados de 'items'.
    items.forEach(function(item) {
        listItems.innerHTML += `<li class="list-item">
            <span class="item-title">${item.title}</span>
            <span class="item-amount">${item.amount}x </span>
            <span class="item-value">$ ${item.value}</span>
        </li>`
    })
    
    // Executa a função 'calcTotal'.
    calcTotal()

    // Cria as consts que armazenam os elementos nos quais o conteúdo das infos extras devem ser adicionados.
    const nameElement = document.getElementById('receiptName')
    const dateElement = document.getElementById('receiptDate')
    const paragraphMessage = document.getElementById('receiptMessage')

    // Cria as consts que armazema as infos extras do recibo.
    const nameValue = receiptInfo[0]
    const dateValue = receiptInfo[1]
    const msgValue = receiptInfo[2]

    // Insere nos elementos os valores dos campos nome, data e custom message
    nameElement.innerHTML = `${nameValue}`
    dateElement.innerHTML = `${dateValue}`
    paragraphMessage.innerHTML = `${msgValue}`
}

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
