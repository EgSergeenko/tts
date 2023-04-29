const params = (new URL(document.location)).searchParams
const channel = params.get('channel') || null

let textarea = document.getElementById("textarea")
let count = document.getElementById("count")
let tiplink = document.getElementById("tip-link")

if(channel) {
    tiplink.href = `https://streamelements.com/${channel}/tip`
}

loadVoices()
loadSounds()

function goToTip(e) {
    e.preventDefault()
    navigator.clipboard.writeText(textarea.value.trim()).then(() => {
        window.open(e.target.href, '_blank').focus()
    })
}

function showEverything() {
    document.getElementById("disclaimer").style.visibility = "hidden"
}


function createVoice(name, dicto) {
    let channels = dicto['channels'] || []
    
    if(channel && channels.length && !channels.includes(channel)) {
        return
    }

    
    let row = document.createElement("div")
    row.className = "voiceRow"


    let voice = document.createElement("div")
    voice.innerText = name
    voice.className = "voiceName"


    let audio = document.createElement("audio")
    audio.className = "audio"
    audio.id = name+"audio"
    audio.type = 'audio/mpeg'
    audio.volume = 0.5


    let example = dicto['example']
    audio.src = example


    let alts = document.createElement("div")
    alts.className = "alts"
    alts.innerText = "Альтернативы: "
    alts.id = name+"alt"
    let aliases = dicto['aliases']

    let variants = [name]
    aliases.forEach(element => {
        let text = alts.innerText
        if(text.includes("Альтернативы: ")) {
            alts.innerText = text+" | "+element
        } else {
            alts.innerText = "Альтернативы: "+element
        }
        variants.push(element)
    })

    voice.dataset.variants = variants


    let table = document.getElementById('voices')
    table.appendChild(row)
    row.appendChild(voice)
    row.appendChild(audio)
    table.appendChild(alts)


    if(dicto['status']==='upcoming'){
        row.className += " upcomingRow"
        voice.className += " upcomingName"
        alts.className += " upcomingAlts"
        voice.title = "Этот голос ещё в разработке."
        return
    }

    voice.title = "Кликни, чтобы давать этот голос в окно ввода."

    voice.addEventListener("click", (event) => {
        let variants = event.target.dataset.variants.split(',')
        let name = variants.reduce((a, b) => a.length <= b.length ? a : b)
        let newValue = (textarea.value + " " + name + ": ").replaceAll("  ", " ")
        if(newValue.length<=255) {
            textarea.value = newValue
        } else {
            alert("Текст не должен содержать больше 255 символов.")
        }
        changeCount()
    }, false);


    voice.addEventListener("mouseover", (event) => {
        let sound_element = document.getElementById(name+"audio")
        sound_element.play()
        let alts = document.getElementById(name+"alt")
        alts.style.transition = "max-height 1s ease-in-out"
        alts.style.maxHeight = "200px"
    }, false);


    voice.addEventListener("mouseleave", (event) => {
        let sound_element = document.getElementById(name+"audio")
        sound_element.pause()
        sound_element.currentTime = 0
        let alts = document.getElementById(name+"alt")
        alts.style.transition = "max-height 0.5s ease-in-out"
        alts.style.maxHeight = "0px"
    }, false);
}


function createSound(name, link) {

    let row = document.createElement("div")
    row.className = "soundRow"

    let sound = document.createElement("div")
    sound.innerText = name
    sound.className = "soundName"

    let audio = document.createElement("audio")
    audio.className = "audio"
    audio.id = name+"audio"
    audio.type = 'audio/mpeg'
    audio.src = link
    audio.volume = 0.5

    let table = document.getElementById('sounds')
    table.appendChild(row)
    row.appendChild(sound)
    row.appendChild(audio)

    sound.addEventListener("click", (event) => {
        let name = event.target.innerText
        let newValue = (textarea.value + " #" + name).replaceAll("  ", " ")
        if(newValue.length<=255) {
            textarea.value = newValue
        } else {
            alert("Текст не должен содержать больше 255 символов.")
        }
        changeCount()
    }, false);

    sound.addEventListener("mouseover", (event) => {
        let sound_element = document.getElementById(name+"audio")
        sound_element.play()
    }, false);

    sound.addEventListener("mouseleave", (event) => {
        let sound_element = document.getElementById(name+"audio")
        sound_element.pause()
        sound_element.currentTime = 0
    }, false);
}


function changeCount() {
    if(textarea.value.length!=0) {
        count.innerText = textarea.value.length
        if(channel){
            tiplink.style.visibility = "visible"
        }
        
    }else{
        count.innerText = ""
        if(channel){
            tiplink.style.visibility = "hidden"
        }
    }
}


function loadSounds() {
    let url = "sounds.txt"
    let storedtext, name, link;

    fetch(url)
        .then(function(response) {
            response.text().then(function(text) {
                storedtext = text.split("\n")
                storedtext.forEach(element => {
                    name = element.split("|")[0]
                    link = element.split("|")[1]

                    createSound(name, link)
                })
            })
        })
}


function loadVoices() {
    let url = "voices.json"
    let name

    fetch(url)
        .then(function(response) {
            response.json().then(function(data) {
                for (let [key, value] of Object.entries(data)) {
                    name = key
                    dicto = value
                    createVoice(name, dicto)
                }
            })
        })
}

