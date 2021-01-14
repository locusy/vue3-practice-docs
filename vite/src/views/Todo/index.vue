<template>
  <section class="todoapp">
    <!-- <teleport to="#modal">
      <div class="modal" v-if="x<10||y<10"></div>
    </teleport> -->
    <h1>{{username}}</h1>
    <header class="header" :class="{fixed:top>130}">
      <h1>{{count}} <button @click="addCount(todo)">addCount</button></h1>
      <h1>{{x}},{{y}}</h1>
      <input 
        class="new-todo"
        placeholder="想干的事"
        v-model="newTodo"
        v-todo-focus=""
        @keyup.enter="addTodo">
    </header>

    <section class="main" v-show="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li v-for="todo in todos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)">del</button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.title"
            v-todo-focus="todo == editedTodo"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)">
        </li>
      </ul>
    </section>

    <footer class="footer" v-show="todos.length" v-cloak>
      <span class="todo-count">
        <strong>{{ remaining }}</strong>  left
      </span>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>

  </section>
</template>

<script lang="ts">
import {
  defineComponent, // 标识导出一个组件
  reactive,  // 接收一个对象，返回一个响应式对象
  ref,   // 接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 .value。
  toRef,  // 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。
  toRefs,   // 可以用来为一个reactive对象的属性创建一个ref。这个ref可以被传递并且能够保持响应性 和响应式对象 property 一一对应
  computed, // 计算属性
  nextTick,  // 这是一个任务队列，等待同步任务结束之后依次执行
  watch,  // 监控一个对象或者属性，发生变化之后在操作
  watchEffect, // 监听器的升级版本，立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。
  onMounted,  // 挂载结束之后执行
} from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import useScroll from './scroll'
import useMouse from './mouse'

interface Todo {
  id: string|number;
  title: string;
  completed: boolean
}

interface Reactive {
  newTodo: string,
  todos: Array<Todo>,
  foo: number,
  bar: number,
  beforeEditCache: string,
  editedTodo: null
}

export default defineComponent({
  name: 'Todo',
  setup(props, context) {
    const count = ref(99)
    const object: Reactive = {
      newTodo: '',
      todos: [
        { id: "1", title: "吃饭", completed: false },
        { id: "2", title: "睡觉", completed: false },
        { id: "3", title: "学习vue3", completed: false },
        { id: "4", title: "写文章", completed: false },
        { id: "5", title: "看动画", completed: false },
        { id: "6", title: "逛知乎", completed: false },
        { id: "7", title: "撸狗", completed: false },
        { id: "8", title: "摸鱼", completed: true },
      ],
      foo: 1,
      bar: 2,
      beforeEditCache: '',
      editedTodo: null
    }
    const state = reactive(object)


    // store获取用法
    const store = useStore()
    const username = store.state['userName']


    // 获取当前路由
    const route = useRoute()

    // 获取路由实例
    const router = useRouter()

    // 监听当前路由变化
    // onBeforeRouteUpdate(() => {
       // 当当前路由发生变化时，调用回调函数
    //    console.log(route, 'route---')
    // })
    watch(route, (curr, prev) => {
      /** */
      console.log(curr, prev, 'prev')
    }, {
      immediate: true,
      deep: true
    })
    // 路由跳转
    // router.push({path: '/home'})


    /** toRef */
    const fooRef = toRef(state, 'foo')
    fooRef.value++
    console.log(state.foo, 'fooo') // 2

    state.foo++
    console.log(fooRef.value, 'foooo') // 3


    // watch 直接监听一个ref
    watch(count, (count, prevCount) => {
      /** */
    }, {
      immediate: true,
      deep: true
    })

    function addCount(): void {
      count.value++
    }

    // watch 监听一个getter
    watch(
      () => state.newTodo, 
      (newTodo, prevNewTodo) => {
        /** */
      }, {
        immediate: true,
        deep: true
      }
    )

    // watchEffect
    watchEffect(() => console.log(count.value))

    // 停止监听
    const stop = watchEffect(() => {
      /* ... */
      console.log(count.value, 'watchEffect')
    })
    stop()

    function addTodo(): void {
      var value = state.newTodo && state.newTodo.trim()
      if (!value) {
        return
      }
      state.todos.push({
        id: state.todos.length + 1,
        title: value,
        completed: false
      })
      state.newTodo = ""     
    }

    function removeTodo(todo): void {
      const index = state.todos.indexOf(todo)
      state.todos.splice(index, 1)
    }

    function editTodo(todo) {
      state.beforeEditCache = todo.title;
      state.editedTodo = todo;
    }

    function doneEdit(todo) {
      if (!state.editedTodo) {
        return;
      }
      state.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        removeTodo(todo);
      }
    }

    function cancelEdit(todo) {
      state.editedTodo = null;
      todo.title = state.beforeEditCache;
    }


    const remaining = computed(
      () => state.todos.filter(todo => !todo.completed).length,
    )

    const allDone = computed({
      get: function() {
        return remaining.value === 0;
      },
      set: function( value: boolean ): void {
        state.todos.forEach(function(todo) {
          todo.completed = value;
        });
      }
    })
    

    function removeCompleted() {
      state.todos = state.todos.filter(todo => !todo.completed);
    }
    
    const {top} = useScroll()
    const {x,y} = useMouse()

    onMounted(() => {
      nextTick(() => {
        console.log(state.newTodo)
      })
    })

    return {
      count,
      // toRefs 可以保证我们的reactive下边的所有属性都是响应式的
      ...toRefs(state),
      addCount,
      remaining,
      allDone,
      top,
      x,
      y,
      addTodo,
      removeTodo,
      removeCompleted,
      editTodo,
      doneEdit,
      cancelEdit,
      username
    }
  },
  directives: {
    "todo-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
})
</script>


<style>
.modal{
  position:fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
  background: rgba(0,0,0,0.7);
  z-index:1000;
}

.header.fixed{
  background: #fff;
  position: fixed;
  top:0;
  left:0;
  right:0;
  width:100%;
  z-index:100;
}

.completed label {
  text-decoration: line-through;
}

li .edit {
  display: none;
}
li .view {
  display: block;
}
li.editing .edit {
  display: block;
}

li.editing .view {
  display: none;
}
</style>