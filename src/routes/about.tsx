import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">About This Project</h2>
      <p className="text-gray-400">
        This project was automatically scaffolded with a modern React stack.
      </p>
    </div>
  )
}
