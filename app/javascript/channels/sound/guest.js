import consumer from './consumer'

const sub = consumer.subscriptions.create('RoomChannel', {
  sound: function (name) {
    return this.perform('sound', { name })
  }
})
window.send = name => sub.sound(name)
