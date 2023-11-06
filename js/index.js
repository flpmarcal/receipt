const btnAddItem = document.getElementById('btn-add-item')

const inputName = document.querySelector('[data-value-name]')
const inputDate = document.querySelector('[data-value-date]')
const inputCustomMessage = document.querySelector('[data-value-message]')

const form = document.querySelector('[data-form]')
const btnCreateReceipt = document.getElementById('btn-create-receipt')

const itemsData = localStorage.getItem('items-data');
const items = JSON.parse(itemsData)

const receiptInfoData = localStorage.getItem('receipt-info-data')
const receiptInfo = JSON.parse(receiptInfoData)

const sectionItems = document.getElementById('items-section')
const newItem = `
    <section class="item" id="section-item" data-item>
            <input type="text" class="input-item" placeholder="Item" value="" data-value-title />
            <input type="number" class="input-item" placeholder="Amount" value="" pattern="\d*" data-value-amount />
            <span class="multiplier">X</span>
            <input type="number" class="input-item" placeholder="Value" value="" pattern="\d*" data-value-value />
            <div class="button secondary" data-btn-remove data-local><img src="img/ic-delete.png" width="20px"/></div>
    </section>
`

if (itemsData) {
    displayLocalData()
    monitorRemoveButtons()
}

function displayLocalData() {
    items.forEach((item) => {
        const newItemLocal = `
            <section class="item" id="section-item" data-item>
                <input type="text" class="input-item" placeholder="Item" value="${item.title}" data-value-title />
                <input type="number" class="input-item" placeholder="Amount" value="${item.amount}" data-value-amount />
                <span class="multiplier">X</span>
                <input type="number" class="input-item" placeholder="Value" value="${item.value}" data-value-value />
                <div class="button secondary" data-btn-remove data-local><img src="img/ic-delete.png" width="20px"/></div>
            </section>
        `
        sectionItems.insertAdjacentHTML('beforeend', newItemLocal)
    })

    inputName.value = receiptInfo[0]
    inputDate.value = receiptInfo[1]
    inputCustomMessage.value = receiptInfo[2]
}

// Escuta o evento de focus no 'inputDate'.
inputDate.addEventListener('focus', () => {
    // Muda o type do 'inputDate' para 'date'.
    inputDate.type = 'date'
})

// Escuta o evento de blur no 'inputDate'.
inputDate.addEventListener('blur', () => {
    // Muda o type do 'inputDate' para 'text'.
    inputDate.type = 'text'
})

// Escuta o evento de 'click' no 'btnAddItem'.
btnAddItem.addEventListener('click', (addItemEvent) => {

    // Executa a função 'addItemOnList' e 'monitorRemoveButtons'.
    addItemOnList()
    monitorRemoveButtons()
    
    // Dá o focus no próximo input adicionado.
    const lastItem = sectionItems.lastElementChild
    const firstInputLastItem = lastItem.querySelector('[data-value-title]')
    firstInputLastItem.focus()
})

// Escuta o evento de 'click' no 'btnCreateReceipt'.
form.addEventListener('submit', (createReceiptEvent) => {
    // Previne o comportamento padrão do evento 'createReceiptEvent'.
    createReceiptEvent.preventDefault()
    // Limpa o que estava no 'localStorage'.
    localStorage.clear()
    // Roda a função 'dataCapture' para preencher o localStorage com novos dados preenchidos.
    dataCapture()
    // Redireciona para a tela de criação do recibo.
    window.location.href = './receipt.html';
})

// Cria a função que monitora os novos bot!oes de remover criados.
function monitorRemoveButtons() {
    const removeButtons = document.querySelectorAll('[data-btn-remove]')
    listenRemoveButtons(removeButtons)
}

// Cria a função 'addItemOnList'.
function addItemOnList() {
    // Adiciona ao fim do node de 'sectionItems' o conteudo da const 'newItem'.
    sectionItems.insertAdjacentHTML('beforeend', newItem)
}

function listenRemoveButtons(removeButtons) {
    // Para cada 'btnRemoveItem' na tela.
    removeButtons.forEach((removeButton) => {
        // Escuta o evento de 'click'.
        removeButton.addEventListener('click', function() {

            // Cria a const 'removeFromLocalDataCheck' que retorna true se o botão clicado é de um item gerado pelo 'localStorage'.
            const itemFromLocalDataCheck = removeButton.hasAttribute('data-local')
            
            // Se o botão clicado for de um item vindo do local storage.
            if (itemFromLocalDataCheck) {
                // Captura o valor do titulo daquele item.
                const itemToBeRemoved = removeButton.parentNode
                const itemTitleInput = itemToBeRemoved.querySelector('[data-value-title]')
                const itemTitle = itemTitleInput.value

                // Busca o index daquele item.
                const itemFound = items.findIndex((item) => item.title === itemTitle)

                // Remove aquele item do array 'items'.
                items.splice(itemFound, 1)

                // Atualiza o local storage com o novo array 'itens'.
                localStorage.setItem('items-data', JSON.stringify(items));

                // Remove o node daquele item da tela.
                itemToBeRemoved.remove();
            } else {

                // Cria a const 'itemToBeRemoved' que armazena o node pai do botão de remover clicado.
                const itemToBeRemoved = removeButton.parentNode
                // Remove o 'itemToBeRemoved', node pai do botão de remover.
                itemToBeRemoved.remove()
            }
        })
    })
}

// Cria a função 'dataCapture'.
function dataCapture() {

    // Cria o array 'tempItemList' para armazenar as infos do item daquela iteração.
    let tempItemList = []

    // Cria a const 'sectionItem' que armazena todos os nodes dos itens preenchidos.
    const sectionItem = document.querySelectorAll('[data-item]')

    // Para cada 'nodeItem' dentro do 'sectionItem'.
    sectionItem.forEach((nodeItem) => {

        // Captura os inputs no HTML que armazenam titulo, amount e value do item.
        const itemTitle = nodeItem.querySelector('[data-value-title]').value
        const itemAmount = nodeItem.querySelector('[data-value-amount]').value
        const itemValue = nodeItem.querySelector('[data-value-value]').value

        // Atualiza o array 'tempItemList' com as infos dos item daquela iteração.
        tempItemList.push({
            title: itemTitle,
            amount: itemAmount,
            value: itemValue
        })
    })

    // Cria o array 'itemsList' e popula com os itens da array 'tempItemList'.
    const itemsList = [...tempItemList]

    // Cria as consts que acessam os valores do que foi digitado nos inputs de informações extras.
    const nameValue = inputName.value
    const dateValue = inputDate.value
    const customMessageValue = inputCustomMessage.value

    // Cria a const que armazena o objeto com as infos adicionais do recibo.
    const extraInfos = [nameValue, dateValue, customMessageValue]

    // Executa a função 'saveItems' passando 'itemsList' e 'extraInfos' como parametros.
    saveItems(itemsList, extraInfos)
}


// Cria a função 'saveItems' que espera os 'itemsToBeSaved' e 'extraInfosToBeSaved' como parâmetros.
function saveItems(itemsToBeSaved, extraInfosToBeSaved) {
    const itemsData = JSON.stringify(itemsToBeSaved)
    localStorage.setItem('items-data', itemsData)

    const infosData = JSON.stringify(extraInfosToBeSaved)
    localStorage.setItem('receipt-info-data', infosData) 
}