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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}