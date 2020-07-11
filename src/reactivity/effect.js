

/**
 *              WeakMap
 *      key                     value Map
 *                              
 *                              name:Set{effect, effect}
 *  {name: 'zf', age: 11}       
 *                              age: Set{effect}
 * 
 *                              name: Set{effect, effect}
 *  {name: 'jw', age: 28}       
 *                              age: Set{effect}
 */

import { TriggerOpTypes } from "./operation";



export function effect(fn, options = {},) {
    // 将传入的函数包装成响应式的函数,数据变化函数执行
    const effect = createReactiveEffect(fn, options)
    if (!options.lazy) {
        effect() // 默认执行
    }
    return effect;
}


/**
 * 创建响应式的effect
 */
let uid = 0;
let activeEffect; // 当前的effect
const effectStack = [] //  栈结构，防止重复调用

function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effectStack)) { //防止不同的更改属性，导致死循环
            try {
                effectStack.push(effect); // 把自己这个函数放到这个栈中
                activeEffect = effect; // 将effect 放到了activeEffect上
                return fn()
            } finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }

    effect.options = options;
    effect.id = uid++;
    effect.deps = [] // 依赖了那些属性，那些属性变化了

    return effect
}



// *********effect和reactive关联 简易版************
// 取值
// let curret
// export function track() {
//     curret = activeEffect
// }

// // 设置值
// export function trigger() {
//     curret()
// }
// *********effect和reactive关联 简易版 End************





const targetMap = new WeakMap() //  用法和map一致，但是弱引用，不会导致内存泄漏


let curret
/**
 * 
 * @param {object} target 目标对象
 * @param {string} type 类型
 * @param {string} key 属性 
 */
export function track(target, type, key) {
    if (activeEffect === undefined) {
        return // 说明取值的属性，不依赖于effect
    }

    let depsMap = targetMap.get(target) // 根据key来进行取值
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get()

    if (!dep) {
        // TODO 了解一下（）括号的含义 先赋值在设置值
        depsMap.set(key, (dep = new Set()))
    }
    // 当前属性存过了就不需要在存了
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect) //Set  { "{name:'jw'}": {name: set(effect)} }
        activeEffect.deps.push(dep) // 让这个effect 记录dep属性
    }

}

// 设置值
export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target) // 获取当前对应的map
    if (!depsMap) {
        return
    }
    // 计算属性要优先于effect执行
    const effects = new Set();
    const computedRunners = new Set();
    const add = (effectsToAdd) => {
        if(effectsToAdd){
            // 分类执行
            effectsToAdd.forEach(effect => {
                if(effect.options.computed){
                    computedRunners.add(effect)
                }else{
                    effects.add(effect)
                }
            })
        }
    }

    // const run = (effects) => {
    //     if (effects) {
    //         effects.forEach(effect => effect())
    //     }
    // }

    if (key !== null) {
        add(depsMap.get(key)) // 对应的effect 依次执行
    }

    // arr.push(4)  [1,2,3,   4]   push  length
    if (type === TriggerOpTypes.ADD) { // 对数组新增属性会触发length 对应的依赖 在取值的时候会对length属性进行依赖收集
        add(depsMap.get(Array.isArray(target) ? 'length' : ''))
    }


    const run = (effect) => {
        if(effect.options.scheduler){
            effect.options.scheduler()
        }else{
            effect()
        }
    }

    computedRunners.forEach(run)
    effects.forEach(run)
}

