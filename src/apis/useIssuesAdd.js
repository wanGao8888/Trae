import request from '../utils/request'

// 定义一个函数来添加问题到数据库
export const addIssuesToDB = async (issues) => {
  try {
    const response = await request.post('/api/issues/add', issues)
    console.log(response)
    return response
  } catch (error) {
    console.error('Error storing issues:', error)
    throw error
  }
}
