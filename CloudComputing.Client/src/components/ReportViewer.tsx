import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { useEffect, useState } from 'react';

function ReportViewer() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/reports/ex1");
        const data = await res.text();
        setContent(data);
      } catch (ex) {
        console.log(ex);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [])

  return (
    (!loading) ? 
      <div className="report-viewer">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </div>
      :
      <div>Loading</div>
  )
}

export default ReportViewer;