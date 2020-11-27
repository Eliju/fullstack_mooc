import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Title = () => {
  return (
    <h1>give feedback</h1>
  )
}

const Button = ({handleClick, text}) => <button onClick={handleClick} > {text} </button>

const StatisticsHeader = () => (<h2>statistics</h2>)

const StatisticsLine = ({text, value, end}) => (<tr><td>{text}</td><td>{value}</td><td>{end}</td></tr>)

const Statistics = ({good, neutral, bad}) => {
    if ((good===0) &&(neutral === 0) && (bad === 0)) {
      return (
        <div>
          <StatisticsHeader />
          No feedback given
        </div>
        )
    }

    return (
      <>
        <StatisticsHeader />
        <table>
        <tbody>
        <StatisticsLine text='good' value={good} end='' />
        <StatisticsLine text='neutral' value={neutral} end='' />
        <StatisticsLine text='bad' value={bad} end='' />
        <StatisticsLine text='all' value={good + neutral + bad} end='' />
        <StatisticsLine text='average' value={(good*1 + neutral*0 + bad*-1) / (good + neutral + bad)} end='' />
        <StatisticsLine text='positive' value={100 * good / (good + neutral + bad)} end='%' />
        </tbody>
        </table>
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


