import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'highlight.js/styles/github-dark.css';
import './ReportViewerStyle.css';
import { useEffect, useState } from 'react';
import ErrorDisplay, { type ApiError } from './ErrorDisplay';

interface Props {
  filename: string
}

function ReportViewer({ filename }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/reports/${filename}`);
        
        //Server responed with error
        if (!res.ok) {
          const err = await res.json();
          setError(err);
          return;
        }

        //Load .MD file
        const data = await res.text();
        setContent(data);
      } catch (ex) {
        console.log(ex);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [filename])

  if (error !== null)
    return (
    <div style={{ "marginTop": "15px" }}>
      <ErrorDisplay error={error}></ErrorDisplay>
    </div> 
  )

  return (
    (!loading) ? 
      <div className="report-viewer">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[
            rehypeKatex,
            [rehypeHighlight, { ignoreMissing: true }],
          ]}>
          {content}
        </ReactMarkdown>
      </div>
      :
      <div>Loading</div>
  )
}

export default ReportViewer;