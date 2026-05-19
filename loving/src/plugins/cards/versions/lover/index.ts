import type { CardVersion } from '@/plugins/core/types'

export const lover: CardVersion[] = [
  { id: 'lover0', name: '恋爱版', category: 'lover', locked: false, tasks: [] },
  { id: 'lover1', name: '热恋版', category: 'lover', locked: false, tasks: [] }
]

import { lover0 } from './lover0'
import { lover1 } from './lover1'

export { lover0, lover1 }