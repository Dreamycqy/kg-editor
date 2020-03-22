export default [
  {
    path: '/',
    redirect: '/kgEditor/board',
  },
  {
    path: '/kgEditor',
    redirect: '/kgEditor/board',
  },
  {
    path: '/kgEditor/login',
    component: './login',
  },
  {
    path: '/kgEditor',
    component: '../layouts',
    routes: [
      {
        path: './board',
        component: './taskBoard',
      },
      {
        path: './editor',
        component: './editor',
      },
      {
        path: './members',
        component: './members',
      },
      {
        path: './projectManager',
        component: './projectManager',
      },
      {
        path: './taskManager',
        component: './taskManager',
      },
      {
        path: './history',
        component: './history',
      },
      {
        path: './publicProps',
        component: './publicResource/properties',
      },
      {
        path: 'publicIndis',
        component: './publicResource/individuals',
      },
    ],
  },
]
