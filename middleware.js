var express = require('express');
var app = express();

var logger = require('./logger');
app.use(logger);

// Load html page using express
// app.get('/', function(request, response) {
//   response.sendFile(__dirname + '/public/index.html') ;
// });


// .use will serve files from folder without using dirname etc.
// defaults to serve index.html
app.use(express.static('public'));
// blocks as objects with descriptions
var blocks = {
    'Fixed': 'Fastened securely in position',
    'Movable': 'Capable of being moved',
    'Rotating': 'Moving in a circle around its center'
};

var locations = {
    'Fixed': 'First Floor',
    'Movable': 'Second floor',
    'Rotating': 'Third floor'
};

// app.param maps placeholders to call back functions
app.param('name', function(request, response, next) {
    var name = request.params.name;
    var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
    
    request.blockName = block;

    next();
});

// Dynamic routes
app.get('/blocks/:name', function(request, response) {
    var description = blocks[request.blockName];
    // Returns error 404 if 'name' not found
    if (!description) {
        response.status(404).json('No description found for ' + request.params.name);   
    } else {
        response.json(description);    
    }
}); 

app.get('/locations/:name', function(request, response) {
    var location = locations[request.blockName];
    
    if (!location) {
        response.status(404).json('No location found for ' + request.params.name);   
    } else {
        response.json(location);    
    }
})

// Static route, uses blocks as an array
app.get('/blocks', function(request, response) {
    var blocks = ['Fixed', 'Movable', 'Rotating'];
    // query string param to limit number of blocks returned
    if (request.query.limit >= 0) {
        response.json(blocks.slice(0, request.query.limit))
    } else {
        response.json(blocks);
    }
});

app.listen(process.env.PORT, function() {
    console.log(process.env.PORT);
});