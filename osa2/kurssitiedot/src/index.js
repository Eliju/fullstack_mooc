import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
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
  console.log({course})
  return (
    <div>
       {course.parts.map(p => <Part key={p.id} p={p} />)}
    </div>
  )
 }
 
/* const Total = (props) => {
  return (
    <p>Number of exercises {props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises}</p>
  )
} */

const Course = ({course}) => {
  return (
    <>
      <Header course={course} />
      <Content course={course} />
   </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}
ReactDOM.render(
    <App />,
  document.getElementById('root')
);
