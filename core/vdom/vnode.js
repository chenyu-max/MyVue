export default class VNode {
    /**
     * VNode构造函数
     * @param tag       标签类型 DIV SPAN INPUT #TEXT
     * @param elm       对应的真实节点
     * @param children  当前节点下的子节点
     * @param text      当前虚拟节点中的文本
     * @param data      VNodeData 暂时保留 暂无意义
     * @param parent    父级节点
     * @param nodeType  节点类型
     */
    constructor(tag, elm, children, text, data, parent, nodeType) {
        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {};              // 当前节点的环境变量
        this.instructions = null;   // 存放指令
        this.template = [];         // 当前节点涉及到的模板
    }
    
}
