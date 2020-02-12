import Tpl from "../views/MainApp.html"
import Dialog from "../../../commons/Dialog";
import "../../../commons/components/ClientList"
import "../../../commons/components/MessageList"
import Barrange from "../../../commons/Barrage"
import StudentConnection from "../net/StudentConnection";
import MultiStreamsMixer from 'multistreamsmixer';

const MainApp = Vue.component("main-app", {
    template: Tpl,
    data() {
        return {
            classroomName: "",
            username:""
        }
    },

    async mounted() {
        var camera_constraints = { audio: true, video: { width: 600/2, height: 480/2 } };
        var constraints = { audio: true, video: { width: 1920/2, height: 1080/2 } };
        this._localStream = await navigator.mediaDevices.getUserMedia(camera_constraints );
        this._screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);

        this._screenStream.fullcanvas = true;
        this._screenStream.width = 1920; // or 3840
        this._screenStream.height = 1080; // or 2160 

        this._localStream.width = parseInt((30 / 100) * this._screenStream.width);
        this._localStream.height = parseInt((30 / 100) * this._screenStream.height);
        this._localStream.top = this._screenStream.height - this._localStream.height;
        this._localStream.left = this._screenStream.width - this._localStream.width;

        let mixer = new MultiStreamsMixer([this._screenStream, this._localStream]);

        mixer.frameInterval = 10;
        mixer.startDrawingFrames();

        this._mixedStream = mixer.getMixedStream();

        // this._localStream.getTracks().forEach(t => this._screenStream.addTrack(t));
        // this.$refs.local_preview.srcObject = this._mixedStream;

        // this._socket = io.connect('wss://xietiandi.tech', { path: '/live/socket.io'});
        this._socket = io();
        this._studentConnections = new Map();

        localStorage.clear();
        localStorage.socket = this._socket;
        this.showUsernameDialog();
        this.addSocketListeners();
    },

    methods: {
        sendMessage(room, content) {
            console.log('sendmsg...' + room + " " + content);
            this._socket.emit("msg", room, content);
        },

        addSocketListeners() {
            this._socket.on("listClients", clients => {
                this.$refs.client_list.setClients(clients);
            });

            this._socket.on("gotMsg", (username, content) => {
                this.$refs.message_list.gotMsg({username: username, content: content});
                Barrange.createBarrage(username + ": " + content);
            });

            this._socket.on("studentJoinedIn", data => {
                this._studentConnections.set(data.studentSid, new StudentConnection(this._socket, data.studentSid, this._mixedStream));
            });

            this._socket.on("studentAnswer", data => {
                let sc = this._studentConnections.get(data.from);
                if (sc) {
                    sc.studentAnswerHandler(data);
                }
            });

            this._socket.on("ice", data => {
                let sc = this._studentConnections.get(data.from);
                if (sc) {
                    sc.iceHandler(data);
                }
            });
        },

        showUsernameDialog() {
            Dialog.showInput("请给自己起个昵称", (name) => {
                if (name) {
                    this.username = name;
                    localStorage.username = name;
                    this.showCreateClassroomDialog();
                } else {
                    this.showUsernameDialog();
                }
            }, "static", false, false, "", "ok");
        },

        showCreateClassroomDialog() {
            Dialog.showInput("请创建一个教室", function (name) {
                if (name) {
                    let ld = Dialog.showLoading("正在创建教室...");
                    this._socket.emit("createClassroom", name, this.username, function (suc) {
                        ld.modal("hide");
                        if (suc) {
                            this.classroomName = name;
                            localStorage.classroomName = name;
                            console.log("Joined in room");
                            this.$refs.local_preview.srcObject = this._mixedStream;
                        } else {
                            Dialog.showMessageBox("教室已存在，请另选其它名称", "提示", function () {
                                this.showCreateClassroomDialog();
                            }.bind(this));
                        }
                    }.bind(this));
                } else {
                    this.showCreateClassroomDialog();
                }
            }.bind(this), "static", false, false, "");
        }
    }
});


export default MainApp;
