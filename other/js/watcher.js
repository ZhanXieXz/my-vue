class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        // 回调函数，更新试图
        this.cb = cb;
        //把watcher对象记录到dep类的静态数据target
        // 触发get方法
        Dep.target = this;
        this.oldV = vm[key];
        Dep.target = null;
    }
    // 数据变化时更新视图
    update () {
        let newV = this.vm[this.key];
        if (newV === this.oldV) {
            return;
        }
        this.cb(newV);
    }
}