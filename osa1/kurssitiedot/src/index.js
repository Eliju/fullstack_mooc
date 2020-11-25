import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.p.name} {props.p.exercises}
    </p>
  )
}

const Content = (props) => {
  return (
    <>
      <Part p={props.p1} />
      <Part p={props.p2} />
      <Part p={props.p3} />
    </>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.e1 + props.e2 + props.e3}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content p1={part1} p2={part2} p3={part3} />
      <Total e1={part1.exercises} e2={part2.exercises} e3={part3.exercises} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
