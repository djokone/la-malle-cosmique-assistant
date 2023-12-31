import BaseAdminLayout from '../templates/baseAdminLayout.vue'
import LeftBar from '../components/VerticalMenu.vue'
import SimpleLayout from '../templates/SimpleLayout.vue'
import Settings from '../pages/settings.vue'
import Dashboard from '../pages/dashboard.vue'
import Sources from '../pages/Sources.vue'
import SourceEdition from '../pages/SourceEdition.vue'
import Workflows from "../pages/Workflows.vue";
import WorkflowEdition from "../pages/WorkflowEdition.vue";

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
            name: 'settings',
            component: Settings
          },
          {
            name: 'dashboard',
            path: 'dashboard',
            component: Dashboard
          },
          {
            name: 'sources',
            path: 'sources',
            component: Sources
          },
          {
            name: 'source-edition',
            path: 'source-edition/:id?',
            component: SourceEdition
          },
          {
            name: 'workflows',
            path: 'workflows',
            component: Workflows
          },
          {
            name: 'workflow-edition',
            path: 'workflow-edition/:id?',
            component: WorkflowEdition
          }
        ]
      }
    ]
  }
]
