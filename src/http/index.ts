import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
    type AxiosRequestConfig,
} from "axios";
import {ElMessage, type MessageParamsWithType} from "element-plus";
import {useUserStore} from "@/stores/user";

// axios配置
const config = {
    baseURL: "http://localhost:8888",
    timeout: 10000,
    withCredentids: true,
};

//定义返回值类型泛型
export interface Result<T = any> {
    msg: MessageParamsWithType;
    code: number;
    message: string;
    data: T;
    total: number;
}

// axios二次封装
class request {
    //axios实例化
    private instance: AxiosInstance;

    //构造函数，初始化配置
    constructor(configs: AxiosRequestConfig) {
        //实例化axios对象
        this.instance = axios.create(configs);
        //配置拦截器
        this.interceptors();
    }

    //拦截器配置（请求、返回响应）
    private interceptors() {
        //请求发送之前的处理，请求头添加token
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                //从pinia中获取token
                const userStore = useUserStore();
                let token = userStore.getToken;
                if (token) {
                    // 设置token到响应头
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error: any) => {
                //处理请求发送之前的错误
                error.data = {};
                error.data.msg = "请求发送失败，请稍后再试";
                //处理错误并封装为 Promise.reject,可以在这里记录日志或者进行其他处理
                return Promise.reject(error);
            }
        );

        //请求返回之后的处理，统一处理返回值
        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                if (res.data.code == 200) { //结果正常返回
                    return res.data;
                } else if (res.data.code == 600) { //token过期，清空数据，跳转登录
                    this.handleLogout(res);
                } else { //其他状态码错误
                    ElMessage.error(res.data.msg || "接口报错!");
                    return Promise.reject(res.data || "接口报错!");
                }
            },
            (error: any) => { //其他响应处理
                this.handleError(error);
                return Promise.reject(error.data);
            }
        );
    }

    // token过期，清空、登出处理
    private handleLogout(response: AxiosResponse) {
        const userStore = useUserStore();
        userStore.setToken('');
        userStore.setUserId('');
        userStore.setUsername('');
        userStore.setNickName('');
        userStore.setAvatar('');
        ElMessage.error(response.data.message || '登录过期，请重新登录');
        localStorage.clear();
        window.location.href = '/login';
    }

    // 错误返回处理
    private handleError(error: any) {
        error.data = {msg: '连接服务器失败'};
        if (error && error.response) {
            error.data.msg = this.getErrorMsgByStatusCode(error.response.status);
            ElMessage.error(error.data.msg);
        } else {
            ElMessage.error(error.data.msg);
        }
        return Promise.reject(error.data);
    }

    private getErrorMsgByStatusCode(statusCode: number) {
        const errorMessages: Record<number, string> = {
            400: '请求参数错误',
            401: '请先登录',
            403: '无权限访问',
            404: '请求的资源不存在',
            405: '请求方法不被允许',
            408: '请求超时',
            500: '后台接口错误',
            501: '服务未实现',
            502: '网关错误',
            503: '服务不可用',
            504: '网关超时',
            505: 'HTTP版本不受支持',
        };
        return errorMessages[statusCode] || `连接错误${statusCode}`;
    }

    //封装get请求
    get<T = Result>(url: string, params?: object): Promise<T> {
        return this.instance.get(url, {params});
    }

    //封装post请求
    post<T = Result>(url: string, data?: object): Promise<T> {
        return this.instance.post(url, data);
    }

    //put请求
    put<T = Result>(url: string, data?: object): Promise<T> {
        return this.instance.put(url, data);
    }

    //delete请求
    delete<T = Result>(url: string, data?: Object): Promise<T> {
        return this.instance.delete(url, data);
    }
    upload<T = Result>(url:string,data?:Object):Promise<T>{
        let config = {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
        return this.instance.post(url,data,config);
    }
}

export default new request(config);
