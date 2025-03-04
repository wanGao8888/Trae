import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: {
            token: 'admin-token',
            username: username,
            role: 'admin'
          },
          message: '登录成功'
        }
      } else {
        return {
          code: 401,
          message: '用户名或密码错误'
        }
      }
    }
  }
] as MockMethod[]