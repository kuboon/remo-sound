import consumer from './consumer'

const canvas = document.getElementById('graph')
const log = document.getElementById('log')
function print (msg) {
  log.insertAdjacentHTML('beforeend', `<p>${msg}</p>`)
}
consumer.subscriptions.create('RoomChannel', {
  connected () {
    print('接続しました')
  },

  disconnected () {
    print('切断しました')
  },

  received (data) {
    count(data.name)
  }
})

const size = 20
const buf = Array.from({ length: size }, () => 0)
let yMax = 10
function count (name) {
  buf[size - 1] += 1
  buf[size - 2] += 1
  yMax = Math.max(yMax, buf[size - 1], buf[size - 2])
  draw()
  print('再生: ' + name)
}
const ctx = canvas.getContext('2d')
const barWidth = canvas.width / size
function onInterval () {
  buf.shift()
  buf.push(0)
  draw()
}
setInterval(onInterval, 1000)
function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'green'
  const yFactor = canvas.height / yMax
  buf.forEach((v, i) => {
    ctx.fillRect(barWidth * i, canvas.height, barWidth, -v * yFactor)
  })
}
