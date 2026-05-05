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
    <div className="report-viewer">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}

export default ReportViewer;