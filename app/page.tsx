export default function Home() {
  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-link">All Things Distributed</a>
        <a href="/now-go-build.html" className="nav-link">Now Go Build!</a>
        <a href="/articles.html" className="nav-link">Articles</a>
        <a href="/about.html" className="nav-link">@werner</a>
        <a href="/atom.xml" className="nav-link rss-link">☰</a>
      </nav>
      
      <main className="main">
        <div className="hero">
          <h1 className="site-title">All Things Distributed</h1>
          <p className="site-subtitle">Werner Vogels on building scalable and robust distributed systems</p>
        </div>

        <section className="featured-section">
          <h2>Featured:</h2>
          <div className="featured-items">
            <a href="/2024/11/aws-lambda-turns-10-a-rare-look-at-the-doc-that-started-it.html" className="featured-item">
              <h4>The PR/FAQ that launched Lambda</h4>
            </a>
            <a href="https://www.thefrugalarchitect.com/" className="featured-item" target="_blank" rel="noopener noreferrer">
              <h4>Stories from Frugal Architects</h4>
            </a>
            <a href="/now-go-build.html" className="featured-item">
              <h4>Watch Now Go Build Episodes</h4>
            </a>
          </div>
        </section>

        <section className="articles-section">
          <h2>Recent Articles:</h2>
          <ul className="articles-list">
            <li>
              <a href="/2025/11/tech-predictions-for-2026-and-beyond.html">Tech predictions for 2026 and beyond</a>
              <span className="separator"> --- </span>
              <time>2025-11-25</time>
            </li>
            <li>
              <a href="/2025/10/what-is-ussd-and-who-cares.html">What is USSD (and who cares)?</a>
              <span className="separator"> --- </span>
              <time>2025-10-29</time>
            </li>
            <li>
              <a href="/2025/10/better-with-age.html">Development gets better with Age</a>
              <span className="separator"> --- </span>
              <time>2025-10-01</time>
            </li>
            <li>
              <a href="/2025/08/removing-friction-from-sage-maker-development.html">Removing friction from Amazon SageMaker AI development</a>
              <span className="separator"> --- </span>
              <time>2025-08-06</time>
            </li>
            <li>
              <a href="/2025/07/building-with-purpose-stories-from-the-now-go-build-cto-fellows.html">Building with purpose: Stories from the Now Go Build CTO Fellows</a>
              <span className="separator"> --- </span>
              <time>2025-07-07</time>
            </li>
            <li>
              <a href="/2025/06/the-next-batch-of-cto-fellows-are-reimagining-healthcare.html">The next batch of CTO Fellows are reimagining healthcare</a>
              <span className="separator"> --- </span>
              <time>2025-06-26</time>
            </li>
            <li>
              <a href="/2025/05/just-make-it-scale-an-aurora-dsql-story.html">Just make it scale: An Aurora DSQL story</a>
              <span className="separator"> --- </span>
              <time>2025-05-27</time>
            </li>
            <li>
              <a href="/2025/04/alexa-plus-gets-us-a-step-closer-to-ambient-interfaces.html">Alexa+ gets us a step closer to ambient interfaces</a>
              <span className="separator"> --- </span>
              <time>2025-04-09</time>
            </li>
            <li>
              <a href="/2025/03/in-s3-simplicity-is-table-stakes.html">In S3 simplicity is table stakes</a>
              <span className="separator"> --- </span>
              <time>2025-03-14</time>
            </li>
            <li>
              <a href="/2025/02/thinking-like-a-fox-a-reading-list-for-the-future.html">Thinking like a fox: A reading list for the future</a>
              <span className="separator"> --- </span>
              <time>2025-02-06</time>
            </li>
            <li>
              <a href="/2024/12/tech-predictions-for-2025-and-beyond.html">Tech predictions for 2025 and beyond</a>
              <span className="separator"> --- </span>
              <time>2024-12-05</time>
            </li>
            <li>
              <a href="/2024/11/return-of-the-frugal-architect.html">Return of The Frugal Architect(s)</a>
              <span className="separator"> --- </span>
              <time>2024-11-25</time>
            </li>
            <li>
              <a href="/2024/11/introducing-the-now-go-build-cto-fellows.html">Introducing the inaugural Now Go Build CTO Fellows</a>
              <span className="separator"> --- </span>
              <time>2024-11-21</time>
            </li>
            <li>
              <a href="/2024/11/aws-lambda-turns-10-a-rare-look-at-the-doc-that-started-it.html">AWS Lambda turns 10: A rare look at the doc that started it</a>
              <span className="separator"> --- </span>
              <time>2024-11-14</time>
            </li>
            <li>
              <a href="/2024/08/empowering-builders-with-new-aws-asia-pacific-malaysia-region.html">Empowering builders with the new AWS Asia Pacific (Malaysia) Region</a>
              <span className="separator"> --- </span>
              <time>2024-08-29</time>
            </li>
            <li>
              <a href="/2024/08/continuous-reinvention-a-brief-history-of-block-storage-at-aws.html">Continuous reinvention: A brief history of block storage at AWS</a>
              <span className="separator"> --- </span>
              <time>2024-08-22</time>
            </li>
            <li>
              <a href="/2024/06/introducing-distill-cli.html">Introducing Distill CLI: An efficient, Rust-powered tool for media summarization</a>
              <span className="separator"> --- </span>
              <time>2024-06-18</time>
            </li>
            <li>
              <a href="/2024/05/hacking-our-way-to-better-team-meetings.html">Hacking our way to better team meetings</a>
              <span className="separator"> --- </span>
              <time>2024-05-08</time>
            </li>
            <li>
              <a href="/2024/03/district-heating-using-data-centers-to-heat-communities.html">District heating: Using data centers to heat communities</a>
              <span className="separator"> --- </span>
              <time>2024-03-13</time>
            </li>
            <li>
              <a href="/2024/02/reading-list-since-reinvent.html">What I've been reading since re:Invent</a>
              <span className="separator"> --- </span>
              <time>2024-02-13</time>
            </li>
          </ul>
        </section>

        <footer className="footer">
          <p>© 2025 All Things Distributed</p>
          <div className="social-links">
            <a href="https://twitter.com/werner" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
            <a href="https://www.youtube.com/playlist?list=PLhr1KZpdzukdIpgzSSCkNsnRAwDz6Xx5B" target="_blank" rel="noopener noreferrer" aria-label="YouTube">📺</a>
            <a href="https://instagram.com/djwerner" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
            <a href="/atom.xml" aria-label="RSS Feed">☰</a>
          </div>
        </footer>
      </main>
    </>
  )
}

