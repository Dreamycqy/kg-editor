export default [
  {
    title: '测试起点',
    key: '测试起点',
    source: '测试起点',
    target: [],
    relationships: [],
  },
  {
    title: '一级节点1',
    key: '1-node-1',
    source: '1-node-1',
    target: ['测试起点'],
    relationships: [],
  },
  {
    title: '一级节点2',
    key: '1-node-2',
    source: '1-node-2',
    target: ['测试起点'],
    relationships: [],
  },
  {
    title: '二级节点1',
    key: '2-node-1',
    source: '2-node-1',
    target: ['1-node-1'],
    relationships: [],
  },
  {
    title: '二级节点2',
    key: '2-node-2',
    source: '2-node-2',
    target: ['1-node-2'],
    relationships: [],
  },
  {
    title: '二级节点3',
    key: '2-node-3',
    source: '2-node-3',
    target: ['1-node-1', '1-node-2'],
    relationships: [],
  },
  {
    title: '三级节点1',
    key: '3-node-1',
    source: '3-node-1',
    target: ['2-node-3'],
    relationships: [],
  },
]
