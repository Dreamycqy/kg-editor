export default {
  任务1: {
    name: '任务1',
    desc: '这是任务1',
    members: [
      { name: '陈秋阳', email: 'autumnchenqy@aliyun.com' },
      { name: '张三', email: 'user3@aliyun.com' },
      { name: '李四', email: 'user4@aliyun.com' },
    ],
    endTime: '2020-03-25 10:00:00',
    createTime: '2020-02-25 10:00:00',
    status: 'success',
    process: {
      classes: 100,
      properties: 100,
      individuals: 100,
    },
    originNode: 'History',
    history: [{
      date: 'Wed, 5 Mar 2020',
      event: 'Created data property ',
      children: [
        {
          time: '2020-03-28 09:00:00',
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
          time: '2020-04-05 08:00:00',
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
          time: '2020-04-04 09:00:00',
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
          time: '2020-04-04 07:00:00',
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
    }],
  },
  任务2: {
    name: '任务2',
    desc: '这是任务2这是任务2这是任务2这是任务2这是任务2这是任务2这是任务2这是任务2这是任务2',
    members: [
      { name: '陈秋阳', email: 'autumnchenqy@aliyun.com' },
      { name: '张三', email: 'user3@aliyun.com' },
      { name: '李四', email: 'user4@aliyun.com' },
    ],
    endTime: '2020-03-25 10:00:00',
    createTime: '2020-02-25 10:00:00',
    status: 'going',
    originNode: 'Medical',
    process: {
      classes: 100,
      properties: 50,
      individuals: 50,
    },
    history: [{
      date: 'Wed, 5 Mar 2020',
      event: 'Created data property ',
      children: [
        {
          time: '2020-04-05 09:00:00',
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
          time: '2020-04-05 08:00:00',
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
          time: '2020-04-04 09:00:00',
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
          time: '2020-04-04 07:00:00',
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
    }],
  },
  任务3: {
    name: '任务3',
    desc: '这是任务3',
    members: [{ name: '陈秋阳', email: 'autumnchenqy@aliyun.com' },
      { name: '王五', email: 'user5@aliyun.com' },
      { name: '赵六', email: 'user6@aliyun.com' },
    ],
    endTime: '2020-03-29 10:00:00',
    createTime: '2020-02-25 10:00:00',
    status: 'going',
    originNode: 'Math',
    process: {
      classes: 10,
      properties: 0,
      individuals: 0,
    },
    history: [],
  },
  任务4: {
    name: '任务4',
    desc: '这是任务4',
    members: [{ name: '陈秋阳', email: 'autumnchenqy@aliyun.com' },
      { name: '王五', email: 'user5@aliyun.com' },
      { name: '赵六', email: 'user6@aliyun.com' },
    ],
    endTime: '2020-04-12 10:00:00',
    createTime: '2020-02-25 10:00:00',
    status: 'going',
    originNode: 'Sport',
    process: {
      classes: 10,
      properties: 0,
      individuals: 0,
    },
    history: [],
  },
  任务5: {
    name: '任务5',
    desc: '这是任务5，多加一句说明',
    members: [{ name: '陈秋阳', email: 'autumnchenqy@aliyun.com' },
      { name: '张三', email: 'user3@aliyun.com' },
      { name: '赵六', email: 'user6@aliyun.com' },
    ],
    endTime: '2020-04-18 10:00:00',
    createTime: '2020-02-25 10:00:00',
    status: 'going',
    originNode: 'Physical',
    process: {
      classes: 10,
      properties: 0,
      individuals: 0,
    },
    history: [],
  },
}
