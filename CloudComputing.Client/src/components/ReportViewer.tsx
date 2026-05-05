import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { useEffect, useState } from 'react';

function ReportViewer() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    
    setLoading(true);
    fetch("/api/v1/reports/ex1")
      .then(res => res.text())
      .then(setContent)
    .catch(ex => console.log(ex))
    .finally(() => setLoading(false))
  }, [])

  return (
    <div className="report-viewer">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default ReportViewer;