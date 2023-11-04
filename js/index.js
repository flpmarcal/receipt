
const btnAddItem = document.getElementById('btn-add-item')
const btnCreateReceipt = document.getElementById('btn-create-receipt')

const inputName = document.querySelector('[data-value-name]')
const inputDate = document.querySelector('[data-value-date]')
const inputCustomMessage = document.querySelector('[data-value-message]')

const itemsData = localStorage.getItem('items-data');
const items = JSON.parse(itemsData)

const sectionItems = document.getElementById('section-items')
const newItem = `
    <section class="item" id="section-item" data-item>
            <input type="text" class="input-item" placeholder="Item" data-value-title required />
            <input type="number" class="input-item" placeholder="Amount" data-value-amount required />
            <input type="number" class="input-item" placeholder="Value" data-value-value required />
            <div class="button secondary" data-remove><img src="img/ic-delete.png" width="20px"/></div>
    </section>
`

checkLocalData()

function checkLocalData() {
    if (localStorage.length > 0) {
        items.forEach((item) => {
            sectionItems.innerHTML += `
            <section class="item" id="section-item" data-item>
                <input type="text" class="input-item" placeholder="Item" data-value-title required value="${item.title}"/>
                <input type="number" class="input-item" placeholder="Amount" data-value-amount required value="${item.amount}"/>
                <input type="number" class="input-item" placeholder="Value" data-value-value required value="${item.value}"/>
                <div class="button secondary" data-remove data-local><img src="img/ic-delete.png" width="20px"/></div>
            </section>
            `
        })
    } else {
        return
    }
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
    // Executa a função 'addItemOnList'.
    addItemOnList()

    // Dá o focus no próximo input adicionado.
    const lastItem = sectionItems.lastElementChild
    const firstInputLastItem = lastItem.querySelector('[data-value-title]')
    firstInputLastItem.focus()
})

// Escuta o evento de 'click' no 'btnCreateReceipt'.
btnCreateReceipt.addEventListener('click', (createReceiptEvent) => {
    // Previne o comportamento padrão do evento 'createReceiptEvent'.
    createReceiptEvent.preventDefault()
    // Limpa o 'localStorage'.
    localStorage.clear()
    // Roda a função 'dataCapture'.
    dataCapture()
    // Redireciona para a tela de criação do recibo.
    window.location.href = './receipt.html';
})

// Cria a função 'addItemOnList'.
function addItemOnList() {
    // Adiciona ao fim do node de 'sectionItems' o conteudo da const 'newItem'.
    sectionItems.insertAdjacentHTML('beforeend', newItem)

    // Cria a const 'btnRemoveItems' que seleciona os botões de remover pertencentes aos itens recém criados.
    const btnRemoveItems = document.querySelectorAll('[data-remove]')

    // Para cada 'btnRemoveItem' criado.
    btnRemoveItems.forEach((btnRemoveItem) => {
        // Escuta o evento de 'click'.
        btnRemoveItem.addEventListener('click', function() {
            // Cria a const 'removeFromLocalDataCheck' que retorna true se o botão clicado é de um item gerado pelo 'localStorage'.
            const itemFromLocalDataCheck = btnRemoveItem.hasAttribute('data-local')
            
            // Se o botão clicado for de um item vindo do local storage.
            if (itemFromLocalDataCheck) {

                // Captura o valor daquele item.
                const itemToBeRemoved = btnRemoveItem.parentNode
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
                const itemToBeRemoved = btnRemoveItem.parentNode
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
        const inputTitle = nodeItem.querySelector('[data-value-title]')
        const inputAmount = nodeItem.querySelector('[data-value-amount]')
        const inputValue = nodeItem.querySelector('[data-value-value]')

        // Captura apenas o valor de titulo, amount e value dentro dos inputs.
        const itemTitle = inputTitle.value
        const itemAmount = inputAmount.value
        const itemValue = inputValue.value

        // Atualiza o array 'tempItemList' com as infos dos item daquela iteração.
        tempItemList.push({
            title: itemTitle,
            amount: itemAmount,
            value: itemValue
        })
    })

    // Cria o array 'itemsList' e popula com os itens da array 'tempItemList'.
    const itemsList = [...tempItemList]

    // Cria as consts que acessam os valores do que foi digitado nos inputs.
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
