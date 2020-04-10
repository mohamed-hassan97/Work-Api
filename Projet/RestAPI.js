require( 'seneca' )()
    .use('entity')
    .use( 'work' )
    .client({port:5000,pin:'role:stats,cmd:*'})
    .listen({port:4000,pin: 'role:wr,cmd:*'})

