import { getCurrentInstance,type ComponentInternalInstance } from "vue";
//main.ts全局挂载实例
export default function useInstance(){
    const {appContext,proxy}=getCurrentInstance() as ComponentInternalInstance
    const global=appContext.config.globalProperties;
    return {
        global,
        proxy
    }
}