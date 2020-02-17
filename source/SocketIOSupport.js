const SocketIOServer = require("socket.io");
let fs = require('fs');
let videoUtils = require('../FrontProjects/commons/videoUtils');

let roomTeacherMap = new Map();
let socketIdUsernameMap = new Map();
let fileDurationArrs = {};
let isLive = false;

function isDirSync(aPath) {
    try {
      return fs.statSync(aPath).isDirectory();
    } catch (e) {
      if (e.code === 'ENOENT') {
        return false;
      } else {
        throw e;
      }
    }
}

function lastN(arr, n) { // non-destructive
	arr = arr.slice();
	var l = arr.length;
	var i = l - n;
	if (i < 0) { i = 0; }
	return arr.splice(i, n);
}

function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function configSocketIO(server) {
    let io = SocketIOServer(server);

    function listClients(roomName) {
        io.to(roomName).clients((err, clients) => {
            if (!err) {
                let usernames = clients.map(x => socketIdUsernameMap.get(x) ? socketIdUsernameMap.get(x) : x);
                io.to(roomName).emit("listClients", usernames);
            }
        });
    }

    function sendMessage(roomName, message) {
        io.to(roomName).clients((err, clients) => {
            if (!err) {
                io.to(roomName).emit("listClients", clients);
            }
        });
    }

    io.on("connection", socket => {
        socket.on("msg", (roomName, content) => {
            console.log('server msg :' + roomName + " " + content);
            io.to(roomName).emit("gotMsg", socketIdUsernameMap.get(socket.id), content);
        });

        socket.on("recordBlobGot", data => {
            console.log('server got record blob :' + data);
            let isFirst = false;
            let isLast = data.finished;
            let recordId = data.recordId;
            let recordBlob = data.blob;
            let username = socketIdUsernameMap.get(socket.id);
            let room = data.room;

            if(isLast) {
                isLive = false;
            }

            let dir = 'videos/' + room ;
            if ((/^0+$/).test(recordId)) {
                if (isDirSync(dir)) {
                    deleteFolderRecursive(dir);
                }
                fs.mkdirSync(dir, { recursive: true });
                isFirst = true;
                isLive = true;
                fileDurationArrs[socket.id] = [];
            }


            let webmFilePath =  dir + "/" + recordId + ".webm";
            console.log("webm path: " + webmFilePath);
            var stream = fs.createWriteStream(webmFilePath, {encoding:'binary'});

            stream.on("finish", () => {
                videoUtils.findVideoDuration(webmFilePath, (err, duration) => {
                    if(err) {
                        console.err(err);
                    }
                    console.log('duration: %s', duration.toFixed(2));

                    let fd = {
                        fileName: recordId + ".webm",
                        filePath: webmFilePath,
                        duration: duration
                    };

                    let fdArr = fileDurationArrs[socket.id] ? fileDurationArrs[socket.id] : [];
                    fdArr.push(fd);
                    fileDurationArrs[socket.id] = fdArr;

                    videoUtils.computeStartTimes(fdArr);

                    videoUtils.webm2Mpegts(fd, function(err, mpegtsFp) {
                        if (err) { return console.error(err); }
                        console.log('created %s', mpegtsFp);
                        
                        var playlistFp = dir + '/playlist.m3u8';
    
                        var lastNFdArr = (!isLive ? fdArr : lastN(fdArr, 4));
    
                        var action = (isFirst ? 'created' : (isLast ? 'finished' : 'updated') );
    
                        videoUtils.generateM3u8Playlist(lastNFdArr, playlistFp, isLive, recordId, function(err) {
                            console.log('playlist %s %s %s', playlistFp, (err ? err.toString() : action), recordId );
                        });
                    });

                });
            });

            stream.write(recordBlob);
            stream.end();
        });

        socket.on("createClassroom", (name, username, callback) => {
            if (!io.sockets.adapter.rooms[name]) {
                socket.join(name);
                listClients(name);

                roomTeacherMap.set(name, socket.id);
                socketIdUsernameMap.set(socket.id, username);
                console.log(socket.id + ' ' + username);
                callback(true);
            } else {
                callback(false);
            }

            socket.on("disconnect", function () {
                roomTeacherMap.delete(name);
                socketIdUsernameMap.delete(socket.id);
            });
        });

        socket.on("joinClassroom", (name, username, callback) => {
            socket.join(name);
            callback();
            listClients(name);
            socketIdUsernameMap.set(socket.id, username);
            io.to(roomTeacherMap.get(name)).emit("studentJoinedIn", {studentSid: socket.id});
        });

        socket.on("teacherOffer", data => {
            io.to(data.to).emit("teacherOffer", data);
        });

        socket.on("studentAnswer", data => {
            io.to(data.to).emit("studentAnswer", data);
        });

        socket.on("ice", data => {
            console.log('ice..');
            console.log(data);
            io.to(data.to).emit("ice", data);
        });
    });
}


module.exports.configSocketIO = configSocketIO;