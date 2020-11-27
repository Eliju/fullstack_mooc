import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Title = () => {
  return (
    <h1>give feedback</h1>
  )
}

const Button = ({handleClick, text}) => <button onClick={handleClick} > {text} </button>
const Statistics = ({good, neutral, bad}) => {
  return (
    <>
      <h2>statistics</h2>
      good {good}<br/>
      neutral {neutral}<br/>
      bad {bad}<br/>
      all {good + neutral + bad}<br/>
      average {(good*1 + neutral*0 + bad*-1) / (good + neutral + bad)}<br/>
      positive {good / (good + neutral + bad)} %
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

   return (
    <div>
      <Title />
      <Button handleClick={increaseGood} text='good' />
      <Button handleClick={increaseNeutral} text='neutral' />
      <Button handleClick={increaseBad} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))


