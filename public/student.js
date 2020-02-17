/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./FrontProjects/Student/src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./FrontProjects/Student/src/controllers/StudentMain.js":
/*!**************************************************************!*\
  !*** ./FrontProjects/Student/src/controllers/StudentMain.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _views_StudentMain_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/StudentMain.html */ \"./FrontProjects/Student/src/views/StudentMain.html\");\n/* harmony import */ var _views_StudentMain_html__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_views_StudentMain_html__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _commons_Dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../commons/Dialog */ \"./FrontProjects/commons/Dialog.js\");\n/* harmony import */ var _commons_components_ClientList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../commons/components/ClientList */ \"./FrontProjects/commons/components/ClientList.js\");\n/* harmony import */ var _commons_components_MessageList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../commons/components/MessageList */ \"./FrontProjects/commons/components/MessageList.js\");\n/* harmony import */ var _commons_Barrage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../commons/Barrage */ \"./FrontProjects/commons/Barrage.js\");\n\n\n\n\n\n\nconst StudentMain = Vue.component(\"student-main\", {\n    template: _views_StudentMain_html__WEBPACK_IMPORTED_MODULE_0___default.a,\n    data() {\n        return {\n            classroomName: \"\",\n            username:\"\",\n            useWebrtc: false,\n        };\n    },\n    mounted() {\n        // this._socket = io('wss://xietiandi.tech', { path: '/live/socket.io'});\n        this._socket = io();\n        this._remoteStream = new MediaStream();\n        this.$refs.remote_preview.srcObject = this._remoteStream;\n\n        localStorage.clear();\n        this.addSocketListeners();\n        this.showUsernameDialog();\n    },\n\n    methods: {\n        sendMessage(room, content) {\n            console.log('sendmsg...' + room + \" \" + content);\n            this._socket.emit(\"msg\", room, content);\n        },\n\n        addSocketListeners() {\n            this._socket.on(\"listClients\", clients => {\n                this.$refs.client_list.setClients(clients);\n            });\n\n            this._socket.on(\"listMessages\", messages => {\n                this.$refs.message_list.setMessages(messages);\n            });\n\n            this._socket.on(\"gotMsg\", (username, content) => {\n                this.$refs.message_list.gotMsg({username: username, content: content});\n                _commons_Barrage__WEBPACK_IMPORTED_MODULE_4__[\"default\"].createBarrage(username + \": \" + content);\n            });\n\n            this._socket.on(\"teacherOffer\", async data => {\n                console.log(data);\n                this._teacherId = data.from;\n                let servers = {\n                    'iceServers': [\n                        {\n                            'url': 'stun:212.64.17.36',\n                            'username': 'kurento',\n                            'credential': 'kurento'\n                        },\n                        {\n                            'url': 'turn:212.64.17.36',\n                            'username': 'kurento',\n                            'credential': 'kurento'\n                        }\n                    ]\n                };\n                this._answerPc = new RTCPeerConnection(servers);\n                this._answerPc.onicecandidate = e => {\n                    if (e.candidate) {\n                        this._socket.emit(\"ice\", {from: this._socket.id, to: this._teacherId, ice: e.candidate});\n                    }\n                };\n\n                this._answerPc.ontrack = e => {\n                    console.log(e);\n                    this._remoteStream.addTrack(e.track);\n                };\n\n                await this._answerPc.setRemoteDescription(new RTCSessionDescription(data.offer));\n                console.log('finish receive offer');\n\n                let answer = await this._answerPc.createAnswer();\n                await this._answerPc.setLocalDescription(new RTCSessionDescription(answer));\n                this._socket.emit(\"studentAnswer\", {from: this._socket.id, to: this._teacherId, answer: answer});\n            });\n            this._socket.on(\"ice\", data => {\n                console.log('receive ice candidate');\n                console.log(data);\n                this._answerPc.addIceCandidate(new RTCIceCandidate(data.ice));\n            });\n        },\n\n        showJoinClassroomDialog() {\n            _commons_Dialog__WEBPACK_IMPORTED_MODULE_1__[\"default\"].showInput(\"请输入教室名称\", (name) => {\n                if (name) {\n                    let ld = _commons_Dialog__WEBPACK_IMPORTED_MODULE_1__[\"default\"].showLoading(\"正在加入教室...\");\n                    this._socket.emit(\"joinClassroom\", name, this.username, () => {\n                        ld.modal(\"hide\");\n                        this.classroomName = name;\n                        localStorage.classroomName = name;\n                    });\n                } else {\n                    this.showJoinClassroomDialog();\n                }\n            }, \"static\", false, false, \"\", \"加入\");\n        },\n\n        showUsernameDialog() {\n            _commons_Dialog__WEBPACK_IMPORTED_MODULE_1__[\"default\"].showInput(\"请给自己起个昵称\", (name) => {\n                if (name) {\n                    this.username = name;\n                    this.showJoinClassroomDialog();\n                } else {\n                    this.showUsernameDialog();\n                }\n            }, \"static\", false, false, \"\", \"ok\");\n        },\n    }\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (StudentMain);\n\n//# sourceURL=webpack:///./FrontProjects/Student/src/controllers/StudentMain.js?");

/***/ }),

/***/ "./FrontProjects/Student/src/main.js":
/*!*******************************************!*\
  !*** ./FrontProjects/Student/src/main.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _controllers_StudentMain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controllers/StudentMain */ \"./FrontProjects/Student/src/controllers/StudentMain.js\");\n\n\nlet app = new _controllers_StudentMain__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nlet root = document.createElement(\"div\");\ndocument.body.appendChild(root);\napp.$mount(root);\n\n//# sourceURL=webpack:///./FrontProjects/Student/src/main.js?");

/***/ }),

/***/ "./FrontProjects/Student/src/views/StudentMain.html":
/*!**********************************************************!*\
  !*** ./FrontProjects/Student/src/views/StudentMain.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"card\\\">\\n    <div class=\\\"card-header\\\">\\n        教室：{{classroomName}}\\n    </div>\\n    <div style=\\\"display: flex;flex-direction: row;\\\">\\n        <client-list ref=\\\"client_list\\\"></client-list>\\n\\n        <div id=\\\"barrange-div\\\" class=\\\"card\\\" style=\\\"width: 60%;\\\">\\n            <video style=\\\"display: block;width: 100%\\\" controls autoplay ref=\\\"remote_preview\\\"></video>\\n        </div>\\n\\n        <message-list v-on:sendMessage=\\\"sendMessage\\\"  ref=\\\"message_list\\\"></message-list>\\n    </div>\\n    <div style=\\\"display: flex;flex-direction: row;\\\">\\n    </div>\\n</div>\";\n\n//# sourceURL=webpack:///./FrontProjects/Student/src/views/StudentMain.html?");

/***/ }),

/***/ "./FrontProjects/commons/Barrage.js":
/*!******************************************!*\
  !*** ./FrontProjects/commons/Barrage.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst Barrange = {\n    // 创建一个弹幕\n    createBarrage: function(content){\n        //创建一个span\n        var barrage=document.createElement(\"span\");\n        //定义内容\n        barrage.innerText=content;\n        //指定class\n        barrage.className=\"barrage\";\n        //为弹幕设置一个随机的高度\n        barrage.style.top=this.randomNum(10,350)+'px';\n        //宽度\n        barrage.style.width=content.length*16+'px';\n        //为弹幕设置一个随机的颜色\n        barrage.style.color=this.randomColor();\n\n        barrage.style.right = '-100px';\n        //加入video中\n        document.getElementById(\"barrange-div\").appendChild(barrage);\n\n        //开始滚动\n        this.rolling(barrage)\n    },\n\n    //取随机数\n    randomNum : function (minNum,maxNum){ \n        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); \n    } ,\n\n    //取随机颜色\n    randomColor : function(){\n        var color=\"#\";\n        for(var i=0;i<6;i++){\n            color += (Math.random()*16 | 0).toString(16);\n        }\n        return color;\n    },\n\n    //滚动弹幕\n    rolling : function (object){\n\n        //启动一个定时器，每10秒执行一次\n        var a= setInterval(function () {\n            //判断是否滚动出屏幕\n            if (object.offsetLeft> - object.innerHTML.length*16) {\n                object.style.right= object.style.right.split('p')[0]*1 + 2 + 'px';\n            }else{\n                //如果弹幕已移出屏幕，则删除本条弹幕\n                object.parentNode.removeChild(object);\n                //清理定时器\n                clearInterval(a);\n            }\n        }, 20);\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Barrange);\n\n//# sourceURL=webpack:///./FrontProjects/commons/Barrage.js?");

/***/ }),

/***/ "./FrontProjects/commons/Dialog.js":
/*!*****************************************!*\
  !*** ./FrontProjects/commons/Dialog.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst Dialog = {\n    showInput(title, callback, backdrop = true, keyboard = true, showCloseBtn = true, cancelBtnLabel = \"取消\", okBtnLabel = \"确定\") {\n        $(`<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title\" id=\"exampleModalLabel\">${title}</h5>\n        ${showCloseBtn ? \"<button type=\\\"button\\\" class=\\\"close\\\" data-dismiss=\\\"modal\\\" aria-label=\\\"Close\\\"><span aria-hidden=\\\"true\\\">&times;</span></button>\" : \"\"}\n      </div>\n      <div class=\"modal-body\">\n        <input type=\"text\" class=\"message-input form-control\">\n      </div>\n      <div class=\"modal-footer\">\n        ${cancelBtnLabel ? \"<button type=\\\"button\\\" class=\\\"btn btn-secondary\\\" data-dismiss=\\\"modal\\\">\" + cancelBtnLabel + \"</button>\" : \"\"}\n        ${okBtnLabel ? \"<button type=\\\"button\\\" class=\\\"btn btn-primary\\\" data-dismiss=\\\"modal\\\">\" + okBtnLabel + \"</button>\" : \"\"}\n      </div>\n    </div>\n  </div>\n</div>`).appendTo(document.body).modal({\n            keyboard: keyboard,\n            backdrop: backdrop\n        }).on(\"hidden.bs.modal\", function () {\n            let jqThis = $(this);\n            if (callback) {\n                callback(jqThis.find(\".message-input\").val());\n            }\n            jqThis.remove();\n        });\n    },\n\n    showMessageBox(msg, title = \"\", closeCallback = null) {\n        $(`<div class=\"modal fade\" id=\"staticBackdrop\" data-backdrop=\"static\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"staticBackdropLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title\" id=\"staticBackdropLabel\">${title}</h5>\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n      <div class=\"modal-body\">\n        ${msg}\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">OK</button>\n      </div>\n    </div>\n  </div>\n</div>`).appendTo(document.body).modal().on(\"hidden.bs.modal\", function () {\n            $(this).remove();\n\n            if (closeCallback) {\n                closeCallback();\n            }\n        });\n    },\n\n\n    showLoading(msg) {\n        return $(`<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content\">\n      <div class=\"modal-body\">\n        ${msg}\n      </div>\n    </div>\n  </div>\n</div>`).modal({\n            keyboard: false,\n            backdrop: \"static\"\n        }).on(\"hidden.bs.modal\", function () {\n            $(this).remove();\n        });\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Dialog);\n\n//# sourceURL=webpack:///./FrontProjects/commons/Dialog.js?");

/***/ }),

/***/ "./FrontProjects/commons/components/ClientList.html":
/*!**********************************************************!*\
  !*** ./FrontProjects/commons/components/ClientList.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"card\\\" style=\\\"width: 220px; z-index: 100;\\\">\\n    <div class=\\\"card-header\\\">\\n        所有人\\n    </div>\\n    <div>\\n        <div v-for=\\\"c in clients\\\">\\n            {{c}}\\n        </div>\\n    </div>\\n</div>\";\n\n//# sourceURL=webpack:///./FrontProjects/commons/components/ClientList.html?");

/***/ }),

/***/ "./FrontProjects/commons/components/ClientList.js":
/*!********************************************************!*\
  !*** ./FrontProjects/commons/components/ClientList.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ClientList_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClientList.html */ \"./FrontProjects/commons/components/ClientList.html\");\n/* harmony import */ var _ClientList_html__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ClientList_html__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst ClientList = Vue.component(\"client-list\", {\n    template: _ClientList_html__WEBPACK_IMPORTED_MODULE_0___default.a,\n\n    data() {\n        return {\n            clients: []\n        };\n    },\n\n    methods: {\n        setClients(clients) {\n            this.clients.length = 0;\n            this.clients.push(...clients);\n        }\n    }\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ClientList);\n\n//# sourceURL=webpack:///./FrontProjects/commons/components/ClientList.js?");

/***/ }),

/***/ "./FrontProjects/commons/components/MessageList.html":
/*!***********************************************************!*\
  !*** ./FrontProjects/commons/components/MessageList.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"card\\\" style=\\\"width: 300px; z-index: 100;\\\">\\n    <div class=\\\"card-header\\\">\\n        对话\\n    </div>\\n    <div>\\n        <!-- <div v-for=\\\"c in messages\\\">\\n            {{c.username}} : {{c.content}}\\n        </div> -->\\n        <div>\\n            <textarea id=\\\"msgArea\\\" rows=\\\"25\\\" style=\\\"width: 100%;\\\"  readonly>{{areaMsgs}}</textarea>\\n        </div>\\n    </div>\\n    <div>\\n        <!-- <div style=\\\"position: absolute; bottom:0px\\\"> -->\\n        <div>\\n            <input type=\\\"text\\\" v-model=\\\"content\\\">\\n            <buttom class=\\\"btn btn-primary\\\" v-on:click=\\\"sendMessage()\\\" @keyup.enter=\\\"sendMessage()\\\">发送</buttom>\\n        </div>\\n    </div>\\n</div>\";\n\n//# sourceURL=webpack:///./FrontProjects/commons/components/MessageList.html?");

/***/ }),

/***/ "./FrontProjects/commons/components/MessageList.js":
/*!*********************************************************!*\
  !*** ./FrontProjects/commons/components/MessageList.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _MessageList_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MessageList.html */ \"./FrontProjects/commons/components/MessageList.html\");\n/* harmony import */ var _MessageList_html__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_MessageList_html__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst MessageList = Vue.component(\"message-list\", {\n    template: _MessageList_html__WEBPACK_IMPORTED_MODULE_0___default.a,\n\n    data() {\n        return {\n            messages: [{'username': \"帅天帝\", 'content': \"大家好, 欢迎来到我的直播平台。\"}],\n            username: \"\",\n            content:\"\",\n            areaMsgs: \"\"\n        };\n    },\n\n    created() {\n      this.keyupEnter();  \n    },\n\n    methods: {\n        keyupEnter(){\n            document.onkeydown = e =>{\n                let body = document.getElementsByTagName('body')[0]\n                if (e.keyCode === 13) {\n                    console.log('enter')\n                    this.sendMessage()\n                }\n            }\n        },\n\n        sendMessage() {\n            let room = localStorage.classroomName;\n            if (room && this.content) {\n                console.log('msgList send: ' + room + ' ' + this.content);\n                this.$emit('sendMessage', room, this.content);\n                this.content = \"\";\n            }\n        },\n\n        gotMsg(message) {\n            this.messages.push(message);\n            this.areaMsgs = this.areaMsgs + message.username + \": \" + message.content + \"\\n\";\n            let textarea = document.getElementById('msgArea');\n            textarea.scrollTop = textarea.scrollHeight;\n        },\n\n        listMessages(messages) {\n            this.messages.length = 0;\n            this.messages.push(...messages);\n        }\n    }\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MessageList);\n\n//# sourceURL=webpack:///./FrontProjects/commons/components/MessageList.js?");

/***/ })

/******/ });