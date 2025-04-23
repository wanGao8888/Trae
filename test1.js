const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const app = express()
const port = 3001

app.use(express.json()) // 支持 JSON 格式的请求体

// 增加请求体大小限制
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
// MongoDB 连接 URI
const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)

async function connectDB() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB', error)
  }
}

connectDB()

// 新增接口：存储问题记录到数据库
app.post('/api/issues/add', async (req, res) => {
  try {
    const database = client.db('admin')
    const collection = database.collection('test1')

    console.log('接收到的数据:', JSON.stringify(req.body, null, 2))

    const issues = Array.isArray(req.body) ? req.data : [req.body]
    const result = await collection.insertMany(issues)

    res.status(200).json({
      code: 200,
      message: 'Issues stored successfully',
    })
  } catch (error) {
    console.error('Error storing issues:', error)
    res.status(500).json({
      body: {
        success: false,
        message: 'Error storing issues',
        error: error.message,
      },
    })
  }
})
// 编辑接口：根据 ID 更新问题记录
app.put('/api/issues/update/:id', async (req, res) => {
  try {
    const database = client.db('admin')
    const collection = database.collection('test1')

    const { id } = req.params
    const updateData = req.body

    // 确保updateData不为空
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: '更新数据不能为空',
      })
    }

    // 移除 _id 字段，因为 MongoDB 不允许更新 _id
    if (updateData._id) {
      delete updateData._id
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: '未找到要更新的记录',
      })
    }

    res.json({
      success: true,
      code: 200,
      message: '更新成功',
    })
  } catch (error) {
    console.error('更新记录失败:', error)
    res.status(500).json({
      success: false,
      code: 500,
      message: '更新失败',
      error: error.message,
    })
  }
})
// 删除接口：根据 ID 删除问题记录
app.delete('/api/issues/delete/:id', async (req, res) => {
  try {
    const database = client.db('admin')
    const collection = database.collection('test1')

    const { id } = req.params
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: '未找到要删除的记录',
      })
    }

    res.json({
      success: true,
      code: 200,
      message: '删除成功',
    })
  } catch (error) {
    console.error('删除记录失败:', error)
    res.status(500).json({
      success: false,
      code: 500,
      message: '删除失败',
      error: error.message,
    })
  }
})
// 列表接口：获取所有问题记录
app.get('/api/issues/list', async (req, res) => {
  try {
    const database = client.db('admin')
    const collection = database.collection('test1')
    const issues = await collection.find({}).toArray()
    res.json({
      success: true,
      code: 200,
      data: issues,
    })
  } catch (error) {
    res.status(500).json({
      body: {
        success: false,
        message: 'Error retrieving issues',
        error: error.message,
      },
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

// 设置路由
app.get('/', (req, res) => {
  res.send('Hello World!')
})
