export default [{
  date: 'Wed, 5 Mar 2020',
  event: 'Created data property ',
  children: [
    {
      time: '2020-03-05 09:00:00',
      dataType: 'Property',
      event: 'Move',
      user: {
        name: 'Admin',
        email: 'admin@aliyun.com',
      },
      node: '属性0-0-1',
      origin: '属性0-0',
      target: '属性0-1',
      children: ['delete', 'add'],
      place: '公共属性',
    },
    {
      time: '2020-03-05 08:00:00',
      user: {
        name: '陈秋阳',
        email: 'autumnchenqy@aliyun.com',
      },
      node: '实体a',
      dataType: 'Individual',
      event: 'Create',
      children: ['add'],
      place: '公共实体',
    },
  ],
}, {
  date: 'Wed, 4 Mar 2020',
  event: 'Created data property ',
  children: [
    {
      time: '2020-03-04 09:00:00',
      dataType: 'Property',
      event: 'Move',
      user: {
        name: '陈秋阳',
        email: 'autumnchenqy@aliyun.com',
      },
      node: '属性0-0-1',
      origin: '属性0-0',
      target: '属性0-1',
      children: ['delete', 'add'],
      place: '任务1',
    },
    {
      time: '2020-03-04 07:00:00',
      user: {
        name: '陈秋阳',
        email: 'autumnchenqy@aliyun.com',
      },
      node: '实体b',
      dataType: 'Individual',
      event: 'Delete',
      children: ['delete'],
      place: '任务1',
    },
  ],
}]
