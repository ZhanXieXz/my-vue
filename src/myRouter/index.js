
/**
 * 
 * */
let _Vue = null;
export default class VueRouter {
    constructor(options) {
        this.options = options;
        this.routerMap = {};
        this.data = _Vue.observable({
            current: '/'
        })
    }

    static install(Vue) {
        // 1. 判断当前插件是否已安装
        if (VueRouter.install.installed) {
            return;
        }
        VueRouter.install.installed = true;
        // 2. 将Vue构造函数记录到全局变量
        _Vue = Vue;

        // 3. 将创建Vue实例的时候传入的router对象注入到Vue实例上
        // 如果直接调用，那么this的指向是Vuerouter
        // 使用混入，在vue beforeCreate钩子函数中即可获取到vue实例，这个时候的this就是指向vue
        _Vue.mixin({
            beforeCreate() {
                console.log(this);
                if (this.$options.router) { // 判断是实例才需要执行赋值，组件则跳过
                    _Vue.prototype.$router = this.$options.router;
                    // console.log('this.$options.router', this.$options.router);
                    this.$options.router.init();
                }
            }
        })
    }

    createRouteMap() {
        // 遍历路由规则，解析成键值对形式，存储到routerMap中
        this.options.routes.forEach(route => {
            this.routerMap[route.path] = route.component;
        })
    }

    initComponents(Vue) {
        const _this = this;
        _Vue.component('router-link', {
            props: {
                to: String
            },
            render(h) { // 运行时的版本需要自己编写render函数，进行渲染。完整版本的vue包含编译器
                return h('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandeler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandeler(e) {
                    history.pushState({}, '', this.to);
                    this.$router.data.current = this.to;
                    e.preventDefault();
                }
            }
            // template: '<a :href="to"><slot></slot></a>' // 直接使用template需要使用完整版的vue，因为运行时的版本不支持，在根目录添加vue.config.js文件，配置runtimeCompiler: true即可开启完整版的vue
        })
        _Vue.component('router-view', {
            render(h) {
                const component = _this.routerMap[_this.data.current]
                return h(component)
            }
        })
    }

    initEvent() {
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname;
        })
    }

    init() {
        this.createRouteMap();
        this.initComponents();
        this.initEvent();
    }
}