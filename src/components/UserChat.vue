<template>
  <!--聊天icon按钮-->
  <el-icon color="#fff" size="20px" style="margin-right: 30px;outline: none" @click="showChatDialog">
    <ChatDotSquare/>
  </el-icon>
  <!--聊天对话框dialog-->
  <el-dialog v-model="chatDialog" :before-close="closeSocket" title="服务器聊天室" fullscreen>
    <div style="height: 100%;width:100%;padding: 20px;box-sizing: border-box;background: #2c3e50">
      <el-row>
        <!--左侧在线用户列表-->
        <el-col :span="4">
          <el-card style="width: 300px;height: 80%;color:#333">
            <div style="padding-bottom:10px;border-bottom:1px solid #ccc">在线用户<span style="font-size: 12px">(点击气泡开始聊天)</span>
            </div>
            <div style="padding:10px 0" v-for="user in users" :key="user.username">
              <i class="el-icon-chat-dot-round" style="margin-left:10px;font-size: 16px;cursor:pointer;"
                 @click="chooseChatUser(user.username)"
              >
                <span>{{ user.username }}</span>
              </i>
              <span style="font-size: 12px;color:limegreen;margin-left: 5px"
                    v-if="user.username===chatUser">chatting...</span>
            </div>
          </el-card>
        </el-col>
        <!--右侧主体聊天框-->
        <el-col :span="20">
          <div style="width: 800px;margin: 0 auto;background: #ffffff;border-radius: 5px;box-shadow: 0 0 10px #ccc">
            <div style="text-align: center;line-height: 50px">
              WEB聊天室({{ chatUser }})
            </div>
            <div style="height: 350px;overflow: auto;border-top: 1px solid #ccc" v-html="content"></div>
            <div style="height: 200px">
              <el-input v-model="text" type="textarea"
                        style="height: 160px;width: 100%;padding: 20px;border: none;border-top: 1px solid #ccc"></el-input>
            </div>
            <div style="text-align: right;padding-right: 10px">
              <el-button type="primary" size="small" @click="send">发送</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ChatDotSquare} from "@element-plus/icons-vue";
import {useUserStore} from "@/stores/user";
import {ElMessage} from "element-plus";
import request from '@/http'

const chatDialog = ref(false)
const showChatDialog = async () => {
  // 初始化连接，查询所有在线用户
  establishConnection();
  chatDialog.value = true
}

const userStore = useUserStore()

interface User {
  username: string
}

const username = ref<string>('')

//"users":"[{"username":"li"},{}]"
const users = ref<User[]>([])
const chatUser = ref<string>('')
const text = ref<string>('')
const content = ref<string>('')
let socket: WebSocket | null = null;

// 初始化建立连接
const establishConnection = () => {
  username.value = userStore.getUsername === '' ? '游客' : userStore.getUsername
  // 如果浏览器不支持websocket，会使用这个回调
  if (typeof (WebSocket) == "undefined") {
    console.log("您的浏览器不支持WebSocket")
  } else {
    console.log("您的浏览器支持WebSocket")
    let socketUrl = "ws://localhost:8888/api/imserver/" + username.value;
    if (socket != null) {
      socket.close();
      socket = null;
    }
    socket = new WebSocket(socketUrl);
    //打开事件onOpen
    socket.onopen = function () {
      console.log("websocket已打开")
    }
    //从服务端获取消息
    socket.onmessage = async function (msg) {
      console.log("收到数据====" + msg.data)
      let data = JSON.parse(msg.data)
      if (data.users) {
        // 过滤掉当前用户名
        users.value = data.users.filter((user: User) => user.username !== username.value)
      } else {
        // 如果是当前chatUser用户发送的消息，则添加到消息列表中
        if (data.from === chatUser.value) {
          createContent(data.from, null, data.text);
        }
      }
    };
    socket.onclose = function () {
      console.log("连接已关闭")
    }
    socket.onerror = function () {
      console.log("连接错误")
    }
  }
}
// 将json数据转换成html，显示聊天内容
const createContent = (remoteUser: string | null, nowUser: string | null, text: string) => {
  let html;
  if (nowUser) {
    html =
        "  <div class=\"el-row\" style=\"padding:5px 0\">\n" +
        "    <div class=\"el-col el-col-22\" style=\"text-align: right;padding-right: 10px\">\n" +
        "      <div class=\"tip left\">" + text + "</div>\n" +
        "    </div>\n" +
        "    <div class=\"el-col el-col-2\">\n" +
        "      <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px;line-height: 40px\">\n" +
        "        <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover\"\n" +
        "             alt=\"头像\">\n" +
        "      </span>\n" +
        "    </div>\n" +
        "  </div>"
  } else if (remoteUser) {
    html =
        "  <div class=\"el-row\" style=\"padding:5px 0\">\n" +
        "    <div class=\"el-col el-col-2\" style=\"text-align: right;\">\n" +
        "         <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px;line-height: 40px\">\n" +
        "        <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover\"\n" +
        "             alt=\"头像\">\n" +
        "      </span>\n" +
        "    </div>\n" +
        "    <div class=\"el-col el-col-22\" style=\"text-align: left;padding-left: 10px\">\n" +
        "      <div class=\"tip left\">" + text + "</div>\n" +
        "    </div>\n" +
        "  </div>"
  }
  content.value += html;
}

// 用户发送消息
const send = async () => {
  if (!chatUser) {
    ElMessage({
      type: "warning",
      message: "请先选择聊天对象"
    })
    return;
  }
  if (!text) {
    ElMessage({
      type: "warning",
      message: "请输入内容"
    })

  } else {
    if (typeof (WebSocket) == 'undefined') {
      console.log("您的浏览器不支持WebSocket")
    } else {
      console.log("您的浏览器支持WebSocket")
      // 发送消息给服务端，由服务端转发
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          from: username.value,
          to: chatUser.value,
          text: text.value
        }))
        // 暂存消息，便于后续显示
        let res = await request.post('/api/imserver/sendMessage', {
          from: username.value,
          to: chatUser.value,
          text: text.value
        });
        if (res && res.code === 200) {
          createContent(null, username.value, text.value)
          text.value = '';
        }
      } else {
        ElMessage({
          type: "warning",
          message: "连接已断开，请重新连接"
        })
      }
    }
  }
}

//获取历史消息
const getHistoryMessage = async () => {
  let res = await request.get("/api/imserver/getMessage", {from: username.value, to: chatUser.value, text: ''});
  if (res && res.code === 200) {
    for (let i = 0; i < JSON.stringify(res.data).length; i++) {
      // res.data[i]
      if (res.data[i].fromUser === username.value) {
        createContent(null, username.value, res.data[i].text)
      } else if (res.data[i].fromUser === chatUser.value) {
        createContent(res.data[i].fromUser, null, res.data[i].text)
      }
    }
  }

}
// 选择用户时，获取该用户历史消息
const chooseChatUser = async (username: string) => {
  //清空前一个聊天对象的消息列表
  content.value = ''
  chatUser.value = username
  await getHistoryMessage();
}
const closeSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close(1000, "关闭连接")
  }
  content.value = ''
  chatDialog.value = false
}
</script>

<style scoped lang="scss">
.el-icon:hover {
  color: #a6d2ff;
}
</style>