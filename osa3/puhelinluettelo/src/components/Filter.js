import React from 'react'
import PropTypes from 'prop-types'

const Filter = ({nf, flist}) => {
  return (
    <>
      Filter shown with <input value={nf} onChange={flist}/>
    </>
  )
}

Filter.propTypes = {
  nf: PropTypes.string,
  flist: PropTypes.func.isRequired
}

export default Filter