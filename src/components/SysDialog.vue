<template>
  <el-dialog 
  :model-value="props.visible" 
  :title="props.title" 
  :width="props.width" 
  :before-close="onOnClose"
  appened-to-body
  >
    <!-- 展示弹框内容 -->
    <div :style="{ height: props.height + 'px' }">
      <slot name="content"></slot>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onConfirm()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

//定义参数类型
interface DialogProps {
  title?: string,
  visible: boolean,
  width?: number,
  height?: number
}
/**接受父组件传递的数据
 * withDefaults:设置默认值
 * defineProps:接受父组件传递的参数
 * */
const props = withDefaults(defineProps<DialogProps>(), {
  title: '标题',
  visible: false,
  width: 630,
  height: 380
})

//注册事件
const emit = defineEmits(['onClose', 'onConfirm'])
//关闭弹框
const onClose = () => {
  emit('onClose')
}
//确定弹框
const onConfirm = () => {
  emit('onConfirm')
}

</script>

<style scoped lang="scss">

</style>