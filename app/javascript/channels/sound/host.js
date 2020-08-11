import consumer from './consumer'

const logElm = document.getElementById('log')
const AudioContext = window.AudioContext || window.webkitAudioContext
let context = new AudioContext()
const buffers = {}

function print (msg) {
  logElm.insertAdjacentHTML('beforeend', `<p>${msg}</p>`)
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
function play (name) {
  try {
    print('再生: ' + name)
    if (name === 'choice') {
      name = Array.from(document.querySelectorAll('input[name=choice]')).find(
        x => x.checked
      ).id
      if (name === 'none') return
    }
    const source = context.createBufferSource()
    source.buffer = buffers[name]
    source.connect(context.destination)
    source.start()
  } catch (e) {
    print(e)
  }
}

const audioFiles = ['cheer', 'applause']
audioFiles.forEach(n =>
  fetch(`/sounds/${n}.mp3`)
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
