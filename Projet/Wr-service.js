/* permet de demarrer le serveur de work */
require( 'seneca' )()
    .use('entity')
    .use( 'work' ) // indique l'utilisation du plugin work
    .client({port:5000,pin:'role:stats,cmd:*'}) // devient client du port 5000 de stat pour les notification
    .listen({port:4000,pin: 'role:wr,cmd:*'}) // ecoute le port 4000 et reçois que les message 'role:wr,cmd*"

