import consumer from './consumer'

const sub = consumer.subscriptions.create({channel: 'RoomChannel', key: ch_key}, {
  sound: function (name) {
    return this.perform('sound', { name })
  }
})
window.send = name => sub.sound(name)
const dice = Math.floor(Math.random() * 6) + 1
window.gakki = () => sub.sound('gakki' + dice)
