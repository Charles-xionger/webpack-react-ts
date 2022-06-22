import React , { useState } from 'react'

export default function CountDemo () {
  const [count, setCount] = useState(0)
  const increase = () => {
    setCount(
      () => count + 1
    )
  }
  return (
     <div>
     count:  {count}
     <button onClick={increase} >加一</button>
     </div>
  )
}