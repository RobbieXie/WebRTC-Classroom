const SocketIOServer = require("socket.io");

let roomTeacherMap = new Map();
let socketIdUsernameMap = new Map();

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