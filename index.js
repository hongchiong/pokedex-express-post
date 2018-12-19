/**
 * ===================================
 * Configs
 * ===================================
 */
const express = require('express');
const jsonfile = require('jsonfile');
const pokedex = 'pokedex.json';
const app = express();
const Request = require("request");
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// this line below, sets a layout look to your express project
const reactEngine = require('express-react-views').createEngine();
app.engine('jsx', reactEngine);
// this tells express where to look for the view files
app.set('views', __dirname + '/views');
// this line sets react to be the default view engine
app.set('view engine', 'jsx');

/**
 * ===================================
 * Routes
 * ===================================
 */

// app.get('/:id', (request, response) => {
//   // get json from specified file
//   jsonfile.readFile(pokedex, (err, obj) => {
//     // obj is the object from the pokedex json file
//     // extract input data from request
//     let inputId = parseInt( request.params.id );
//     var pokemon;
//     // find pokemon by id from the pokedex json file
//     for( let i=0; i<obj.pokemon.length; i++ ){
//       let currentPokemon = obj.pokemon[i];
//       if( currentPokemon.id === inputId ){
//         pokemon = currentPokemon;
//       }
//     }
//     if (pokemon === undefined) {
//       // send 404 back
//       response.status(404);
//       response.send("not found");
//     } else {
//       let html =
//       `<!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
//           <title>GA Pokedex</title>
//           <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
//           <link href="https://fonts.googleapis.com/css?family=Thasadith" rel="stylesheet">
//           <link rel="stylesheet" type="text/css" href="styles.css">
//         </head>
//         <body>
//             <div class="container">
//                     <img src=${pokemon.img}>
//                     <ul>
//                         <li>Number: #${pokemon.num}</li>
//                         <li>Name: ${pokemon.name}</li>
//                         <li>Height: ${pokemon.height}</li>
//                         <li>Weight: ${pokemon.weight}</li>
//                         <li>Type: ${pokemon.type}</li>
//                     </ul>
//                 <form name="type" method="POST" action='/pokemon/${pokemon.id}''>
//                     Pokemon Type: <select name='type'>
//                              <option value='normal'>Normal</option>
//                              <option value='fire'>Fire</option>
//                              <option value='water'>Water</option>
//                              <option value='electric'>Electric</option>
//                              <option value='grass'>Grass</option>
//                              <option value='ice'>Ice</option>
//                              <option value='fighting'>Fighting</option>
//                              <option value='poison'>Poison</option>
//                              <option value='ground'>Ground</option>
//                              <option value='flying'>Flying</option>
//                              <option value='psychic'>Psychic</option>
//                              <option value='bug'>Bug</option>
//                              <option value='rock'>Rock</option>
//                              <option value='ghost'>Ghost</option>
//                              <option value='dragon'>Dragon</option>
//                              <option value='dark'>Dark</option>
//                              <option value='steel'>Steel</option>
//                              <option value='fairy'>Fairy</option>
//                              </select>
//                     <input type='submit'/>
//                 </form>
//             </div>
//         </body>
//         </html>`
//       response.send(html);
//     }
//   });
// });

// //add pokemon types
// app.post("/pokemon/:id", (request, response) => {
//     jsonfile.readFile(pokedex, (err, obj) => {
//         let currentPokedex = obj;
//         let currentPokemon = obj.pokemon[request.params.id -1];
//         if (currentPokemon["type"] === undefined) {currentPokemon["type"] = [];};
//         currentPokemon["type"].push(request.body.type);
//         currentPokedex.pokemon[request.params.id -1] = currentPokemon;
//         jsonfile.writeFile("pokedex.json", currentPokedex, (err) => {
//             console.log(err);
//             // response.send(currentPokemon);
//             response.redirect(`http://localhost:3000/${request.params.id}`);
//         });
//     });
// });

// //add new pokemon
// app.post("/pokemon", (request,response) => {

//     jsonfile.readFile(pokedex, (err, obj) => {
//         let currentPokedex = obj;
//         let newPokemon = {
//           "id": currentPokedex.pokemon.length+1,
//           "num": (currentPokedex.pokemon.length+1).toString(),
//           "name": request.body.name,
//           "img": request.body.img,
//           "height": request.body.height,
//           "weight": request.body.weight,
//           "candy": "",
//           "candy_count": "",
//           "egg": "",
//           "avg_spawns": "",
//           "spawn_time": ""
//         }
//         currentPokedex.pokemon.push(newPokemon);
//         jsonfile.writeFile("pokedex.json", currentPokedex, (err) => {
//             console.log(err);
//             response.send(newPokemon);
//         });
//     });
// });


//REACT REFACTORING
//homepage. display all with sort
app.get('/', (request, response) => {
    jsonfile.readFile(pokedex, (err, obj) => {

        let pokedexAndSort = {};
        pokedexAndSort.pokedex = obj.pokemon;
        pokedexAndSort.sortby = request.query.sortby;

        response.render("pokemons", pokedexAndSort);
    });
});

//new pokemon form page
app.get("/pokemon/new", (request,response) => {
    response.render("newpokemon");
});

//create new pokemon
app.post("/pokemon/new", (request,response) => {
    jsonfile.readFile(pokedex, (err, obj) => {
        let currentPokedex = obj;
        let randomPokemon;
        if (request.body.name === "random") {
            //I'm not stopping repeated pokemons
            let randomNum = Math.floor(Math.random() * 809 + 1);
            Request.get("https://pokeapi.co/api/v2/pokemon/" + randomNum + "/", (error, reqres, body) => {
                if(error) {
                    return console.dir(error);
                }
                randomPokemon = JSON.parse(body);
                let newPokemon = {
                  "id": currentPokedex.pokemon.length+1,
                  "num": (currentPokedex.pokemon.length+1).toString(),
                  "name": randomPokemon.name,
                  "img": `https://www.serebii.net/pokemongo/pokemon/${randomPokemon.id}.png`,
                  "height": `${randomPokemon.height/10}.0 m`,
                  "weight": `${randomPokemon.weight/10}.0 kg`,
                  "candy": "",
                  "candy_count": "",
                  "egg": "",
                  "avg_spawns": "",
                  "spawn_time": ""
                };
                currentPokedex.pokemon.push(newPokemon);
                jsonfile.writeFile("pokedex.json", currentPokedex, (err) => {
                    console.log(err);
                    response.render("pokemon", newPokemon);
                });
            });
        } else {
            let newPokemon = {
              "id": currentPokedex.pokemon.length+1,
              "num": (currentPokedex.pokemon.length+1).toString(),
              "name": request.body.name,
              "img": request.body.img,
              "height": request.body.height,
              "weight": request.body.weight,
              "candy": "",
              "candy_count": "",
              "egg": "",
              "avg_spawns": "",
              "spawn_time": ""
            };
            currentPokedex.pokemon.push(newPokemon);
            jsonfile.writeFile("pokedex.json", currentPokedex, (err) => {
                console.log(err);
                response.render("pokemon", newPokemon);
            });
        };
    });
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));