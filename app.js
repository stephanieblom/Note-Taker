const express = require( "express" );
const bodyParser = require('body-parser')
const fs = require("fs");

const PORT = 8080;
const app = express();

// to serve static content from the 'html' directory
app.use(express.static('public'));
// needed for POST FORM decoding
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, function() {
    console.log(`App running on: http://localhost:${PORT}`);
  });

// initial sample data
let myNotes = []; 

// our routes
app.get( '/notes', function( req, res ){
  fs.readFile("db.json", "utf8", function(error, data) {

    if (error) {
      return console.log(error);
    }
  
    console.log(data);
    if (data == undefined){
      myNotes =[];
    }else 
    myNotes = JSON.parse(data)
  
  });
    res.send( myNotes );
})

app.post( '/api/notes', function( req, res ){
  
    console.log( `<< inserting note: `, req.body );
    // save the data to our table
    myNotes.push( req.body );
    myNotes = JSON.stringify( myNotes )
    
    fs.writeFile("db.json", myNotes, function(error)  {

      if (error) {
        return console.log(error);
      }
    
      console.log(myNotes);
    
    });
    res.send( { message: `saved: ${req.body.name}` } );
});

app.post( '/api/notes/:id', async function( req, res ){

    const id = req.params.id;

    myNotes.splice(id, 1)
    console.log(`Notes: ${myNotes}`)

    fs.writeFile("db.json", myNotes, function(error)  {

      if (error) {
        return console.log(error);
      }
    
      console.log(myNotes);
    
    });
    res.send( { message: `Finished deleting id ${id}` } );
}) // app.delete()

