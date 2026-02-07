import { useState } from 'react'

interface CounterProps {
    initialCount?: number
}

function Counter({ initialCount = 0 }: CounterProps) {

    const [count, setCount] = useState(initialCount)
    
  return (
    <>
    <div className="bg-green-500 text-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold">Counter Component</h2>
        <p className="mt-2">This is a simple counter component that demonstrates state management in React.</p> 
        <div className="mt-4">
            <button
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
                Decrease
            </button>
            <span className="text-2xl font-bold mx-4">{count}</span>
            <button
                onClick={() => setCount(count + 1)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
                Increase
            </button>
        </div>
    </div>
    </>
  )
}

export default Counter