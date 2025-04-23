import request from '../utils/request'

// 定义一个函数来获取问题记录
export const fetchIssuesFromDB = async () => {
  try {
    const response = await request.get('/api/issues/list')
    console.log('Issues:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw error
  }
}
