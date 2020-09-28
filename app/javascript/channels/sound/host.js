import consumer from './consumer'

const logElm = document.getElementById('log')
const AudioContext = window.AudioContext || window.webkitAudioContext
let context = new AudioContext()
const buffers = {}

function print (msg) {
  logElm.insertAdjacentHTML('afterbegin', `<p>${msg}</p>`)
}
consumer.subscriptions.create('RoomChannel', {
  connected () {
    print('接続しました')
  },

  disconnected () {
    print('切断しました')
  },

  received (data) {
    play(data.name)
  }
})

function sample (arr) {
  if (arr && arr.length) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}
function play (name) {
  print('受信: ' + name)
  let key
  switch (name) {
    case 'clap':
      key = sample(claps)
      break
    case 'applause':
      key = sample(kansei)
      break
    case 'choice':
      key = Array.from(document.querySelectorAll('input[name=choice]')).find(
        x => x.checked
      ).nextSibling.textContent
      break
    default:
      //gakki
      key = name
  }
  print('再生: ' + key)
  if (key === 'none') return
  try {
    const source = context.createBufferSource()
    source.buffer = buffers[key]
    source.connect(context.destination)
    source.start()
  } catch (e) {
    print(e)
  }
}

const claps = [...Array(9).keys()]
  .map(n => `clap0${n + 1}`)
  .concat('clap10', 'clap11')
const kansei = [...Array(6).keys()].map(n => `kansei${n + 1}`)
const gakki = [...Array(5).keys()].map(n => `gakki${n + 1}`)
const audioFiles = [...claps, ...kansei, ...gakki]
audioFiles.forEach(n =>
  fetch(`/sounds/${n}.wav`)
    .then(r => r.arrayBuffer())
    .then(x => context.decodeAudioData(x, buf => (buffers[n] = buf)))
    .catch(e => {
      print(e)
      print(JSON.stringify(e))
    })
)
const unlock = document.getElementById('unlock')
if (context.state === 'suspended') {
  unlock.addEventListener('touchstart', () => {
    context.resume()
    unlock.style.display = 'none'
  })
} else {
  unlock.style.display = 'none'
}
