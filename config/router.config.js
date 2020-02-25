export default [
  {
    path: '/',
    component: '../layouts',
    routes: [
      {
        path: '/',
        component: './taskManager',
      },
      {
        path: 'editor',
        component: './editor',
      },
    ],
  },
]
