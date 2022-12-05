class Compiler {
    constructor(vm) {
        this.el = vm.$el;
        this.vm = vm;
        this.compiler(this.el);
    }
    // 编译模板，处理文本节点和元素节点
    compiler(el) {
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node); // 处理文本节点
            } else if (this.isElementNode(node)) {
                this.compileElement(node); // 处理元素节点
            }

            // 判断node节点是否还存在子节点
            if (node.childNodes && node.childNodes.length) {
                this.compiler(node);
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2); // v-text => text
                let key = attr.value;
                this.update(node, key, attrName);
            }
        })
    }

    // 编译文本节点，处理插件表达式
    compileText(node) {
        // {{ msg }}
        let reg = /\{\{(.+?)\}\}/;
        let value = node.textContent;
        if (reg.test(value)) {
            let key = reg.exec(value)[1].trim();
            node.textContent = value.replace(reg, this.vm[key]); // 只有数据在单层数据结构的时候能取值，如果是复杂数据结构，比如o:{name: ‘test’},无法取到name
            // 创建watcher对象,数据改变时更新视图
            new Watcher(this.vm, key, (newV) => {
                node.textContent = newV;
            })
        }
    }

    update(node, key, attrName) {
        let fn = this[attrName + 'Updater'];
        fn && fn.call(this, node, this.vm[key], key);
    }

    // 处理v-text指令
    textUpdater(node, value, key) {
        node.textContent = value;
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue;
        })
    }

    // 处理v-modle指令
    modelUpdater(node, value, key) {
        node.value = value;
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue;
        })
        node.addEventListener('input', () => {
            this.vm[key] = node.value;
        })
    }

    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-'); // 判断是否v-开头
    }
    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3;
    }
    /**
     * 1 => 一个 元素 节点，例如 <p> 和 <div>
     * 3 => Element 或者 Attr 中实际的 文字
     * 8 => 一个 Comment 节点
     * 9 => 一个 Document 节点
     * */
    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
}