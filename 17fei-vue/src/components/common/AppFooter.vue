<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-links">
        <router-link to="/about" class="footer-link">关于我们</router-link>
        <router-link to="/member" class="footer-link">会员空间</router-link>
        <a href="#" class="footer-link">联系客服</a>
      </div>
      <p class="footer-text">© 2024 loving.fun 版权所有</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 40px 20px;
  text-align: center;
  background: var(--card-bg);
  border-top: 1px solid var(--card-border);
  margin-top: auto;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--primary);
}

.footer-text {
  color: var(--text-light);
  font-size: 0.85rem;
}
</style>