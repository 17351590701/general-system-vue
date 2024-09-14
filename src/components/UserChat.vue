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
            <!--Header头，聊天对象-->
            <div style="text-align: center;line-height: 50px">
              WEB聊天室({{ chatUser }})
            </div>
            <!--聊天内容主题-->
            <div
                style="height: 370px;overflow: auto;border-top: 1px solid #ccc;background: #f5f5f5;
                color: #000000;font-family: 'HarmonyOS Sans SC',serif" v-html="content">
            </div>
            <!--聊天输入文本框-->
            <div style="height: auto;width: 100%">
              <el-input v-model="text" type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" resize="none"
                        :show-word-limit="true" maxlength="2000"
                        style="width: 100%;border-top: 1px solid #ccc;"></el-input>
            </div>
            <!--发送按钮-->
            <div style="text-align: right;padding:10px">
              <el-button type="primary" @click="send">发送</el-button>
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
    let socketUrl = "ws://localhost:8888/api/imserver/" + username.value;
    if (socket != null) {
      socket.close();
      socket = null;
    }
    socket = new WebSocket(socketUrl);
    //从服务端获取消息
    socket.onmessage = async function (msg) {
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
  }
}
// 将json数据转换成html，显示聊天内容
const createContent = (remoteUser: string | null, nowUser: string | null, text: string) => {
  let html;
  if (nowUser) {
    html =
        "    <div style=\"padding: 5px 0;background: #ffffff;box-sizing: border-box;width:100%;overflow: auto\">\n" +
        "        <div style=\"float: right;margin: 15px\">\n" +
        "          <img src=\"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png\"\n" +
        "               style=\"object-fit: cover;height: 40px;line-height: 40px\" alt=\"头像\"/>\n" +
        "        </div>\n" +
        "        <div\n" +
        "            style=\"background: #2a9ffc;width: auto;max-width: 70%;float: right;margin-top: 25px;margin-bottom: 25px;border-radius: 5px;box-shadow: 5px 5px 5px #dedede\">\n" +
        "          <p style=\"box-sizing: border-box;padding: 0 10px;\">\n" +
        "           " + text + "</p>\n" +
        "        </div>\n" +
        "      </div>"
  } else if (remoteUser) {
    html =
        "     <div style=\"padding: 5px 0;background: #ffffff;box-sizing: border-box;overflow: auto\">\n" +
        "        <div style=\"float: left;margin: 15px\">\n" +
        "          <img src=\"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png\" style=\"object-fit: cover;height: 40px;line-height: 40px\" alt=\"头像\"/>\n" +
        "        </div>\n" +
        "        <div style=\"background: #21f848;width: auto;max-width: 70%;float: left;margin-top: 25px;margin-bottom: 25px;border-radius: 5px;\n" +
        "box-shadow: 5px 5px 5px #dedede\">\n" +
        "          <p style=\"box-sizing: border-box;padding: 0 10px\">\n" +
        "           " + text + "</p>\n" +
        "        </div>\n" +
        "      </div>"
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
      // 发送消息给服务端，由服务端转发
      if (socket && socket.readyState === WebSocket.OPEN) {
        let res = await request.post('/api/imserver/sendMessage', {
          from: username.value,
          to: chatUser.value,
          text: text.value
        });
        // 暂存消息，便于后续显示
        if (res && res.code === 200) {
          socket.send(JSON.stringify({
            from: username.value,
            to: chatUser.value,
            text: text.value
          }))
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
  // content.value = ''
  chatDialog.value = false
}
</script>

<style scoped lang="scss">
.el-icon:hover {
  color: #a6d2ff;
}
</style>