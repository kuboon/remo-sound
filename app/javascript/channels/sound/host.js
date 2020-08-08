import consumer from './consumer'

const hostElm = document.getElementById('host')
const AudioContext = window.AudioContext || window.webkitAudioContext
let context = new AudioContext()
const buffers = {}

function print (msg) {
  hostElm.insertAdjacentHTML('beforeend', `<p>${msg}</p>`)
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
document.addEventListener('touchstart', initAudioContext)
function initAudioContext () {
  document.removeEventListener('touchstart', initAudioContext)
  // wake up AudioContext
  const emptySource = context.createBufferSource()
  emptySource.start()
  emptySource.stop()
}
