import Tpl from "./MessageList.html"

const MessageList = Vue.component("message-list", {
    template: Tpl,

    data() {
        return {
            messages: [{'username': "帅天帝", 'content': "大家好, 欢迎来到我的直播平台。"}],
            username: "",
            content:"",
            areaMsgs: ""
        };
    },

    created() {
      this.keyupEnter();  
    },

    methods: {
        keyupEnter(){
            document.onkeydown = e =>{
                let body = document.getElementsByTagName('body')[0]
                if (e.keyCode === 13) {
                    console.log('enter')
                    this.sendMessage()
                }
            }
        },

        sendMessage() {
            let room = localStorage.classroomName;
            if (room && this.content) {
                console.log('msgList send: ' + room + ' ' + this.content);
                this.$emit('sendMessage', room, this.content);
                this.content = "";
            }
        },

        gotMsg(message) {
            this.messages.push(message);
            this.areaMsgs = this.areaMsgs + message.username + ": " + message.content + "\n";
            let textarea = document.getElementById('msgArea');
            textarea.scrollTop = textarea.scrollHeight;
        },

        listMessages(messages) {
            this.messages.length = 0;
            this.messages.push(...messages);
        }
    }
});

export default MessageList;