function show_everything() {
  let button = document.getElementById("show")
  button.style.visibility = "hidden"
}


function showTips() {
  let tips = document.getElementById("img2")
  tips.style.visibility = "visible"
  tips.style.opacity = 1
}


function hideTips() {
  let tips = document.getElementById("img2")
  tips.style.visibility = "hidden"
  tips.style.opacity = 0
}


function createVoice(name, dicto) {
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

  let alternatives = document.createElement("div")
  alternatives.className = "alternatives"
  alternatives.innerText = "Альтернативы: "
  alternatives.id = name+"alt"
  let aliases = dicto['aliases']

  aliases.forEach(element => {
    let text = alternatives.innerText
    if(text.length>14) {
      alternatives.innerText = text+" | "+element
    } else {
      alternatives.innerText = "Альтернативы: "+element
    }
  })

  let table = document.getElementById('voices')
  table.appendChild(row)
  row.appendChild(voice)
  row.appendChild(audio)
  table.appendChild(alternatives)

  voice.addEventListener("click", (event) => {
    let input = document.getElementById("input2")
    let text = input.innerText.trim()
    let name = event.target.innerText

    if(name=="UselessMouth") {
      name = "Юзя"
    } // Сделать выбор кратчайшей альтернативы

    input.innerText = text+" "+name+":"
    change_count()
  }, false);

  voice.addEventListener("mouseover", (event) => {
    let sound_element = document.getElementById(name+"audio")
    sound_element.play()
    let alternatives = document.getElementById(name+"alt")
    alternatives.style.transition = "max-height 1s ease-in-out"
    alternatives.style.maxHeight = "200px"
  }, false);

  voice.addEventListener("mouseleave", (event) => {
    let sound_element = document.getElementById(name+"audio")
    sound_element.pause()
    sound_element.currentTime = 0
    let alternatives = document.getElementById(name+"alt")
    alternatives.style.transition = "max-height 0.5s ease-in-out"
    alternatives.style.maxHeight = "0px"
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
    let input = document.getElementById("input2")
    let text = input.innerText.trim()
    let name = event.target.innerText
    input.innerText = text+" #"+name
    change_count()
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


function change_count() {
  let input = document.getElementById("input2")
  let count = document.getElementById("count")

  if(input.innerText.length!=0) {
      count.innerText = input.innerText.length
    }else{
      count.innerText = ""
    }
}


function load_sounds() {
  let url = "https://raw.githubusercontent.com/declider/tts/main/sounds.txt"
  let storedtext, name, link;

  fetch(url)
    .then(function(response) {
      response.text().then(function(text) {
        storedtext = text.split("\n");
        storedtext.forEach(element => {
          name = element.split("|")[0]
          link = element.split("|")[1]

          createSound(name, link)
        })
      });
    });
}


function load_voices() {
  let url = "https://raw.githubusercontent.com/declider/tts/main/voices.json"
  let name, link;

  fetch(url)
    .then(function(response) {
      response.json().then(function(data) {
        for (let [key, value] of Object.entries(data)) {
          name = key
          dicto = value
          console.log('Жопа')
          createVoice(name, dicto)
        }
      })
    })
}


function load() {
  document.body.addEventListener('click', show_everything)
  document.getElementById("input2").addEventListener("DOMCharacterDataModified", change_count)
  load_voices()
  load_sounds()
}

window.onload = load
