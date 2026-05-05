import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

function ReportViewer() {
  const markdownContent = `
  # Lab Report

  ## Introduction
  This experiment aimed to...

  ## Results
  | Sample | Value |
  |--------|-------|
  | A      | 1.23  |
  | B      | 4.56  |

  ## Conclusion
  The results show that...
  `

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}

export default ReportViewer;