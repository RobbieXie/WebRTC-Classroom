var fs            = require('fs');
var child_process = require('child_process');



//var FFMPEG_DIR = '/opt/ffmpeg/bin/';
var FFMPEG_DIR = '/usr/local/bin/';



function maxOfArr(arr) {
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
	return arr.reduce(function(prev, curr/*, idx, arr*/) {
		return Math.max(prev, curr);
	});
}



var FPS     = 25;
var frameTime = 1 / FPS; // TODO not sure this is the best approach, adding one fictitious frame
function findVideoDuration(fp, cb) {
	var out = [];

	// var args = [
	// 	FFMPEG_DIR + 'ffprobe',
	// 	'-v', 'quiet', // less verbose
	// 	'-print_format', 'json', // output json
	// 	'-show_format', // return format info
	// 	// '-show_streams',
	// 	fp
	// ];
	var args = [ FFMPEG_DIR+'ffmpeg', '-i', fp,'-progress','-', '-f', 'null', '-'];

	console.log(args.join(' '));

	var cmd = args.shift();

	var proc = child_process.spawn(cmd, args);

	proc.stdout.on('data', function(data) {
		out.push( data.toString() );
	});

	proc.stderr.on('data', function(data) {
		// out.push( data.toString() );
	});

	proc.on('close', function() {
		//console.log('close');
		out = out.join('');

		out = parseInt(out.match(/out_time_ms=(.*)\n/)[1])/1000000;

		console.log("duration new = " + out);
		var d = out;
		// out = JSON.parse(out);
		// var d = parseFloat( out.format.duration );

		cb(null, d);
	});
}



function computeStartTimes(fileDataArr) {
	var t = 0;
	fileDataArr.forEach(function(fd) {
		fd.t0 = t;
		t += fd.duration + frameTime;
	});
}



// o {fp, t0}
function webm2Mpegts(o, cb) {
	var out = [];
	var err = [];

	var t0 = o.t0;
	var fp = o.filePath;
	var fp2 = fp.replace('.webm', '.ts');
	o.filePath2 = fp2;
	o.fileName2 = o.fileName.replace('.webm', '.ts');

	var args = [
		FFMPEG_DIR + 'ffmpeg',
		'-v', 'quiet', // less verbose
		'-loglevel', 'error',
		'-i', fp, // inpuf file(s)
		'-vcodec', 'libx264', // video codec
		'-acodec', 'copy', // audio codec
		// '-tune', 'zerolatency', // optimize for streaming?
		'-r', FPS, // frame rate (fps)
		'-profile:v', 'baseline', // ?
		'-b:v', '800k', // video bitrate
		'-b:a', '48k', // audio bitrate
		'-f', 'mpegts', // desired format
		// '-fflags', '+igndts', // WTF?! https://trac.ffmpeg.org/ticket/3558
		'-strict', 'experimental', // https://trac.ffmpeg.org/ticket/1839
		'-mpegts_copyts', '1',
		// '-filter:v', "'setpts=10+PTS'", // https://www.ffmpeg.org/ffmpeg-filters.html#toc-setpts_002c-asetpts
		'-filter:v', 'setpts=PTS+' + t0 + '/TB',
		//-async 1
		'-y', // overwrite output files
		fp2 // output file
	];

	console.log(args.join(' '));

	var cmd = args.shift();

	var proc = child_process.spawn(cmd, args);

	proc.stdout.on('data', function(data) {
		out.push( data.toString() );
	});

	proc.stderr.on('data', function(data) {
		err.push( data.toString() );
	});

	proc.on('close', function() {
		out = out.join('').trim();
		err = err.join('').trim();
		if (out) { console.log('\nOUT\n' + out + '\n'); }
		if (err) { console.log('\nERR\n' + err + '\n'); }
		
		cb(null, fp2);
	});
}



function generateM3u8Playlist(fileDataArr, playlistFp, isLive, cb) {
	var durations = fileDataArr.map(function(fd) {
		return fd.duration;
	});
	var maxT = maxOfArr(durations);

	var meta = [
		'#EXTM3U',
		'#EXT-X-VERSION:3',
		'#EXT-X-MEDIA-SEQUENCE:0',
		'#EXT-X-ALLOW-CACHE:YES',
		'#EXT-X-TARGETDURATION:' + Math.ceil(maxT),
	];

	fileDataArr.forEach(function(fd) {
		meta.push('#EXTINF:' + fd.duration.toFixed(2) + ',');
		meta.push( fd.fileName2 );
	});

	if (!isLive) {
		meta.push('#EXT-X-ENDLIST');
	}
	
	meta.push('');
	meta = meta.join('\n');

	fs.writeFile(playlistFp, meta, cb);
}



module.exports = {
	findVideoDuration:    findVideoDuration,
	computeStartTimes:    computeStartTimes,
	webm2Mpegts:          webm2Mpegts,
	generateM3u8Playlist: generateM3u8Playlist
};
