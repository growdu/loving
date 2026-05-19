<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="modal-close" @click="close">×</button>

        <div class="modal-header">
          <span class="vip-icon">💎</span>
          <h2>开通VIP会员</h2>
        </div>

        <div class="vip-benefits">
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>解锁全部姿势</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>解锁全部卡牌</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>AI伴侣无限使用</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>专属主题定制</span>
          </div>
        </div>

        <div class="trial-section" v-if="!store.isVip">
          <p class="trial-hint">开通即享 <strong>7天免费试用</strong></p>
          <button @click="activateTrial" class="trial-btn">
            立即体验VIP
          </button>
        </div>

        <p class="vip-price">
          <span class="price">¥29<span>/月</span></span>
          <span class="price-note">续费同价</span>
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useThemeStore()

function close() {
  emit('close')
}

function activateTrial() {
  store.activateVip()
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  padding: 32px;
  max-width: 380px;
  width: 100%;
  position: relative;
  box-shadow: var(--theme-shadow-hover);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--background-secondary);
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-light);
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--card-border);
  color: var(--text);
}

.modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.vip-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.vip-benefits {
  background: var(--background-secondary);
  border-radius: var(--theme-border-radius-sm);
  padding: 16px;
  margin-bottom: 20px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: var(--text);
  font-size: 0.95rem;
}

.benefit-item:not(:last-child) {
  border-bottom: 1px solid var(--card-border);
}

.benefit-icon {
  color: var(--primary);
  font-weight: 700;
}

.trial-section {
  text-align: center;
  margin-bottom: 20px;
}

.trial-hint {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.trial-hint strong {
  color: var(--primary);
}

.trial-btn {
  width: 100%;
  padding: 14px;
  background: var(--theme-gradient);
  border: none;
  border-radius: var(--theme-border-radius-sm);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.trial-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 84, 131, 0.4);
}

.vip-price {
  text-align: center;
  color: var(--text-light);
  font-size: 0.85rem;
}

.price {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
}

.price span {
  font-size: 0.9rem;
  font-weight: 400;
}

.price-note {
  margin-left: 8px;
}
</style>