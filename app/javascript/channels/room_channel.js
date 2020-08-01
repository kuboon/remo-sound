import consumer from './consumer'

const hostElm = document.getElementById('host')
if (hostElm) {
  consumer.subscriptions.create('RoomChannel', {
    connected () {
      // Called when the subscription is ready for use on the server
    },

    disconnected () {
      // Called when the subscription has been terminated by the server
    },

    received (data) {
      const source = context.createBufferSource()
      source.buffer = buffers[data]
      source.connect(context.destination)
      source.start()
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
