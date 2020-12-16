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

module.exports = {
  dummy,
  totalLikes
}