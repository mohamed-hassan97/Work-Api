/* permet de demarrer le serveur de stats */
require( 'seneca' )()
    .use('entity')
    .use( 'stats' ) // indique l'utilisation du plugin stats
    .listen({port:5000,pin:'role:stats,cmd:*'})  // ecoute le port 5000 et qu'il reçois que les message 'role:stats,cmd*"