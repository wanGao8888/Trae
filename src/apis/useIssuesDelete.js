import request from '../utils/request'

// 定义一个函数来删除问题到数据库
export const deleteIssuesFromDB = async (id) => {
  try {
    const response = await request.delete(`/api/issues/delete/${id}`)
    return response
  } catch (error) {
    console.error('Error storing issues:', error)
    throw error
  }
}
