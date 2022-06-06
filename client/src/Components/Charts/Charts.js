import { useState, useEffect } from "react";
import "./Charts.css";

export default function Charts() {
  const [charts, serCharts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    fetch("http://localhost:5001/allcharts")
      .then((response) => response.json())
      .then((json) => {
        serCharts(json);
        setLoading(true);
      });
  }, []);

  const refetch = () => {
    setLoading(false);
    fetch("http://localhost:5001/allcharts")
      .then((response) => response.json())
      .then((json) => {
        serCharts(json);
        setLoading(true);
      });
  };

  const openInNewTab = (url) => {
    let image = new Image();
    image.src = url;

    var w = window.open("");
    w.document.write(image.outerHTML);
    w.document.title = "Bitcoin Chart";
  };

  return (
    <div>
      {loading && (
        <button
          className="button"
          onClick={() => {
            refetch();
          }}>
          Refresh
        </button>
      )}
      {loading ? (
        <div className="chart_container">
          {Object.values(charts).map((item, key) => {
            return (
              <div
                key={key}
                onClick={() => {
                  openInNewTab(item.image.data);
                }}>
                <img src={item.image.data} alt="" className="charts" />
              </div>
            );
          })}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
