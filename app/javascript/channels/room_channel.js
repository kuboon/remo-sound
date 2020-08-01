import consumer from './consumer'

const hostElm = document.getElementById('host')
function print (msg) {
  hostElm.insertAdjacentHTML('beforeend', `<p>${msg}</p>`)
}
if (hostElm) {
  consumer.subscriptions.create('RoomChannel', {
    connected () {
      print('接続しました')
    },

    disconnected () {
      print('切断しました')
    },

    received (data) {
      print('受信: ' + data)
      const source = context.createBufferSource()
      source.buffer = buffers[data]
      source.connect(context.destination)
      source.noteOn(0)
    },

    sound: function () {
      return this.perform('sound')
    }
  })

  const audioFiles = ['cheer', 'applause']
  const context = new AudioContext()
  const buffers = {}
  audioFiles.forEach(n =>
    fetch(`/sounds/${n}.mp3`)
      .then(r => r.arrayBuffer())
      .then(x => context.decodeAudioData(x))
      .then(buf => (buffers[n] = buf))
  )
}
