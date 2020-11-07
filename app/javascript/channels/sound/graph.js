import consumer from './consumer'

const canvas = document.getElementById('graph')
const log = document.getElementById('log')
function print (msg) {
  log.insertAdjacentHTML('beforeend', `<p>${msg}</p>`)
}
consumer.subscriptions.create({channel: 'RoomChannel', key: ch_key}, {
  connected () {
    print('接続しました')
  },

  disconnected () {
    print('切断しました')
  },

  received (data) {
    const { name } = data
    count((name.startsWith('gakki') ||name.startsWith('applause')) ? 'gakki' : name)
  }
})

Object.withDefault = (defaultValue, o = {}) => {
  return new Proxy(o, {
    get: (o, k) => (k in o ? o[k] : defaultValue)
  })
}

const size = 20
const buf = Array.from({ length: size }, () => Object.withDefault(0))
let yMax = 10
function count (name) {
  buf[size - 1][name] += 1
  buf[size - 2][name] += 1
  yMax = Math.max(yMax, buf[size - 1][name], buf[size - 2][name])
  draw()
  print('再生: ' + name)
}
const ctx = canvas.getContext('2d')
const barWidth = canvas.width / size
function onInterval () {
  buf.shift()
  buf.push(Object.withDefault(0))
  draw()
}
setInterval(onInterval, 1000)
const props = {
  clap: { color: 'green', yAxis: -1 },
  gakki: { color: 'blue', yAxis: -1 },
  choice: { color: 'red', yAxis: 1 }
}
function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.lineWidth = 10
  Object.keys(props).forEach(name => {
    const { color, yAxis } = props[name]
    ctx.strokeStyle = color
    const yFactor = ((canvas.height / yMax) * yAxis) / 2
    const yZero = canvas.height / 2
    ctx.beginPath()
    ctx.moveTo(0, yZero)
    buf.forEach((o, i) => {
      const v = o[name]
      ctx.lineTo(barWidth * i, yZero + v * yFactor)
    })
    ctx.stroke()
  })
}
