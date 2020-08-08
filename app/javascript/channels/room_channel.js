if (document.getElementById('guest')) {
  require('./sound/guest')
} else if (document.getElementById('host')) {
  require('./sound/host')
} else if (document.getElementById('graph')) {
  require('./sound/graph')
}
