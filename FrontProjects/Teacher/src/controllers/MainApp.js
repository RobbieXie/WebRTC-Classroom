import Tpl from "../views/MainApp.html"
import Dialog from "../../../commons/Dialog";
import "../../../commons/components/ClientList"
import StudentConnection from "../net/StudentConnection";
import MultiStreamsMixer from 'multistreamsmixer';

const MainApp = Vue.component("main-app", {
    template: Tpl,
    data() {
        return {classroomName: ""}
    },

    async mounted() {
        var camera_constraints = { audio: true, video: { width: 600, height: 480 } };
        var constraints = { audio: true, video: { width: 1920, height: 1080 } };
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

        this._socket = io.connect('wss://xietiandi.tech', { path: '/live/socket.io'});
        this._studentConnections = new Map();

        this.addSocketListeners();
        this.showCreateClassroomDialog();
    },

    methods: {
        addSocketListeners() {
            this._socket.on("listClients", clients => {
                this.$refs.client_list.setClients(clients);
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

        showCreateClassroomDialog() {
            Dialog.showInput("请创建一个教室", function (name) {
                if (name) {
                    let ld = Dialog.showLoading("正在创建教室...");
                    this._socket.emit("createClassroom", name, function (suc) {
                        ld.modal("hide");
                        if (suc) {
                            this.classroomName = name;
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
