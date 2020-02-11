import Tpl from "../views/StudentMain.html"
import Dialog from "../../../commons/Dialog";
import "../../../commons/components/ClientList"

const StudentMain = Vue.component("student-main", {
    template: Tpl,
    data() {
        return {
            classroomName: ""
        };
    },
    mounted() {
        this._socket = io('wss://xietiandi.tech', { path: '/live/socket.io'});
        this._remoteStream = new MediaStream();
        this.$refs.remote_preview.srcObject = this._remoteStream;

        this.addSocketListeners();
        this.showJoinClassroomDialog();
    },

    methods: {
        addSocketListeners() {
            this._socket.on("listClients", clients => {
                this.$refs.client_list.setClients(clients);
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
                    this._socket.emit("joinClassroom", name, () => {
                        ld.modal("hide");
                        this.classroomName = name;
                    });
                } else {
                    this.showJoinClassroomDialog();
                }
            }, "static", false, false, "", "加入");
        },
    }
});

export default StudentMain;