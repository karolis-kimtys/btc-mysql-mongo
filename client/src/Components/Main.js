import { useEffect, useState, useRef } from "react";
import "./Main.css";
import LiveChart from "./LiveChart/LiveChart";
import Charts from "./Charts/Charts";
// import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import moment from "moment";

function Main() {
  const [page, setPage] = useState("live");

  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const [selectedData, setSelectedData] = useState(null);

  const [prices, setPrices] = useState([]);
  const [times, setTimes] = useState([]);

  const chartRef = useRef(null);

  const options = {
    animation: false,
    scales: {
      x: {
        update: "none",
      },
    },
  };

  const data = {
    labels: times,
    datasets: [
      {
        label: `Bitcoin Historical Price Chart USD`,
        data: prices,
        fill: false,
        lineTension: 0.2,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "round",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  useEffect(() => {
    fetch("http://localhost:5001/getall/years")
      .then((response) => response.json())
      .then((json) => {
        setYears(json);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5001/getall/${selectedYear}/months`)
      .then((response) => response.json())
      .then((json) => {
        setMonths(json);
      });
  }, [selectedYear]);

  useEffect(() => {
    fetch(`http://localhost:5001/getall/${selectedYear}/${selectedMonth}/days`)
      .then((response) => response.json())
      .then((json) => {
        setDays(json);
      });
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetch(
      `http://localhost:5001/getall/${selectedYear}/${selectedMonth}/${selectedDay}/hours`
    )
      .then((response) => response.json())
      .then((json) => {
        setHours(json);
      });
  }, [selectedYear, selectedMonth, selectedDay]);

  const selectData = () => {
    fetch(
      `http://localhost:5001/getby/${selectedYear}${
        selectedMonth && "/" + selectedMonth
      }${selectedDay && "/" + selectedDay}${selectedHour && "/" + selectedHour}`
    )
      .then((response) => response.json())
      .then((json) => {
        setSelectedData(json);

        let price = [];
        let time = [];

        Object.values(json).forEach((item) => {
          price.push(item.price);
          time.push(moment(item.date).format("h:mm:ss"));
        });

        setPrices(price);
        setTimes(time);
      });
  };

  const viewData = () => {
    const chart = chartRef.current;
    var a = document.createElement("a");
    a.href = chart.toBase64Image("image/jpeg", 1);
    a.download = `${selectedData[0].date}.png`;
    a.click();
  };

  return (
    <div className="Main">
      <form className="form">
        <div>
          <label>Live Data</label>
          <input
            type="radio"
            name="test"
            value="live"
            onChange={() => {
              setPage("live");
            }}
            checked={page === "live"}
          />
        </div>
        <div>
          <label>Historical Data</label>
          <input
            type="radio"
            name="test"
            value="historical"
            onChange={() => {
              setPage("historical");
            }}
          />
        </div>
        <div>
          <label>Hourly Charts</label>
          <input
            type="radio"
            name="test"
            value="charts"
            onChange={() => {
              setPage("charts");
            }}
          />
        </div>
      </form>

      {page === "live" && <LiveChart />}

      {page === "charts" && <Charts />}

      {page === "historical" && (
        <div className="historical">
          <div>
            <div className="historical_select">
              <div className="select_year">
                <label htmlFor="years">Year:</label>
                <select
                  name="years"
                  id="years"
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                  }}>
                  <option value={"-"}>-</option>
                  {Object.values(years).map((year, key) => {
                    return (
                      <option key={key} value={year.year}>
                        {year.year}
                      </option>
                    );
                  })}
                </select>
              </div>
              {selectedYear !== null && (
                <div className="select_month">
                  <label htmlFor="months">Month:</label>
                  <select
                    name="months"
                    id="months"
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                    }}>
                    <option value={"-"}>-</option>
                    {Object.values(months).map((month, key) => {
                      return (
                        <option key={key} value={month.month}>
                          {month.month}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              {selectedMonth !== null && (
                <div className="select_day">
                  <label htmlFor="days">Day:</label>
                  <select
                    name="days"
                    id="days"
                    onChange={(e) => {
                      setSelectedDay(e.target.value);
                    }}>
                    <option value={"-"}>-</option>
                    {Object.values(days).map((day, key) => {
                      return (
                        <option key={key} value={day.day}>
                          {day.day}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              {selectedDay !== null && (
                <div className="select_hour">
                  <label htmlFor="hours">Hour:</label>
                  <select
                    name="hours"
                    id="hours"
                    onChange={(e) => {
                      setSelectedHour(e.target.value);
                    }}>
                    <option value={"-"}>-</option>
                    {Object.values(hours).map((hour, key) => {
                      return (
                        <option key={key} value={hour.hour}>
                          {hour.hour}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            <div className="buttons">
              <button
                onClick={() => {
                  selectData();
                }}>
                Select data
              </button>
              <button
                onClick={() => {
                  viewData();
                }}>
                Download Chart
              </button>
            </div>
          </div>

          <div className="chart">
            <Line
              data={data}
              width={500}
              height={400}
              options={options}
              ref={chartRef}
            />
          </div>

          <div>
            <div className="table_container">
              {selectedData !== null && (
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Date</th>
                      <th>Price ($)</th>
                    </tr>
                    {Object.values(selectedData).map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>
                            {moment(item.date).format("YYYY-MM-DD h:mm:ss")}
                          </td>
                          <td>{item.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
