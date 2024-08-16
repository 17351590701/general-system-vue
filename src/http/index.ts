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
    baseURL: "http://localhost:8080",
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

class request {
    //axios实例化
    private instance: AxiosInstance;

    //初始化的作用
    constructor(configs: AxiosRequestConfig) {
        //实例化axios对象
        this.instance = axios.create(configs);
        //配置拦截器
        this.interceptors();
    }

    //请求发送之前，返回之后做统一处理
    private interceptors() {
        //请求发送之前的处理，请求头携带token
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                //获取token
                const userStore = useUserStore();
                let token = userStore.getToken;
                if (token) {
                    config.headers["token"] = token;
                }
                return config;
            },
            (error: any) => {
                //处理请求发送之前的错误
                error.data = {};
                error.data.msg = "请求发送失败，请稍后再试";
                // // 处理错误并封装为 Promise.reject,可以在这里记录日志或者进行其他处理
                return Promise.reject(error);
            }
        );

        //请求返回之后的处理，统一处理返回值
        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                if (res.data.code == 200) {
                    return res.data;
                } else if (res.data.code == 600) {
                    //token过期，清空数据，跳转登录
                    const userStore = useUserStore();
                    userStore.setToken("");
                    userStore.setUserId("");
                    localStorage.clear();
                    window.location.href = "/login";
                } else {
                    ElMessage.error(res.data.msg || "接口报错!");
                    return Promise.reject(res.data || "接口报错!");
                }
            },
            (error: any) => {
                console.log("进入错误");
                error.data = {};
                if (error && error.response) {
                    switch (error.response.status) {
                        case 400:
                            error.data.msg = "请求参数错误";
                            ElMessage.error(error.data.msg);
                            break;
                        case 401:
                            error.data.msg = "请先登录";
                            ElMessage.error(error.data.msg);
                            break;
                        case 403:
                            error.data.msg = "无权限访问";
                            ElMessage.error(error.data.msg);
                            break;
                        case 404:
                            error.data.msg = "请求的资源不存在";
                            ElMessage.error(error.data.msg);
                            break;
                        case 405:
                            error.data.msg = "请求方法不被允许";
                            ElMessage.error(error.data.msg);
                            break;
                        case 408:
                            error.data.msg = "请求超时";
                            ElMessage.error(error.data.msg);
                            break;
                        case 500:
                            error.data.msg = "后台接口错误";
                            ElMessage.error(error.data.msg);
                            break;
                        case 501:
                            error.data.msg = "服务未实现";
                            ElMessage.error(error.data.msg);
                            break;
                        case 502:
                            error.data.msg = "网关错误";
                            ElMessage.error(error.data.msg);
                            break;
                        case 503:
                            error.data.msg = "服务不可用";
                            ElMessage.error(error.data.msg);
                            break;
                        case 504:
                            error.data.msg = "网关超时";
                            ElMessage.error(error.data.msg);
                            break;
                        case 505:
                            error.data.msg = "HTTP版本不受支持";
                            ElMessage.error(error.data.msg);
                            break;
                        default:
                            error.data.msg = `连接错误${error.response.status}`;
                            ElMessage.error(error.data.msg);
                            break;
                    }
                } else {
                    error.data.msg = "连接服务器失败";
                    ElMessage.error(error.data.msg);
                }
                return Promise.reject(error.data);
            }
        );
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
    delete<T = Result>(url: string): Promise<T> {
        return this.instance.delete(url);
    }

    //图片上传
    // upload<T = Result>(url: string, params?: object): Promise<T> {
    //     return this.instance.post(url, params, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     })
    // }
}

export default new request(config);
