export default [
  {
    path: '/login',
    component: './login',
  },
  {
    path: '/',
    component: '../layouts',
    routes: [
      {
        path: '/',
        component: './taskBoard',
      },
      {
        path: 'editor',
        component: './editor',
      },
      {
        path: 'members',
        component: './members',
      },
      {
        path: 'manager',
        component: './taskManager',
      },
      {
        path: 'history',
        component: './history',
      },
      {
        path: 'publicProps',
        component: './publicResource/properties',
      },
      {
        path: 'publicIndis',
        component: './publicResource/individuals',
      },
    ],
  },
]
