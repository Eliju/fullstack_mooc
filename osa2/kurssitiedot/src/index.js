import React from 'react';
import ReactDOM from 'react-dom';

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

const CurriculumHeader = () => {
  return (
    <h1>Web development curriculum</h1>
  )
}

const Courses = ({courses}) => {
  return (
    <div>
      <CurriculumHeader />
      {courses.map(c => <Course key={c.id} course={c} />)}
    </div>
  )

}

const App = () => {
  const courses = [
    {
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
    ]

  return (
    <div>
      <Courses courses={courses} />
    </div>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
