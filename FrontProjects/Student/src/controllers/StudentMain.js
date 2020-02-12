import Tpl from "../views/StudentMain.html"
import Dialog from "../../../commons/Dialog";
import "../../../commons/components/ClientList"
import "../../../commons/components/MessageList"
import Barrange from "../../../commons/Barrage"

const StudentMain = Vue.component("student-main", {
    template: Tpl,
    data() {
        return {
            classroomName: "",
            username:""
        };
    },
    mounted() {
        // this._socket = io('wss://xietiandi.tech', { path: '/live/socket.io'});
        this._socket = io();
        this._remoteStream = new MediaStream();
        this.$refs.remote_preview.srcObject = this._remoteStream;

        localStorage.clear();
        this.addSocketListeners();
        this.showUsernameDialog();
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

            this._socket.on("listMessages", messages => {
                this.$refs.message_list.setMessages(messages);
            });

            this._socket.on("gotMsg", (username, content) => {
                this.$refs.message_list.gotMsg({username: username, content: content});
                Barrange.createBarrage(username + ": " + content);
            });

            this._socket.on("teacherOffer", async data => {
                console.log(data);
                this._teacherId = data.from;
                let servers = {
                    'iceServers': [
                        {
                            'url': 'stun:212.64.17.36',
                            'username': 'kurento',
                            'credential': 'kurento'
                        },
                        {
                            'url': 'turn:212.64.17.36',
                            'username': 'kurento',
                            'credential': 'kurento'
                        }
                    ]
                };
                this._answerPc = new RTCPeerConnection(servers);
                this._answerPc.onicecandidate = e => {
                    if (e.candidate) {
                        this._socket.emit("ice", {from: this._socket.id, to: this._teacherId, ice: e.candidate});
                    }
                };

                this._answerPc.ontrack = e => {
                    console.log(e);
                    this._remoteStream.addTrack(e.track);
                };

                await this._answerPc.setRemoteDescription(new RTCSessionDescription(data.offer));
                console.log('finish receive offer');

                let answer = await this._answerPc.createAnswer();
                await this._answerPc.setLocalDescription(new RTCSessionDescription(answer));
                this._socket.emit("studentAnswer", {from: this._socket.id, to: this._teacherId, answer: answer});
            });
            this._socket.on("ice", data => {
                console.log('receive ice candidate');
                console.log(data);
                this._answerPc.addIceCandidate(new RTCIceCandidate(data.ice));
            });
        },

        showJoinClassroomDialog() {
            Dialog.showInput("请输入教室名称", (name) => {
                if (name) {
                    let ld = Dialog.showLoading("正在加入教室...");
                    this._socket.emit("joinClassroom", name, this.username, () => {
                        ld.modal("hide");
                        this.classroomName = name;
                        localStorage.classroomName = name;
                    });
                } else {
                    this.showJoinClassroomDialog();
                }
            }, "static", false, false, "", "加入");
        },

        showUsernameDialog() {
            Dialog.showInput("请给自己起个昵称", (name) => {
                if (name) {
                    this.username = name;
                    this.showJoinClassroomDialog();
                } else {
                    this.showUsernameDialog();
                }
            }, "static", false, false, "", "ok");
        },
    }
});

export default StudentMain;