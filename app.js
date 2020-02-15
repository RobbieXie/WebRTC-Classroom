var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var mimeTypes = {
	'js':   'application/javascript',
	'html': 'text/html',
	'ts':   'video/mp2t',
	'mp4':  'video/mp4',
	'webm': 'video/webm',
	'm3u8': 'application/x-mpegURL'
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let u = req.url;
  if ((/^\/videos\/?/).test(u)) {
    var path = u.substring(1);
    var mimeType = mimeTypes[u.split('.').pop()];

    fs.stat('./' + path, function (err, stats) {
      if (err) {
        return respond(res, ['text/plain', '404', 404]);
      }

      var total = stats.size;

      if (req.headers.range) { // ranged request
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, '').split('-');
        var partialStart = parts[0];
        var partialEnd = parts[1];
        var start = parseInt(partialStart, 10);
        var end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
        var chunkSize = (end - start) + 1;

        var fStream = fs.createReadStream(path, {
          start: start,
          end: end
        });

        var rangeS = ['bytes ', start, '-', end, '/', total].join('');

        res.writeHead(206, { // ranged download
          'Content-Range': rangeS,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': mimeType,
          'Access-Control-Allow-Origin': '*'
        });

        console.log([u, 206, mimeType, rangeS].join(' '));
        fStream.pipe(res);
      }
      else { // regular request
        res.writeHead(200, { // regular download
          'Content-Length': total,
          'Content-Type': mimeType,
          'Access-Control-Allow-Origin': '*'
        });
        console.log([u, 200, mimeType, 'all'].join(' '));
        fs.createReadStream(path).pipe(res);
      }
    });
  } else {
    next(createError(404));
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function respond(res, pair, code) {
	res.writeHeader(
		code || 200,
		{
			'Content-Type':                pair[0],
			'Access-Control-Allow-Origin': '*'
		}
	);
	res.write(pair[1]);  
	res.end();
}

module.exports = app;
