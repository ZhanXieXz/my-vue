class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        // 判断data是否对象，以及是否有值
        if (!data || typeof data != 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])

        })
    }
    defineReactive(obj, key, val) {
        const _this = this
        // 负责收集依赖，并发送通知
        let dep = new Dep()
        // 如果val类型是obj，那么再执行walk
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return val;
            },
            set(newV) {
                if (newV !== val) {
                    val = newV;
                    _this.walk(newV);
                    // 发送通知
                    dep.notify();
                }
            }
        })
    }
}