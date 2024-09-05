<template>
  <el-icon color="#fff" size="20px" style="margin-right: 30px;outline: none" @click="showChatDialog">
    <ChatDotSquare/>
  </el-icon>
  <el-dialog v-model="chatDialog" title="服务器聊天室" fullscreen>
    <div style="padding:10px;margin-bottom: 50px;background: #2c3e50">
      <el-row>
        <el-col :span="4">
          <el-card style="width: 300px;height: 300px;color:#333">
            <div style="padding-bottom:10px;border-bottom:1px solid #ccc">在线用户<span style="font-size: 12px">(点击气泡开始聊天)</span>
            </div>
            <div style="padding:10px 0" v-for="user in users" :key="user.username">
              <span>{{ user.username }}</span>
              <i class="el-icon-chat-dot-round" style="margin-left:10px;font-size: 16px;cursor:pointer;"
                 @click="chatUser = user.username"
              ></i>
              <span style="font-size: 12px;color:limegreen;margin-left: 5px"
                    v-if="user.username===chatUser">chatting...</span>
            </div>
          </el-card>
        </el-col>
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
  <!--当前用户-->
  <!--<div class="el-row" style="padding:5px 0">-->
  <!--  <div class="el-col el-col-22" style="text-align: right;padding-right: 10px">-->
  <!--    <div class="tip left">text</div>-->
  <!--  </div>-->
  <!--  <div class="el-col el-col-2">-->
  <!--    <span class="el-avatar el-avatar&#45;&#45;circle" style="height: 40px;line-height: 40px">-->
  <!--      <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="object-fit: cover"-->
  <!--           alt="头像">-->
  <!--    </span>-->
  <!--  </div>-->
  <!--</div>-->
  <!--接收方-->
  <!--<div class="el-row" style="padding:5px 0">-->
  <!--  <div class="el-col el-col-2" style="text-align: right;">-->
  <!--       <span class="el-avatar el-avatar&#45;&#45;circle" style="height: 40px;line-height: 40px">-->
  <!--      <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="object-fit: cover"-->
  <!--           alt="头像">-->
  <!--    </span>-->
  <!--  </div>-->
  <!--  <div class="el-col el-col-22" style="text-align: left;padding-left: 10px">-->
  <!--    <div class="tip left">text</div>-->
  <!--  </div>-->
  <!--</div>-->
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {ChatDotSquare} from "@element-plus/icons-vue";
import {useUserStore} from "@/stores/user";
import {ElMessage} from "element-plus";


const chatDialog = ref(false)
const showChatDialog = () => {
  chatDialog.value = true
}

interface User {
  username: string
}

const user = ref<User>({
  username: '' as string,
})
const username = ref('')
const users = ref<User[]>([])
const chatUser = ref('')
const text = ref('')
const content = ref('')
const userStore = useUserStore()
const messages = ref<[]>([])
let socket: WebSocket = null;
const init = () => {
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
    //获取消息事件
    socket.onmessage = function (msg: any) {
      console.log("收到数据====" + msg.data)
      let data = JSON.parse(msg.data)
      if (data.users) {
        // 过滤掉当前用户名
        users.value = data.users.filter((user: any) => user.username !== username.value)
      } else {
        if (data.from === chatUser) {
          messages.push(data)
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
        "      <div class=\"tip left\">text</div>\n" +
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
        "      <div class=\"tip left\">text</div>\n" +
        "    </div>\n" +
        "  </div>"
  }
  content.value += html;
}

const send = () => {
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
    return;
  } else {
    if (typeof (WebSocket) == 'undefined') {
      console.log("您的浏览器不支持WebSocket")
    } else {
      console.log("您的浏览器支持WebSocket")
      let message = {
        from: username.value,
        to: chatUser,
        text: text.value
      }
      socket.send(JSON.stringify(message))
      message.push({user: username.value, text: text.value})
      createContent(null, username.value, text.value)
      text.value = '';
    }
  }
}
onMounted(() => {
  init();
})
</script>

<style scoped lang="scss">
.el-icon:hover {
  color: #a6d2ff;
}
</style>