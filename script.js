let searchWord = document.getElementById('search-word')
let resultWord = document.getElementById('result-word')
let resultMeaning = document.getElementById('result-meaning')
let historySection = document.getElementById('history-section')


function onClickSaved() {
    historySection.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}

const clearOutput = () => {
    resultWord.innerText = ""
    resultMeaning.innerText = ""
    searchWord.value = ""
}
const capitalize = (string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1)
}
const genSavedItem = () => {
    const template = (word, meaning, id, time) => `<div>
    <div>${time}</div>
    <h4><span>word: </span><span>${word}</span></h4>
    <div class="card">
        <p class="card-para">${meaning}</p>
        <div class="card-end">
            <button onclick="deleteSavedItem(${id})">
                <img class="dlt-btn" src="container/delete.svg" alt="delete" />
            </button>
        </div>
    </div>
</div>
`

    let tempSavedResult = localStorage.getItem("result")
    try {
        tempSavedResult = JSON.parse(tempSavedResult)
        if (Array.isArray(tempSavedResult)) {
            tempSavedResult.sort((a, b)=>b.id-a.id)
            tempSavedResult = tempSavedResult.map((test) => template(test.word, test.meaning, test.id, (new Date(test.time)).toLocaleString()))
            historySection.innerHTML = tempSavedResult
        }
    } catch (e) {

    }
}

const deleteSavedItem = (id) => {
    let savedResult = localStorage.getItem("result")
    try {
        savedResult = JSON.parse(savedResult)
        if (Array.isArray(savedResult)) {
            savedResult = savedResult.filter((i) => i.id != id)
            localStorage.setItem("result", JSON.stringify(savedResult))
            genSavedItem()
        }
    }
    catch (e) {
        console.log(e);
    }
}


const onSubmit = async () => {
    resultWord.innerText = ""
    resultMeaning.innerText = ""
    let sw = searchWord.value;
    if (sw) {
        await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${sw}`).then(async (e) => {
            if (e.status !== 404) {
                let result = await e.json()
                result = result[0]
                resultWord.innerText = result.word
                let meaning = result.meanings[0].definitions[0].definition
                resultMeaning.innerText = meaning
                let savedResult = localStorage.getItem("result")
                try {
                    savedResult = JSON.parse(savedResult)
                    if (Array.isArray(savedResult)) {
                        savedResult.push({ word: result.word, meaning, time: new Date(), id: Date.now() })
                    } else {
                        savedResult = [{ word: result.word, meaning, time: new Date(), id: Date.now() }]
                    }
                    localStorage.setItem("result", JSON.stringify(savedResult))
                    genSavedItem()
                }
                catch (e) {
                    console.log(e);
                    localStorage.setItem("result", JSON.stringify([{ word: result.word, meaning, time: new Date(), id: Date.now() }]))
                }
            }

        })

    }
}

genSavedItem()