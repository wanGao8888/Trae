const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const app = express()
const port = 3001

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// 数据库连接配置
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)
let database, collection

// 统一的数据库连接函数
async function connectDB() {
  try {
    await client.connect()
    database = client.db('admin')
    collection = database.collection('test1')
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB', error)
    process.exit(1)
  }
}

// 统一的响应处理函数
const sendResponse = (res, status, data = null, error = null) => {
  if (error) {
    return res.status(status).json({
      success: false,
      code: status,
      message: error.message || '操作失败',
      error: error.toString()
    })
  }
  
  res.status(status).json({
    success: true,
    code: status,
    message: data.message || '操作成功',
    data: data.data
  })
}

// 统一的错误处理中间件
const errorHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    console.error('操作失败:', error)
    sendResponse(res, 500, null, error)
  }
}

// 初始化数据库连接
connectDB()

// 新增接口
app.post('/api/issues/add', errorHandler(async (req, res) => {
  const issues = Array.isArray(req.body) ? req.body : [req.body]
  await collection.insertMany(issues)
  sendResponse(res, 200, { message: '添加成功' })
}))

// 编辑接口
app.put('/api/issues/update/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  if (!updateData || Object.keys(updateData).length === 0) {
    return sendResponse(res, 400, null, new Error('更新数据不能为空'))
  }

  delete updateData._id

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  )

  if (result.matchedCount === 0) {
    return sendResponse(res, 404, null, new Error('未找到要更新的记录'))
  }

  sendResponse(res, 200, { message: '更新成功' })
}))

// 删除接口
app.delete('/api/issues/delete/:id', errorHandler(async (req, res) => {
  const { id } = req.params
  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    return sendResponse(res, 404, null, new Error('未找到要删除的记录'))
  }

  sendResponse(res, 200, { message: '删除成功' })
}))

// 列表接口
app.get('/api/issues/list', errorHandler(async (req, res) => {
  const pageNum = parseInt(req.query.pageNum) || 1
  const pageSize = parseInt(req.query.pageSize) || 10
  const searchText = req.query.searchText || ''
  
  const skip = (pageNum - 1) * pageSize
  
  // 构建搜索条件
  const searchQuery = searchText ? {
    $or: [
      { title: { $regex: searchText, $options: 'i' } },
      { desc: { $regex: searchText, $options: 'i' } },
      { solution: { $regex: searchText, $options: 'i' } }
    ]
  } : {}
  
  const total = await collection.countDocuments(searchQuery)
  const issues = await collection.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray()
    
  sendResponse(res, 200, { 
    data: {
      list: issues,
      total,
      pageNum,
      pageSize
    }
  })
}))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

// 设置路由
app.get('/', (req, res) => {
  res.send('Hello World!')
})
