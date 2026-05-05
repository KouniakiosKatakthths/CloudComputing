import Navbar from "../components/Navbar";
import ReportViewer from "../components/ReportViewer";

function Exercise1() {
  return (
    <>
      <Navbar></Navbar>
      
      <div className="content">
        <div className="container">
          <h2>Εργασία 1</h2>
          <p>Σε αυτή την εργαστηριακή άσκηση ζητάται η ανάλυση σεναρίων πάνω στο παράδειγμα <span style={{"fontWeight": "bold"}}>CloudSimExample6</span> με το Cloudsim και τελικά η δημιουργεία και εκτέλεση σεναρίων στο cloudsim.</p>
        </div>
      
        <ReportViewer filename="Ask1.md"></ReportViewer>
      </div>
    </>
  )
}

export default Exercise1;