import consumer from './consumer'

const sub = consumer.subscriptions.create('RoomChannel', {
  sound: function (name) {
    return this.perform('sound', { name })
  }
})
window.send = name => sub.sound(name)
const dice = Math.floor(Math.random() * 6) + 1
window.gakki = () => sub.sound('gakki' + dice)
