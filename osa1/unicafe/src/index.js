import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Title = () => {
  return (
    <h1>give feedback</h1>
  )
}

const Button = ({handleClick, text}) => <button onClick={handleClick} > {text} </button>

const StatisticsHeader = () => (<h2>statistics</h2>)

const StatisticsLine = ({text}) => (<div>{text}</div>)

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
        <StatisticsLine text={`good ${good}`} />
        <StatisticsLine text={`neutral ${neutral}`} />
        <StatisticsLine text={`bad ${bad}`} />
        <StatisticsLine text={`all ${good + neutral + bad}`} />
        <StatisticsLine text={`average ${(good*1 + neutral*0 + bad*-1) / (good + neutral + bad)}`} />
        <StatisticsLine text={`positive ${100 * good / (good + neutral + bad)} %`} />
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


