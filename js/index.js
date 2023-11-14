const createReceiptForm = document.getElementById('create-receipt-form')
const addItemContainer = document.getElementById('add-item-container')
const addItemBtn = document.getElementById('btn-add-item')
const itemsContainer = document.getElementById('items-container')
const createReceiptBtn = document.getElementById('create-receipt-btn')
const extraInfoContainer = document.getElementById('extra-info-container')

const inputCompany = document.querySelector('[data-company]')
const inputDate = document.querySelector('[data-date]')
const inputMessage = document.querySelector('[data-message]')

const localItemsString = localStorage.getItem('items-list')
const localExtraInfosString = localStorage.getItem('extra-info')

const localExtraInfos = JSON.parse(localExtraInfosString)
let localItems = JSON.parse(localItemsString)

let removeButtons = []

displayLocalData()

function displayLocalData() {
    if (localItemsString) {
        localItems.forEach((localItem) => {
            localItem.source = 'local'
            itemsContainer.insertAdjacentHTML('beforeend', newlItemElement(localItem))
        })
    }

    if (localExtraInfosString) {
        inputCompany.value = localExtraInfos.company
        inputMessage.value = localExtraInfos.message
    }
}

function newlItemElement(item) {
    const newItem = `
    <section class="item-container" data-item>
        <input name="Title" type="text" class="input-item" placeholder="Item title" value="${item.title}" data-source="${item.source}" data-title />
        <input name="Amount" type="text" class="input-item" placeholder="Amount" value="${item.amount}" data-source="${item.source}" data-amount />
        <span class="multiplier">X</span>
        <input name="Price" type="text" class="input-item" placeholder="0.00" value="${item.price}" autocomplete="off" maxlength="10" data-source="${item.source}" data-price />
        <div class="button secondary btn-delete" data-source="${item.source}" data-btn-source="${item.source}"></div>
        <span class="item-validation" data-validation></span>
    </section>
    `
    return newItem
}

addItemBtn.addEventListener('click', () => {
    const emptyItem = {
        source: 'ui',
        title: '',
        amount: '',
        price: ''
    }
    itemsContainer.insertAdjacentHTML('beforeend', newlItemElement(emptyItem))
    const lastItem = itemsContainer.lastElementChild
    const firstInputLastItem = lastItem.querySelector('[data-title]')
    firstInputLastItem.focus()
})

itemsContainer.addEventListener('click', (e) => {
    const target = e.target
    const itemContainer = target.parentNode
    if (target.matches('[data-btn-source="local"]')) {
        const itemTitle = itemContainer.querySelector('[data-title]').value
        const itemFoundIndex = localItems.findIndex((item) => item.title === itemTitle)
        localItems.splice(itemFoundIndex, 1)
        const newItemsListString = JSON.stringify(localItems)
        localStorage.setItem('items-list', newItemsListString)
        itemContainer.remove()
    } else if (target.matches('[data-btn-source="ui"]')) {
        itemContainer.remove()
    } else if (target.matches('[data-price]')) {
        target.addEventListener('blur', (e) => {
            const inputPrice = e.target
            formatPrice(inputPrice)
        })
    }
})

itemsContainer.addEventListener('keydown', (e) => {
    if (e.target.matches('[data-price]') && e.key === 'Tab') {
        formatPrice(e.target)
    }
})

function formatPrice(priceField) {
    const plainValue = Number(priceField.value)
    const formattedPrice = plainValue.toFixed(2)

    if (plainValue == 0) {
        priceField.value = ''
    } else if (Number.isNaN(plainValue)) {
        priceField.value = ''
    } else {
        priceField.value = formattedPrice
    }
}

createReceiptForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const itemsContainers = itemsContainer.querySelectorAll('[data-item]')
    saveItems(itemsContainers)
})

createReceiptBtn.addEventListener('click', (e) => {
    document.querySelectorAll('[data-price]').forEach(inputPrice => inputPrice.blur())
})

function saveItems(itemsToBeSaved) {
    localStorage.clear()

    let isThereInvalidFields = false

    const titleInputs = itemsContainer.querySelectorAll('[data-title]')
    const amountInputs = itemsContainer.querySelectorAll('[data-amount]')
    const priceInputs = itemsContainer.querySelectorAll('[data-price]')

    for (const titleInput of titleInputs) {
        if (!verifyTitles(titleInput)) {
            isThereInvalidFields = true
        }
    }

    for (const amountInput of amountInputs) {
        if (!verifyNumbers(amountInput)) {
            isThereInvalidFields = true
        }
    }

    for (const priceInput of priceInputs) {
        if (!verifyNumbers(priceInput)) {
            isThereInvalidFields = true
        }
    }

    if (isThereInvalidFields) {
        return
    }

    let itemsList = []

    itemsToBeSaved.forEach((itemToBeSaved) => {
        const titleInput = itemToBeSaved.querySelector('[data-title]')
        const amountInput = itemToBeSaved.querySelector('[data-amount]')
        const priceInput = itemToBeSaved.querySelector('[data-price]')
        
        const item = {
            title: titleInput.value,
            amount: amountInput.value,
            price: priceInput.value
        }

        itemsList.push(item)
    })

    const extraInfo = {
      company: inputCompany.value,
      date: inputDate.value,
      message: inputMessage.value
    }

    const extraInfoString = JSON.stringify(extraInfo)
    const itemsListString = JSON.stringify(itemsList)

    localStorage.setItem('items-list', itemsListString)
    localStorage.setItem('extra-info', extraInfoString)

    window.location.href = './receipt.html';
}

function generateCurrentDate() {
    const currentDate = new Date()
    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const year = currentDate.getFullYear()
    const formattedDate = `${month}/${day}/${year}`
    return formattedDate
}

inputDate.value = generateCurrentDate()

function verifyTitles(titleField) {
    if (titleField.value == '') {
        titleField.classList.add('item-field-invalid')
        titleField.addEventListener('input', e => e.target.classList.remove('item-field-invalid'))

        const itemContainer = titleField.parentNode
        const itemValidation = itemContainer.querySelector('[data-validation]')
        itemValidation.style.display = 'flex'
        itemValidation.innerHTML += 'Title cannot be empty.'
        return false
    } else {
        return true
    }
}

function verifyNumbers(numberField) {
    const regex = /^[0-9.,\/]+$/
    const fieldTest = regex.test(numberField.value)

    if (!fieldTest || numberField.value == '') {
        numberField.classList.add('item-field-invalid')
        numberField.addEventListener('input', e => e.target.classList.remove('item-field-invalid'))

        const itemContainer = numberField.parentNode
        const itemValidation = itemContainer.querySelector('[data-validation]')
        itemValidation.style.display = 'flex'
        itemValidation.innerHTML += `Only numbers allowed in ${numberField.name} field.`
        return false
    } else {
        return true
    }
}
