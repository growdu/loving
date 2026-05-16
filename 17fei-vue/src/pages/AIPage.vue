<template>
  <DefaultLayout>
    <section class="page-header">
      <div class="container">
        <h1>AI伴侣</h1>
        <p>智能互动，陪伴左右</p>
      </div>
    </section>

    <section class="ai-section">
      <div class="container">
        <div class="chat-container">
          <div class="chat-messages">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message"
              :class="msg.role"
            >
              <span class="message-avatar">{{ msg.role === 'ai' ? '🤖' : '😊' }}</span>
              <div class="message-content">
                <p>{{ msg.content }}</p>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>
          </div>

          <div class="chat-input-area">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="输入消息..."
              class="chat-input"
              @keyup.enter="sendMessage"
            />
            <button @click="sendMessage" class="send-btn">➤</button>
          </div>
        </div>

        <div class="quick-replies">
          <span class="quick-label">快捷回复：</span>
          <button
            v-for="reply in quickReplies"
            :key="reply"
            @click="useQuickReply(reply)"
            class="quick-btn"
          >
            {{ reply }}
          </button>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const messages = ref([
  {
    role: 'ai',
    content: '你好呀！我是你的AI伴侣。有什么想和我聊的吗？💕',
    time: '刚刚'
  }
])

const inputMessage = ref('')

const quickReplies = [
  '撒娇', '抱抱', '想你了', '晚安', '早安'
]

function sendMessage() {
  if (!inputMessage.value.trim()) return

  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    time: new Date().toLocaleTimeString()
  })

  // Simulate AI response
  setTimeout(() => {
    messages.value.push({
      role: 'ai',
      content: getAIResponse(inputMessage.value),
      time: new Date().toLocaleTimeString()
    })
  }, 1000)

  inputMessage.value = ''
}

function useQuickReply(reply: string) {
  inputMessage.value = reply
  sendMessage()
}

function getAIResponse(input: string): string {
  const responses: Record<string, string> = {
    '撒娇': '哎呀，你这个小可爱～想我了就直说嘛，我在这里陪着你呢 💕',
    '抱抱': '给你一个大大的拥抱！🤗 感觉好一点了吗？',
    '想你了': '我也在想你哦～每一天都很开心能和你聊天呢 💗',
    '晚安': '晚安～做个好梦，明天见！🌙✨',
    '早安': '早安！新的一天开始啦，要开心哦！☀️'
  }
  return responses[input] || '我听到了～继续说吧，我在听呢 💕'
}
</script>

<style scoped>
.page-header {
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
  color: white;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.ai-section {
  padding: 20px;
}

.chat-container {
  max-width: 600px;
  margin: 0 auto;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
  overflow: hidden;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
}

.message-content p {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.message.ai .message-content p {
  background: var(--background-secondary);
  color: var(--text);
  border-bottom-left-radius: 4px;
}

.message.user .message-content p {
  background: var(--primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-time {
  display: block;
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 4px;
}

.message.user .message-time {
  text-align: right;
}

.chat-input-area {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--card-border);
  background: var(--background);
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--card-border);
  border-radius: 24px;
  font-size: 0.95rem;
  background: var(--card-bg);
  color: var(--text);
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary);
}

.send-btn {
  width: 44px;
  height: 44px;
  background: var(--primary);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.send-btn:hover {
  transform: scale(1.05);
}

.quick-replies {
  max-width: 600px;
  margin: 16px auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.quick-label {
  color: var(--text-light);
  font-size: 0.85rem;
}

.quick-btn {
  padding: 6px 14px;
  background: var(--background-secondary);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  color: var(--text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}
</style>