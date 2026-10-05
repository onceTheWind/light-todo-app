<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

type FilterType = 'all' | 'active' | 'completed'
interface TodoItem { id: number; title: string; completed: boolean }

const storageKey = 'light-todo-items'
const todos = ref<TodoItem[]>((uni.getStorageSync(storageKey) as TodoItem[]) || [])
const inputText = ref('')
const currentFilter = ref<FilterType>('all')
const nextId = ref(todos.value.reduce((max, item) => Math.max(max, item.id), 0) + 1)
const statusBarHeight = ref(0)
const topbarStyle = computed(() => ({
  paddingTop: `${statusBarHeight.value}px`,
}))
const todayLabel = computed(() => {
  const date = new Date()
  return `${date.getMonth() + 1}月${date.getDate()}日 · ${['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()]}`
})
const activeCount = computed(() => todos.value.filter((item) => !item.completed).length)
const completedCount = computed(() => todos.value.length - activeCount.value)
const progress = computed(() => todos.value.length ? Math.round(completedCount.value / todos.value.length * 100) : 0)
const filteredTodos = computed(() => currentFilter.value === 'active'
  ? todos.value.filter((item) => !item.completed)
  : currentFilter.value === 'completed'
    ? todos.value.filter((item) => item.completed)
    : todos.value)

watch(todos, (items) => uni.setStorageSync(storageKey, items), { deep: true })
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})
function addTodo() {
  const title = inputText.value.trim()
  if (!title) return
  todos.value.unshift({ id: nextId.value++, title, completed: false })
  inputText.value = ''
  uni.hideKeyboard()
}
function toggleTodo(id: number) {
  const todo = todos.value.find((item) => item.id === id)
  if (todo) todo.completed = !todo.completed
}
function deleteTodo(id: number) { todos.value = todos.value.filter((item) => item.id !== id) }
</script>

<template>
  <view class="page">
    <view class="topbar" :style="topbarStyle">
      <view class="brand-mark"><view class="brand-check" /></view><text class="brand-name">轻待办</text>
    </view>
    <view class="heading">
      <view class="eyebrow-row"><text class="eyebrow">今天也向前一点</text><text class="date-label">{{ todayLabel }}</text></view>
      <text class="headline">把小事，一件件做好。</text>
      <view class="progress-row"><view class="progress-track"><view class="progress-fill" :style="{ width: `${progress}%` }" /></view><text class="progress-copy">{{ completedCount }}/{{ todos.length }}</text></view>
    </view>
    <view class="composer">
      <view class="input-symbol">＋</view>
      <input v-model="inputText" class="todo-input" maxlength="80" confirm-type="done" placeholder="添加一件待办..." placeholder-class="input-placeholder" @confirm="addTodo" />
      <button class="add-button" :class="{ ready: inputText.trim() }" @tap="addTodo">添加</button>
    </view>
    <view class="list-header"><text class="list-title">我的清单</text><text class="remaining-count">{{ activeCount }} 件待完成</text></view>
    <view class="filters">
      <button v-for="filter in ([['all', '全部'], ['active', '待完成'], ['completed', '已完成']] as const)" :key="filter[0]" class="filter-button" :class="{ selected: currentFilter === filter[0] }" @tap="currentFilter = filter[0]">{{ filter[1] }}</button>
    </view>
    <scroll-view class="list-scroll" scroll-y>
      <view v-if="filteredTodos.length" class="todo-list">
        <view v-for="(item, index) in filteredTodos" :key="item.id" class="todo-row" :class="{ done: item.completed }">
          <view class="todo-check" :class="{ checked: item.completed }" @tap="toggleTodo(item.id)"><view v-if="item.completed" class="check-mark" /></view>
          <view class="todo-content" @tap="toggleTodo(item.id)"><text class="todo-title">{{ item.title }}</text><text class="todo-meta">{{ item.completed ? '已完成' : `待办 · ${String(index + 1).padStart(2, '0')}` }}</text></view>
          <button class="delete-button" aria-label="删除待办" @tap="deleteTodo(item.id)"><view class="trash-icon"><view class="trash-lid" /><view class="trash-body"><view /><view /></view></view></button>
        </view>
      </view>
      <view v-else class="empty-state"><view class="empty-icon"><view class="empty-check" /></view><text class="empty-title">{{ currentFilter === 'completed' ? '还没有完成的事项' : currentFilter === 'active' && todos.length ? '今天的待办都完成了' : '从一件小事开始' }}</text><text class="empty-caption">{{ currentFilter === 'active' && todos.length ? '给自己一点掌声吧' : '写下你想完成的第一件事' }}</text></view>
    </scroll-view>
    <view class="bottom-note"><view class="note-dot" /><text>已完成 {{ completedCount }} 件 · 继续保持自己的节奏</text></view>
  </view>
</template>

<style>
page { min-height: 100%; background: #f6f7f4; color: #232923; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
button { margin: 0; padding: 0; border: 0; background: transparent; line-height: normal; } button::after { border: 0; }
.page { min-height: 100vh; padding: 0 24px calc(28px + env(safe-area-inset-bottom)); box-sizing: border-box; display: flex; flex-direction: column; }
.topbar { height: 44px; box-sizing: content-box; display: flex; align-items: center; }
.brand-mark { width: 27px; height: 27px; border-radius: 9px; background: #315c4a; display: flex; align-items: center; justify-content: center; }
.brand-check { width: 10px; height: 6px; border-left: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(-45deg) translate(1px, -1px); }
.brand-name { margin-left: 9px; font-size: 15px; font-weight: 700; color: #28372f; } .date-label { color: #8a938c; font-size: 12px; }
.heading { padding: 35px 0 25px; } .eyebrow-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 9px; } .eyebrow { color: #718477; font-size: 13px; }
.headline { display: block; font-size: 27px; line-height: 1.35; font-weight: 700; color: #26342c; }
.progress-row { display: flex; align-items: center; gap: 12px; margin-top: 22px; } .progress-track { height: 4px; flex: 1; background: #e3e8e2; border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: #4b8064; border-radius: 4px; transition: width .2s ease; } .progress-copy { color: #77837a; font-size: 12px; min-width: 30px; text-align: right; }
.composer { height: 54px; background: #fff; border: 1px solid #e8ece7; border-radius: 12px; display: flex; align-items: center; padding: 0 8px 0 14px; box-shadow: 0 4px 14px rgba(36,55,42,.035); }
.input-symbol { color: #7d9b87; font-size: 22px; line-height: 1; margin-right: 10px; } .todo-input { flex: 1; min-width: 0; height: 100%; font-size: 14px; color: #29352d; }
.input-placeholder { color: #aab2ab; } .add-button { width: 58px; height: 36px; border-radius: 8px; background: #edf1ed; color: #87928a; font-size: 13px; display: flex; align-items: center; justify-content: center; }
.add-button.ready { background: #315c4a; color: white; } .list-header { display: flex; align-items: baseline; justify-content: space-between; margin: 32px 0 14px; }
.list-title { font-size: 17px; font-weight: 700; color: #29352d; } .remaining-count { font-size: 12px; color: #939c95; }
.filters { display: flex; gap: 8px; margin-bottom: 10px; } .filter-button { height: 32px; padding: 0 13px; border-radius: 8px; background: transparent; color: #818b83; font-size: 12px; display: flex; align-items: center; justify-content: center; }
.filter-button.selected { background: #e6ece6; color: #315c4a; font-weight: 600; } .list-scroll { flex: 1; min-height: 180px; }
.todo-list { background: #fff; border: 1px solid #eaede9; border-radius: 12px; overflow: hidden; } .todo-row { min-height: 72px; display: flex; align-items: center; padding: 0 13px 0 15px; gap: 13px; }
.todo-row + .todo-row { border-top: 1px solid #f0f2ef; } .todo-check { width: 21px; height: 21px; border: 1.5px solid #cbd4cc; border-radius: 50%; flex: 0 0 21px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
.todo-check.checked { border-color: #4b8064; background: #4b8064; } .check-mark { width: 8px; height: 5px; border-left: 1.5px solid white; border-bottom: 1.5px solid white; transform: rotate(-45deg) translate(1px,-1px); }
.todo-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; } .todo-title { color: #303a33; font-size: 14px; line-height: 1.4; word-break: break-all; }
.todo-meta { color: #9ba49c; font-size: 11px; } .todo-row.done .todo-title { color: #9ca59e; text-decoration: line-through; }
.delete-button { width: 32px; height: 36px; display: flex; align-items: center; justify-content: center; opacity: .56; } .trash-icon { width: 14px; height: 16px; position: relative; }
.trash-lid { position: absolute; left: 3px; top: 1px; width: 9px; height: 2px; border-radius: 2px; background: #87928a; } .trash-lid::before { content: ""; position: absolute; left: 3px; top: -2px; width: 3px; height: 1.5px; background: #87928a; }
.trash-body { position: absolute; left: 3px; top: 4px; width: 9px; height: 11px; border: 1.5px solid #87928a; border-top: 0; border-radius: 0 0 3px 3px; box-sizing: border-box; display: flex; justify-content: space-evenly; } .trash-body view { width: 1px; height: 6px; margin-top: 2px; background: #87928a; }
.empty-state { min-height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; } .empty-icon { width: 42px; height: 42px; border-radius: 14px; background: #e8eee8; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
.empty-check { width: 12px; height: 7px; border-left: 2px solid #63836d; border-bottom: 2px solid #63836d; transform: rotate(-45deg) translate(1px,-1px); } .empty-title { font-size: 14px; color: #58645b; font-weight: 600; }
.empty-caption { margin-top: 7px; font-size: 12px; color: #9aa39b; } .bottom-note { display: flex; align-items: center; justify-content: center; gap: 7px; padding-top: 16px; color: #9aa39b; font-size: 11px; }
.note-dot { width: 5px; height: 5px; border-radius: 50%; background: #78a084; }
</style>
