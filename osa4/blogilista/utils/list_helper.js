const { sum } = require('lodash')
const collection = require('lodash/collection')

const dummy = (blogs) => {
  if (blogs) {
    return 1
  } else {
    return 1
  }
}

const totalLikes = (blogs) => {
  let likes = 0

  if (blogs !== null) {
    const reducer = (s,i) => s + i.likes
    likes = blogs.reduce(reducer, 0)
  }

  return likes
}

const favoriteBlog = (blogs) => {
  let ret = {}

  if ((blogs !== null) && (blogs.length > 0)) {
    if (blogs.lengh === 1){
      ret = blogs[0]
    } else {
      const maxLikes = Math.max(blogs.map(b => b.likes))

      ret = blogs.find(b => b.likes === maxLikes)
    }
  }

  return ret
}

const sums = (coll) => {
  return collection.reduce(
    coll,
    (result, value, key) => {
      const tmp = collection.reduce(value, (s, i) => s + i, 0)
      result[key] = tmp
      return result
    },{})
}

const mostBlogs = (blogs) => {
  let ret = {}

  if ((blogs !== null) && (blogs.length > 0)) {
    const auths = blogs.map(b => { return { 'author': b.author, 'blogs': 1 } })
    if (auths.length === 1) {
      ret = { 'author': auths[0].author, 'blogs': auths[0].blogs }
    } else {
      const noOfBlogs = collection.reduce(
        auths,
        (res,key) => {
          (res[key.author] || (res[key.author] = [])).push(key.blogs)
          return res
        },
        {})
      const sumsOfBlogs = sums(noOfBlogs)
      const stdNames = collection.map(
        sumsOfBlogs,
        (value,key) => {
          return ({ 'author': key, 'blogs': value })
        })
      const sorted = collection.orderBy(stdNames,['blogs', 'author'], ['desc','asc'])
      return sorted[0]
    }
  }

  return ret
}

const mostLikes = (blogs) => {
  let ret = {}

  if ((blogs !== null) && (blogs.length > 0)) {
    const auths = blogs.map(b => { return { 'author': b.author, 'likes': b.likes } })
    if (auths.length === 1) {
      ret = { 'author': auths[0].author, 'likes': auths[0].likes }
    } else {
      const noOfLikes = collection.reduce(
        auths,
        (res,key) => {
          (res[key.author] || (res[key.author] = [])).push(key.likes)
          return res
        },
        {})
      const sumsOfLikes = sums(noOfLikes)
      const stdNames = collection.map(
        sumsOfLikes,
        (value,key) => {
          return ({ 'author': key, 'likes': value })
        })
      const sorted = collection.orderBy(stdNames,['likes', 'author'], ['desc','asc'])
      return sorted[0]
    }
  }

  return ret
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}