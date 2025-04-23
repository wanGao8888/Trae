import request from '../utils/request'

// 定义一个函数来获取问题记录
export const fetchIssuesFromDB = async (pageNum = 1, pageSize = 10) => {
  try {
    const response = await request.get('/api/issues/list', {
      params: {
        pageNum,
        pageSize,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw error
  }
}
