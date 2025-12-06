export default function Home() {
  return (
    <main className="container">
      <div className="content">
        <h1>Welcome to All Things Blog</h1>
        <p>This is a basic web page built with Next.js, React, and TypeScript.</p>
        <div className="features">
          <div className="feature-card">
            <h2>Next.js</h2>
            <p>React framework for production</p>
          </div>
          <div className="feature-card">
            <h2>React</h2>
            <p>JavaScript library for building user interfaces</p>
          </div>
          <div className="feature-card">
            <h2>TypeScript</h2>
            <p>Typed superset of JavaScript</p>
          </div>
        </div>
      </div>
    </main>
  )
}

