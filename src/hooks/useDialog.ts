import type { DialogModel } from "@/type/BaseType";
import { reactive } from 'vue'
export default function useDialog() {
    //定义弹框属性
    const dialog = reactive<DialogModel>({
        title: '',
        visible: false,
        width: 630,
        height: 280
    })


    //展示弹框
    const onShow = () => {
        dialog.visible = true
    }

    //弹框关闭
    const onClose = () => {
        dialog.visible = false
    }

    //弹框确定
    const onConfirm = () => {
        dialog.visible = false
    }
    return {
        dialog,
        onShow,
        onClose,
        onConfirm
    }
}
