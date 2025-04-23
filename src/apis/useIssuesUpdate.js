import request from '../utils/request'

// 定义一个函数来更新问题到数据库
export const updateIssuesToDB = async (id, updateData) => {
  try {
    const response = await request.put(`/api/issues/update/${id}`, updateData)
    return response
  } catch (error) {
    console.error('Error updating issues:', error)
    throw error
  }
}
