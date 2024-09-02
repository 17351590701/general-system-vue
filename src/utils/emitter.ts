// 引入mitt
import mitt from 'mitt'
//调用mitt得到emitter
//能绑定事件(emitter.on)，触发(emitter.emit),解绑(emitter.off),全部(emitter.all)
const emitter = mitt()
//暴露
export default emitter