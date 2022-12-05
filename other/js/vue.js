class Vue {
    constructor(options) {
        this.$options = options || {};
        this.$data = options.data;
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        // 把data中的成员转换成getter和setter，注入到vue实例
        this._proxyData(this.$data);
        new Observer(this.$data);
        new Compiler(this);
    }
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key];
                },
                set(newV) {
                    if (newV !== data[key]) {
                        data[key] = newV;
                    }
                }
            })
        })
    }

}
