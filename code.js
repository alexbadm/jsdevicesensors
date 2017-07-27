window.onerror = function (error) { window.alert(error.message) }
var Observable = window.Rx.Observable
var container = document.getElementById('root')

var events = [
  'devicemotion',
  'deviceorientation',
  'orientationchange',
  'devicelight',
  'deviceproximity',
  'userproximity'
]

var htmlTemplate = function (eventName) {
  var doc = document.createElement('div')
  var title = document.createElement('h1')
  title.textContent = eventName
  doc.appendChild(title)
  doc.appendChild(document.createElement('div'))
  return doc
}

events.forEach(eventName => {
  var snippet = htmlTemplate(eventName)
  var eventLogContainer = snippet.lastElementChild
  container.appendChild(snippet)

  var counter = 0
  function eventHandler (e) {
    console.log(`${eventName} event`, e)
    counter++
    switch (eventName) {
      case 'devicemotion':
        eventLogContainer.innerHTML = devicemotionHtml(counter, e)
        break
      case 'deviceorientation':
        eventLogContainer.innerHTML = deviceorientationHtml(counter, e)
        break
      default:
        eventLogContainer.innerHTML = eventHtml(counter, e)
    }
  }

  // window.addEventListener(eventName, eventHandler)
  var eventCurrent$ = Observable.fromEvent(window, eventName).throttleTime(500)
  eventCurrent$.subscribe(eventHandler)
})

function eventHtml (counter, event) {
  return `${counter}: ${event.toString()}
    <br />
    type: ${event.type}
    <br />
    target: ${event.target}`
}

var axisFields = [ 'x', 'y', 'z' ]
var rotationFields = [ 'alpha', 'beta', 'gamma' ]

function devicemotionHtml (counter, event) {
  return `${counter}: ${event.toString()}
    <br />
    <strong>acceleration</strong>
    ${axisFields.map(field => `<br />${field}: ${event.acceleration[field]}`)}
    <br />
    <strong>accelerationIncludingGravity</strong>
    ${axisFields.map(field => `<br />${field}: ${event.accelerationIncludingGravity[field]}`)}
    <br />
    <strong>rotationRate</strong>
    ${rotationFields.map(field => `<br />${field}: ${event.rotationRate[field]}`)}
    <br />
    <strong>interval</strong>: ${event.interval}
  `
}

function deviceorientationHtml (counter, event) {
  return `${counter}: ${event.type}${rotationFields.map(field => `<br />${field}: ${event[field]}`)}`
}
