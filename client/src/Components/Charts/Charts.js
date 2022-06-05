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
  };

  return (
    <div className="chart_container">
      {loading ? (
        <div>
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
          <button
            onClick={() => {
              refetch();
            }}>
            Refresh
          </button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
