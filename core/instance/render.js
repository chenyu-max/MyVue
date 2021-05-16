// 通过模板来找到哪些节点用到了这个模板
let template2VNode = new Map();

// 通过节点，找到这个节点下有哪些模板
let vNode2Template = new Map();

export function prepareRender(vm, vNode) {
    if (vNode === null) {
        return;
    }
    if (vNode.nodeType === 3) {
        // 是个文本节点
        analysisTemplateString(vNode);
    }
    if (vNode.nodeType === 1) {
        // 元素节点
        for (let i = 0; i < vNode.children.length; i++) {
            prepareRender(vm, vNode.children[i]);
        }
    }
}

/**
 * 对文本节点的文本进行模板分析
 * @param vNode
 */
function analysisTemplateString(vNode) {
    let templateStringList = vNode.text.match(/{{[a-zA-Z0-9_.]+}}/g);
    for (let i = 0; templateStringList && i < templateStringList.length; i++) {
        setTemplate2VNode(templateStringList[i], vNode);
        setVNode2Template(templateStringList[i], vNode);
    }
}

/**
 * 通过模板设置节点
 * @param template
 * @param vNode
 */
function setTemplate2VNode(template, vNode) {
    const templateName = getTemplateName(template);
    const vNodeSet = template2VNode.get(templateName);
    if (vNodeSet) {
        vNodeSet.push(vNode);
    } else {
        template2VNode.set(templateName, [vNode]);
    }
}

/**
 * 通过节点设置模板
 * @param template
 * @param vNode
 */
function setVNode2Template(template, vNode) {
    const templateSet = vNode2Template.get(vNode);
    if (templateSet) {
        templateSet.push(getTemplateName(template));
    } else {
        vNode2Template.set(vNode, [getTemplateName(template)]);
    }
}

/**
 * 对模板 {{xxx}} 进行解析
 * @param template
 * @returns {string|*}
 */
function getTemplateName(template) {
    // 判断是否有花括号，如果有，则解掉，如果没用，则直接返回
    if (template.substring(0, 2) === '{{' && template.substring(template.length - 2, template.length) === '}}') {
        return template.substring(2, template.length - 2);
    } else {
        return template;
    }

}
