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

displayLocalData()

// Função que exibe dados do local storage nos campos 
// caso tenha dados no local storage.
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

// Função que gera a linha de um item no HTML. 
// É usada tanto pelas função 'displayLocalData' e pelo evento do 'addItemBtn'.
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

// Escuta o evento de clique no 'addItemBtn' e põe na tela
// uma linha de item.
addItemBtn.addEventListener('click', () => {
    const emptyItem = {
        source: 'ui',
        title: '',
        amount: '',
        price: ''
    }
    itemsContainer.insertAdjacentHTML('beforeend', newlItemElement(emptyItem))

    // Dá o focus no campo de título do novo elemento após clicar em 'addItemBtn'.
    const lastItem = itemsContainer.lastElementChild
    const firstInputLastItem = lastItem.querySelector('[data-title]')
    firstInputLastItem.focus()
})


// Escuta o evento de clique no container que tem todos os itens 'itemsContainer'.
itemsContainer.addEventListener('click', (e) => {

    // Captura o elemento pai do target (o item).
    const target = e.target
    const itemContainer = target.parentNode

    // Se o target for um botão de remover de um item que foi gerado pela 
    // função 'displayLocalData'.
    if (target.matches('[data-btn-source="local"]')) {
        // Captura o valor do título daquele item.
        const itemTitle = itemContainer.querySelector('[data-title]').value
        // Busca o index daquele item no array de itens que está no local storage.
        const itemFoundIndex = localItems.findIndex((item) => item.title === itemTitle)
        // Remove do array aquele item.
        localItems.splice(itemFoundIndex, 1)
        // Atualiza o array do local storage sem aquele item.
        const newItemsListString = JSON.stringify(localItems)
        localStorage.setItem('items-list', newItemsListString)
        // Remove da UI o node daquele item.
        itemContainer.remove()
    // Se o target for de um item criado apenas na UI pelo 'addItemBtn'.
    } else if (target.matches('[data-btn-source="ui"]')) {
        // Remove da UI o node daquele item.
        itemContainer.remove()
    // Se o target for um campo de preço.
    } else if (target.matches('[data-price]')) {
        // Escuta o evento de blur.
        target.addEventListener('blur', (e) => {
            // Formata o preço com a função 'formatPrice'.
            const inputPrice = e.target
            formatPrice(inputPrice)
        })
    }
})

// Escuta o evento de pressionar uma tecla estando no 'itemsContainer'.
itemsContainer.addEventListener('keydown', (e) => {
    // Se o target for um campo de preço e a tecla pressionada for a Tab.
    if (e.target.matches('[data-price]') && e.key === 'Tab') {
        // Executa a função 'formatPrice' para formatar aquele preço.
        formatPrice(e.target)
    }
})

// Cria a função 'formatPrice' que espera um 'priceField'.
function formatPrice(priceField) {
    // Captura o valor do 'priceField' e converte para número.
    const plainValue = Number(priceField.value)
    // Pega o valor gerado por 'plainValue' e força duas casas decimais.
    const formattedPrice = plainValue.toFixed(2)

    // Se o valor de 'plainValue' for 0.
    if (plainValue == 0) {
        // Retoma o valor do campo para vazio.
        priceField.value = ''
    // Se o valor digitado for NaN.
    } else if (Number.isNaN(plainValue)) {
        // Retoma o valor do campo para vazio.
        priceField.value = ''
    } else {
        // Atribui o valor formatado por 'formattedPrice' ao valor do campo.
        priceField.value = formattedPrice
    }
}

// Escuta o evento de submit do form geral.
createReceiptForm.addEventListener('submit', (e) => {
    // Previne de recarregar a página.
    e.preventDefault()
    // Captura cada linha de item na tela e põe no array 'itemsContainers'.
    const itemsContainers = itemsContainer.querySelectorAll('[data-item]')
    // Executa a função 'saveItems' com o array de items.
    saveItems(itemsContainers)
})

// Cria a função 'saveItems' que espera itens a serem salvos.
function saveItems(itemsToBeSaved) {

    // Cria uma let que identifica se há um item com preenchimento inválido.
    // O valor dessa let é atualizada pela validação a seguir.
    let isThereInvalidFields = false

    // Captura todos os campos de títulos, amounts e prices dos items.
    const titleInputs = itemsContainer.querySelectorAll('[data-title]')
    const amountInputs = itemsContainer.querySelectorAll('[data-amount]')
    const priceInputs = itemsContainer.querySelectorAll('[data-price]')

    // Para cada campo de título.
    for (const titleInput of titleInputs) {
        // Verifica se a função 'verifyTitles' retorna false.
        if (!verifyTitles(titleInput)) {
            // Se sim, o valor da let 'isThereInvalidFields' vira true.
            isThereInvalidFields = true
        }
    }

    // Para cada campo de amount.
    for (const amountInput of amountInputs) {
        // Verifica se a função 'verifyNumbers' retorna false.
        if (!verifyNumbers(amountInput)) {
            // Se sim, o valor da let 'isThereInvalidFields' vira true.
            isThereInvalidFields = true
        }
    }

    // Para cada campo de price.
    for (const priceInput of priceInputs) {
        // Verifica se a função 'verifyNumbers' retorna false.
        if (!verifyNumbers(priceInput)) {
            // Se sim, o valor da let 'isThereInvalidFields' vira true.
            isThereInvalidFields = true
        }
    }

    // Após as validações, se a let 'isThereInvalidFields' tiver valor de true.
    if (isThereInvalidFields) {
        // Para de executar a função 'saveItems'.
        return
    }

    // Limpa o local storage antes de salvar novos itens.
    localStorage.clear()

    // Cria o array de lista de itens.
    let itemsList = []

    // Para cada item recebido pelo parâmetro 'itemsToBeSaved'.
    itemsToBeSaved.forEach((itemToBeSaved) => {
        // Captura o título, amount e price
        const titleInput = itemToBeSaved.querySelector('[data-title]')
        const amountInput = itemToBeSaved.querySelector('[data-amount]')
        const priceInput = itemToBeSaved.querySelector('[data-price]')
        
        // Cria o objeto do item.
        const item = {
            title: titleInput.value,
            amount: amountInput.value,
            price: priceInput.value
        }

        // Atualiza a array 'itemsList' com aquele item.
        itemsList.push(item)
    })

    // Captura os valores dos campos de informações adicionais (company, date e message).
    const extraInfo = {
      company: inputCompany.value,
      date: inputDate.value,
      message: inputMessage.value
    }

    // Converte as infos extras e a lista de itens em string.
    const extraInfoString = JSON.stringify(extraInfo)
    const itemsListString = JSON.stringify(itemsList)

    // Manda para o local storage o array de itens na key 'items-list'.
    localStorage.setItem('items-list', itemsListString)
    // Manda para o local storage o objeto de infos extras na key 'extra-info'.
    localStorage.setItem('extra-info', extraInfoString)

    // Redireciona para a página que gera o recibo.
    window.location.href = './receipt.html';
}

// Função que gera a data atual e formata em dd/mm/aa.
function generateCurrentDate() {
    const currentDate = new Date()
    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const year = currentDate.getFullYear()
    const formattedDate = `${month}/${day}/${year}`
    return formattedDate
}

// Seta a data atual como valor padrão do campo 'inputDate'
inputDate.value = generateCurrentDate()

// Cria a função 'verifyTitles' que espera receber um título de item.
function verifyTitles(titleField) {
    // Verifica se está vazio.
    if (titleField.value == '') {
        // Adiciona a classe que deixa a borda do campo vermelha.
        titleField.classList.add('item-field-invalid')
        // Ao fazer uma alteração 'input' no campo, remove a classe de borda vermelha.
        titleField.addEventListener('input', e => e.target.classList.remove('item-field-invalid'))
        // Retorna false que será usado na função 'saveItems'.
        return false
    } else {
        return true
    }
}

// Cria a função 'verifyNumbers' que espera receber um campo de número (amount ou price).
function verifyNumbers(numberField) {
    // Cria a regex que valida se o campo contém apenas números de 0 a 9, pontos, vírgulas ou barras.
    const regex = /^[0-9.,\/]+$/
    const fieldTest = regex.test(numberField.value)

    // Se o valor do campo não passar no teste da regex ou for vazio.
    if (!fieldTest || numberField.value == '') {
        // Adiciona a classe que deixa o campo vermelho.
        numberField.classList.add('item-field-invalid')
        // Ao fazer uma alteração 'input' no campo, remove a classe de borda vermelha.
        numberField.addEventListener('input', e => e.target.classList.remove('item-field-invalid'))
        // Retorna false que será usado na função 'saveItems'.
        return false
    } else {
        return true
    }
}
