import Counter from "./counter"

function HelloWorld() {
  return (
    <>
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Hello, World!</h1>
            <p className="mt-2">Welcome to my React application with Tailwind CSS.</p>
            <Counter initialCount={10} />
        </div>
    </>
  )
}

export default HelloWorld