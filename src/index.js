
/**
 * 几个重要的方法
 * reactive 将对象变成响应式对象
 * effect 副作用 内部使用的变量，如果发生变化，这个方法默认会重新执行
 * computed 计算属性
 * ref 
 */
//import { reactive, effect, computed, ref } from './reactivity'

import { reactive, effect, computed, ref } from './reactivity'


// 状态绑定 proxy进行代理
const state = reactive({ name: 'jw', age: 11, arr: [1, 2, 3] })

// 调用push方法，会向数组中插入值length 随后更新length
// state.arr.push(4) // 新增
// state.arr[0] = 100 // 修改


/**
 *  vue2.0 有watcher
 *  vue3.0 effect renderEffect
 */
// effect(() => {
//     console.log(state.name,'--effect---');
// })
// state.name = 'hello' // 这里应该导致重新执行effect



// effect(() => {
//     console.log(state.arr,'--arr---');
// })
// state.arr[0] = 100 // 修改

// state.name = 'h'
// 



let myAge = computed(() => { // lazy 为true的effect
    // console.log('执行'); // 只执行一次
    return state.age * 2
})

effect(() => {
    console.log(myAge.value); // 没有触发value的依赖收集
})

state.age = 200




// let myAge = computed({
//     get(){

//     },
//     set(){

//     }
// })