require( 'seneca' )()
    .use('entity')
    .use( 'stats' )
    .listen({port:5000,pin:'role:stats,cmd:*'})