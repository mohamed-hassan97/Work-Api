const Seneca = require('seneca')

// obtention d'une instance de Seneca
var seneca = Seneca()

var count = 0 // compteur local au service

// definition d'un plugin (constituant ici le microservice)
var counter = function (options) {

  // A la réception du message counter:inc 
  // déclencher l'incrémentation du compteur...
  this.add('counter:inc', function (msg, done) {
    count = count + 1
    console.log('counter value = ' + count)
    done(null, {value: count})
  })

  this.add('counter:dec', function (msg, done) {
    count = count - 1
    done(null, {value: count})
  })

  return 'counter' // nom du plugin
}

seneca.use(counter) // enregistrement du plugin ds Seneca


// a decommenter lors de l'utilisation de RESTcounter
// mais il faudra alors commenter la ligne du dessus (repl)
seneca.listen(4000)
