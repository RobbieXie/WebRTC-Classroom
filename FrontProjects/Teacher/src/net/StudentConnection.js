class StudentConnection {


    constructor(socket, studentSid, stream) {
        this._socket = socket;
        this._studentSid = studentSid;
        this._stream = stream;

        this.asyncInit();
    }

    async asyncInit() {
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
        this._offerPc = new RTCPeerConnection(servers);

        this._stream.getTracks().forEach(t => {
            console.log('add track');
            console.log(t);
            this._offerPc.addTrack(t);
        });

        this._offerPc.onicecandidate = e => {
            if (e.candidate) {
                console.log('onIceCandidate...');
                console.log(e);
                this._socket.emit("ice", {from: this._socket.id, to: this._studentSid, ice: e.candidate});
            }
        };

        let offer = await this._offerPc.createOffer();
        this._socket.emit("teacherOffer", {from: this._socket.id, to: this._studentSid, offer: offer});
        await this._offerPc.setLocalDescription(new RTCSessionDescription(offer));
    }

    async studentAnswerHandler(data) {
        await this._offerPc.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log("studentAnswerHandler...");
        console.log(data);
    }

    iceHandler(data) {
        console.log("iceHandler...");
        console.log(data);
        this._offerPc.addIceCandidate(new RTCIceCandidate(data.ice));
    }
}

export default StudentConnection;