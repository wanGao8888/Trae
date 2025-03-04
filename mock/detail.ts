import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const Random = Mock.Random

export default [
  {
    url: '/api/detail/list',
    method: 'get',
    response: () => {
      const data = Mock.mock({
        'list|10': [
          {
            'id|+1': 1,
            name: '@ctitle(4, 8)',
            'status|1': ['正常', '异常'],
            date: '@date',
          },
        ],
      })

      return {
        code: 200,
        data: data.list,
        message: '获取成功',
      }
    },
  },
] as MockMethod[]
