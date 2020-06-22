export default [
  {
    path: '/',
    redirect: '/board',
  },
  {
    path: '/login',
    component: './login',
  },
  {
    path: '/',
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
