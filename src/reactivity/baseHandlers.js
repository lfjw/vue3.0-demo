
import { isObject, hasOwn, hasChanged } from './../shared/utils'
import { reactive } from './reactive'
import { track, trigger } from './effect';
import { TrackOpTypes, TriggerOpTypes } from './operation';

const get = createGetter();
const set = createSetter();

/**
 * 性能好的原因
 * 只有取值的时候，才会把对象进行代理
 * 而不是像vue2.0直接把对象进行递归深度代理
 */
function createGetter() {

    /**
     * 
     * @param {*} target  目标对象
     * @param {*} key 属性
     * @param {*} receiver 原代理对象
     */
    function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);
        console.log('取值', target, key);

        track(target, TrackOpTypes.GET, key) // 依赖收集

        // 取值依旧是对象，在进行一次代理，递归
        if (isObject(res)) {
            return reactive(res)
        }
        return res;
        // proxy + reflect
        // reflect 类似于  target[key] 
        //return target[key]
    }

    return get
}

function createSetter() {

    /**
     * 
     * @param {object} target 目标对象
     * @param {*} key 属性
     * @param {*} value 值
     * @param {*} receiver 原代理对象
     */
    function set(target, key, value, receiver) {

        // 需要判断是修改还是增加，如果原来的值和新设置的值，一样什么都不做
        const hadKey = hasOwn(target, key)
        const oldValue = target[key];

        // target[key] = value; 设置成功没有提示，所以更改
        const result = Reflect.set(target, key, value, receiver)

        // 说明之前没有这个属性
        if (!hadKey) {
            console.log('属性新增操作', target, key);
            
            trigger(target, TriggerOpTypes.ADD, key, value)
        } else if (hasChanged(value, oldValue)) {
            // value新值, oldValue老值
            trigger(target, TriggerOpTypes.SET, key, value) // 触发依赖更新

            console.log('修改操作', target, key);
        }

        // 值没变化什么都不用做
        return result
    }
    return set
}


// 拦截普通对象和数组的处理
export const mutableHandler = {
    get,
    set,
}