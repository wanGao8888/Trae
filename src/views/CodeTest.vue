<template>
  <div class="code-test">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>代码测试</span>
        </div>
      </template>
      
      <div class="editor-container">
        <div class="code-section">
          <div class="section-header">代码编辑区</div>
          <el-input
            v-model="form.code"
            type="textarea"
            :rows="15"
            class="code-editor"
            placeholder="请输入要测试的代码"
            spellcheck="false"
            @keydown.tab.prevent="handleTab"
          />
        </div>
        
        <div class="output-section">
          <div class="section-header">输出结果</div>
          <pre class="output-content" v-if="testResult">{{ testResult }}</pre>
          <div class="empty-output" v-else>等待运行...</div>
        </div>
      </div>

      <div class="control-panel">
        <el-button type="primary" @click="handleTest">
          <el-icon><VideoPlay /></el-icon>
          运行
        </el-button>
        <el-button @click="clearForm">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { VideoPlay, Delete } from '@element-plus/icons-vue'

const form = reactive({
  code: '',
  input: ''
})

const testResult = ref('')

const handleTest = () => {
  try {
    // 创建一个新的函数作用域来执行代码
    const consoleLogs: any[] = [];
    const mockConsole = {
      log: (...args: any[]) => {
        consoleLogs.push(args);
      }
    };

    // 将代码包装在函数中执行
    const wrappedCode = `
      (function() {
        const console = arguments[0];
        ${form.code}
      })
    `;

    // 执行代码
    const fn = eval(wrappedCode);
    fn(mockConsole);

    // 格式化输出结果
    testResult.value = consoleLogs
      .map(args => args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '))
      .join('\n');

  } catch (error) {
    testResult.value = `错误: ${error.message}`;
  }
}

const clearForm = () => {
  form.code = ''
  form.input = ''
  testResult.value = ''
}

const handleTab = (e: KeyboardEvent) => {
  const target = e.target as HTMLTextAreaElement
  const start = target.selectionStart
  const end = target.selectionEnd

  // 在光标位置插入制表符（两个空格）
  const spaces = '  '
  form.code = form.code.substring(0, start) + spaces + form.code.substring(end)

  // 设置新的光标位置
  setTimeout(() => {
    target.selectionStart = target.selectionEnd = start + spaces.length
  })
}
</script>

<style scoped>
.code-test {
  padding: 20px;
  height: calc(100vh - 120px);
  background-color: #f5f7fa;
}

.test-card {
  height: 100%;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100% - 120px);
}

.code-section, .output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 6px;
  overflow: hidden;
}

.section-header {
  padding: 8px 16px;
  background-color: #2d2d2d;
  color: #fff;
  font-size: 14px;
  border-bottom: 1px solid #3d3d3d;
}

.code-editor {
  flex: 1;
}

:deep(.code-editor .el-textarea__inner) {
  height: 100% !important;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #d4d4d4;
  background-color: #1e1e1e;
  border: none;
  resize: none;
}

:deep(.code-editor .el-textarea__inner:focus) {
  box-shadow: none;
}

.output-content {
  flex: 1;
  margin: 0;
  padding: 16px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #d4d4d4;
  background-color: #1e1e1e;
  overflow: auto;
}

.empty-output {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-style: italic;
}

.control-panel {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.el-button {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>