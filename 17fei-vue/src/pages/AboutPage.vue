<template>
  <DefaultLayout>
    <section class="page-header">
      <div class="container">
        <h1>关于我们</h1>
        <p>了解Loving的故事</p>
      </div>
    </section>

    <section class="about-section">
      <div class="container">
        <div class="about-card">
          <h2>💕 我们的故事</h2>
          <p>
            Loving 是一个专为情侣设计的亲密互动平台。我们相信，健康、和谐的亲密关系
            需要双方的用心经营。通过有趣的游戏和互动，我们希望帮助情侣们增进感情，
            让爱情保持新鲜和有趣。
          </p>
        </div>

        <div class="about-card">
          <h2>🎯 我们的使命</h2>
          <p>
            为情侣提供安全、私密、有趣的亲密互动体验。我们致力于打造一个充满爱的空间，
            让每一对情侣都能在这里找到专属的快乐时光。
          </p>
        </div>

        <div class="about-card">
          <h2>🔒 隐私保护</h2>
          <p>
            您的隐私对我们至关重要。所有数据都经过加密处理，我们绝不会收集或分享
            您的个人隐私信息。请放心享受我们的服务。
          </p>
        </div>

        <div class="about-card">
          <h2>📞 联系我们</h2>
          <p>
            如果您有任何问题或建议，欢迎通过以下方式联系我们：<br />
            邮箱：support@loving.fun<br />
            微信：loving2024
          </p>
        </div>

        <div class="about-footer">
          <p>© 2024 loving.fun 版权所有</p>
          <p>粤ICP备12345678号</p>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
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

.about-section {
  padding: 40px 20px;
}

.about-card {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
  padding: 24px;
  margin-bottom: 20px;
}

.about-card h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
}

.about-card p {
  color: var(--text-light);
  line-height: 1.7;
  font-size: 0.95rem;
  margin: 0;
}

.about-footer {
  text-align: center;
  padding-top: 20px;
  color: var(--text-light);
  font-size: 0.85rem;
}

.about-footer p {
  margin: 4px 0;
}
</style>