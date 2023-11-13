import BaseAdminLayout from '../templates/baseAdminLayout.vue'
import LeftBar from '../components/VerticalMenu.vue'
import SimpleLayout from '../templates/SimpleLayout.vue'
import Settings from '../pages/settings.vue'
import Dashboard from '../pages/dashboard.vue'

export default [
  {
    path: '',
    component: BaseAdminLayout,
    children: [
      {
        path: '',
        components: {
          LeftBar,
          default: SimpleLayout
        },
        children: [
          {
            path: '',
            component: Settings
          },
          {
            name: 'dashboard',
            path: 'dashboard',
            component: Dashboard
          }
        ]
      }
    ]
  }
]
