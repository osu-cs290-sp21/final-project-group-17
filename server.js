var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');
var cors = require('cors');

var champisonData = require('./champisonData');
var itemData = require('./itemData');
var esportsData = require('./esportsData');
 
var app = express();
app.use(cors());
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('homePage');
});

app.get('/list', function (req, res, next) {
  res.status(200).render('peoplePage', {
    list: champisonData
  });
});

app.get('/item', function (req, res, next) {
  res.status(200).render('itemPage',{
    item:itemData
  });
});

app.get('/esports', function (req, res, next) {
  res.status(200).render('esportsPage',{
    esports:esportsData
  });
});

app.get('/list/:champison', function (req, res, next) {
  var champison = req.params.champison.toLowerCase();
  if (champisonData[champison]) {
    res.status(200).render('photoPage', champisonData[champison]);
  } else {
    next();
  }
});

app.get('/esports/:team', function (req, res, next) {
  var team = req.params.team.toLowerCase();
  if (esportsData[team]) {
    res.status(200).render('photoPage', esportsData[team]);
  } else {
    next();
  }
});

app.get('/item/:items', function (req, res, next) {
  var items = req.params.items.toLowerCase();
  if (itemData[items]) {
    res.status(200).render('photoPage', itemData[items]);
  } else {
    next();
  }
});


app.post('/list/:champison/addPhoto', function (req, res, next) {
  console.log("== req.body:", req.body)
  if (req.body && req.body.url && req.body.caption) {
    var champison = req.params.champison.toLowerCase();
    if (champisonData[champison]) {
      champisonData[champison].photos.push({
        url: req.body.url,
        caption: req.body.caption
      })
      console.log("== champisonData[" + champison + "]:", champisonData[champison])
      fs.writeFile(
        __dirname + '/champisonData.json',
        JSON.stringify(champisonData, null, 2),
        function (err) {
          if (err) {
            res.status(500).send("Error writing new data.  Try again later.")
          } else {
            res.status(200).send()
          }
        }
      )
    } else {
      next()
    }
  } else {
    res.status(400).send("Request needs a JSON body with 'url' and 'caption'.")
  }
})

app.post('/item/:single/addPhoto', function (req, res, next) {
  console.log("== req.body:", req.body)
  if (req.body && req.body.url && req.body.caption) {
    var single = req.params.single.toLowerCase();
    if (itemData[single]) {
      itemData[single].photos.push({
        url: req.body.url,
        caption: req.body.caption
      })
      console.log("== itemData[" + single + "]:", itemData[single])
      fs.writeFile(
        __dirname + '/itemData.json',
        JSON.stringify(itemData, null, 2),
        function (err) {
          if (err) {
            res.status(500).send("Error writing new data.  Try again later.")
          } else {
            res.status(200).send()
          }
        }
      )
    } else {
      next()
    }
  } else {
    res.status(400).send("Request needs a JSON body with 'url' and 'caption'.")
  }
})


app.get('/list/:champison/:photoIdx', function (req, res, next) {
  var champison = req.params.champison.toLowerCase();
  var photoIdx = parseInt(req.params.photoIdx);
  if (champisonData[champison]) {
    res.status(200).render('photoPage', {
      name: champisonData[champison].name,
      photos: [ champisonData[champison].photos[photoIdx] ]
    });
  } else {
    next();
  }
});

app.get('/item/:single/:photoIdx', function (req, res, next) {
  var single = req.params.single.toLowerCase();
  var photoIdx = parseInt(req.params.photoIdx);
  if (itemData[single]) {
    res.status(200).render('photoPage', {
      name: itemData[single].name,
      photos: [ itemData[single].photos[photoIdx] ]
    });
  } else {
    next();
  }
});

app.post('/esports/:single/addPhoto', function (req, res, next) {
    console.log('== req.body:', req.body);
    if (req.body && req.body.url && req.body.caption) {
        var single = req.params.single.toLowerCase();
        if (esportsData[single]) {
            esportsData[single].photos.push({
                url: req.body.url,
                caption: req.body.caption,
            });
            console.log('== esportsData[' + single + ']:', esportsData[single]);
            fs.writeFile(
                __dirname + '/esportsData.json',
                JSON.stringify(esportsData, null, 2),
                function (err) {
                    if (err) {
                        res.status(500).send(
                            'Error writing new data.  Try again later.'
                        );
                    } else {
                        res.status(200).send();
                    }
                }
            );
        } else {
            next();
        }
    } else {
        res.status(400).send(
            "Request needs a JSON body with 'url' and 'caption'."
        );
    }
});

app.get('/esports/:single/:photoIdx', function (req, res, next) {
    var single = req.params.single.toLowerCase();
    var photoIdx = parseInt(req.params.photoIdx);
    if (esportsData[single]) {
        res.status(200).render('photoPage', {
            name: esportsData[single].name,
            photos: [esportsData[single].photos[photoIdx]],
        });
    } else {
        next();
    }
});


app.get('*', function (req, res, next) {
  res.status(404).render('404', {
    page: req.url
  });
});

app.listen(port, function () {
  console.log("== Server listening on port", port);
})
