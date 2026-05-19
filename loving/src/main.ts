import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { pluginContainer } from './plugins/core/container'
import { coreCardsPlugin } from './plugins/cards/core-cards-plugin'
import { flightChessPlugin } from './plugins/games/flight-chess-plugin'
import { allThemes } from './plugins/themes/all-themes'
import './assets/styles/variables.css'
import './assets/styles/base.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Bootstrap plugin container (Execution Engine)
function bootstrapPlugins() {
  // Register card plugins
  pluginContainer.cards.register(coreCardsPlugin)

  // Register game plugins
  pluginContainer.games.register(flightChessPlugin)

  // Register theme plugins
  for (const theme of allThemes) {
    pluginContainer.themes.register(theme)
  }

  // Bootstrap - load saved theme and VIP status
  pluginContainer.bootstrap()
}

bootstrapPlugins()

app.mount('#app')