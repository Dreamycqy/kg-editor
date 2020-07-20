export default [
  {
    path: '/',
    redirect: '/home',
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
        path: './home',
        component: './home',
      },
      {
        path: './searchPage',
        component: './home/searchPage',
      },
      {
        path: './board',
        component: './taskBoard',
      },
      {
        path: './editor',
        component: './editor',
      },
      {
        path: './explorer',
        component: './explorer',
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
