class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  search() {
    if (this.queryStr.keyword) {
      this.query = this.query.find({
        $text: { $search: this.queryStr.keyword },
      })
    }
    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }

    const removeFields = ['keyword', 'page', 'limit', 'sort']
    removeFields.forEach((key) => delete queryCopy[key])

    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  paginate(defaultLimit = 12) {
    const page = Number(this.queryStr.page) || 1
    const limit = Number(this.queryStr.limit) || defaultLimit
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

export default ApiFeatures