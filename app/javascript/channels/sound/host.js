import consumer from './consumer'

const logElm = document.getElementById('log')
const AudioContext = window.AudioContext || window.webkitAudioContext
let context = new AudioContext()
const buffers = {}

function print (msg) {
  logElm.insertAdjacentHTML('afterbegin', `<p>${msg}</p>`)
}
consumer.subscriptions.create({channel: 'RoomChannel', key: ch_key}, {
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
    case 'choice':
      key = Array.from(document.querySelectorAll('input[name=choice]')).find(
        x => x.checked
      ).nextSibling.textContent
      break
    default:
      key = name
  }
  const file = sample(audioFiles[key])
  print('再生: ' + file)
  if (key === 'none') return
  try {
    const source = context.createBufferSource()
    source.buffer = buffers[file]
    source.connect(context.destination)
    source.start()
  } catch (e) {
    print(e)
  }
}

const clap = [...Array(5).keys()].map(n => `clap${n}.m4a`)
const applause = [...Array(6).keys()].map(n => `kansei${n + 1}.wav`)
const namuami = [...Array(3).keys()].map(n => `se/namuami${n + 1}.wav`)
const audioFiles = { clap, applause, namuami }
;[...Array(5).keys()]
  .map(n => `gakki${n + 1}`)
  .forEach(x => {
    audioFiles[x] = [`${x}.wav`]
  })

;['bell', 'coin', 'fuyuu', 'kane', 'osaisen'].forEach(x => {
  audioFiles[x] = [`se/${x}.mp3`]
})

const promises = Object.values(audioFiles)
  .flat()
  .map(n =>
    fetch(`/sounds/${n}`)
      .then(r => r.arrayBuffer())
      .then(x => context.decodeAudioData(x, buf => (buffers[n] = buf)))
      .catch(e => {
        print(e)
        print(JSON.stringify(e))
      })
  )
Promise.all(promises).then(() => print('音源ロード完了'))

const unlock = document.getElementById('unlock')
if (context.state === 'suspended') {
  unlock.addEventListener('touchstart', () => {
    context.resume()
    unlock.style.display = 'none'
  })
} else {
  unlock.style.display = 'none'
}
