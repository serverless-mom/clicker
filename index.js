var express = require('express'),
    cool = require('cool-ascii-faces'),
    chart = require('./lib/chart'),
    pg = require('pg');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', (request,response) => {
  response.send(cool())
});

app.get('/db', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM test_table', function(err, result) {
            done();
            if (err)
            { console.error(err); response.send("Error " + err); }
            else
            { response.render('pages/db', {results: result.rows} ); }
        });
    });
});

app.get('/steve', (request,response) => {
    var data = [1, 2, 12, 12, 12, 21, 21, 39];
    dataChart = chart(data, {
        pointChar: 'X',
        negativePointChar: '░',
        padding: 4
    });
    response.send( dataChart.replace(/(?:\r\n|\r|\n)/g, '<br />')); //very hacky newline cludge. Do this differently

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


