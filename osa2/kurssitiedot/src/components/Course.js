import React from 'react'

const Header = (props) => {
    return (
      <h2>{props.course.name}</h2>
    )
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.p.name} {props.p.exercises}
      </p>
    )
  }
  
  const Content = ({course}) => {
    return (
      <div>
         {course.parts.map(p => <Part key={p.id} p={p} />)}
      </div>
    )
   }
  
  // reduce-function is already in use
  const Total = ({course}) => {
    return (
      <b>total of {course.parts.reduce((sum, item) => sum += item.exercises, 0 )} exercises</b>
    )
  }
  
  const Course = ({course}) => {
    return (
      <>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
     </>
    )
  }
  

  export default Course;