const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const Express = require('express')
const seneca = Seneca()
const BodyParser = require('body-parser')


var Routes = [
    {
        prefix: '/api/wr/stats',
        pin: 'role:stats,cmd:*',
        map: {
            get :{GET:true,name:'',suffix:'/:applicant?'}
        }
    },
    {
        prefix: '/api/wr',
        pin: 'role:wr,cmd:*',
        map: {
            get: {GET: true, name: '', suffix: '/:id?'},
            update: {PUT: true, name: '', suffix: '/:id?'},
            create: {POST: true, name: ''},
            delete: {DELETE: true, name: '', suffix: '/:id?'}
    }
}
];



seneca.use(SenecaWeb, {
    options: { parseBody: false }, // desactive l'analyseur JSON de Seneca
    routes: Routes,
    context: Express().use(BodyParser.json()),     // utilise le parser d'Express pour lire les donnees
    adapter: require('seneca-web-adapter-express') // des requetes PUT
})
seneca.use('entity')
seneca.client({      // ce module enverra les messages counter:*
    port: 5000,   // sur le port 4000 (qui est le port sur lequel le microservice
    pin:'role:stats,cmd:*'
})
seneca.client({      // ce module enverra les messages counter:*
    port: 4000, // sur le port 4000 (qui est le port sur lequel le microservice
    pin: 'role:wr,cmd:*',
})
//seneca.client({port:5000,})
// les requetes HTTP sont attendues sur le port 3000
// Pour tester :
// - lancer le service counter.js
// - lancer la passerelle RESTcounter.js
// - et tester avec : curl -H "Content-Type: application/json" -d '{"op":"inc"}' -X PUT http://localhost:3000/counter

seneca.ready(() => {
    const app = seneca.export('web/context')()
    app.listen(3000)
})

