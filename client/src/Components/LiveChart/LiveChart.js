import { useState, useEffect, useMemo, useRef } from "react";
import "./LiveChart.css";
import Ably from "ably/promises";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import moment from "moment";

const ably = new Ably.Realtime(
  "k_jQfg.O2UFyg:uXvxnGuqg4cvshEJQJKRh1SPNsg7rCQFcLG_sfIFyqg"
);

new Chart();

export default function LiveChart() {
  const [current, setCurrent] = useState([]);
  const [price, setPrice] = useState([]);
  const [time, setTime] = useState([]);

  const chartRef = useRef(null);

  let times = useMemo(() => [...time], [time]);
  let prices = useMemo(() => [...price], [price]);

  const channel = ably.channels.get(
    "[product:ably-coindesk/bitcoin]bitcoin:usd"
  );

  useEffect(() => {
    async function subscribe() {
      await channel.subscribe((message) => {
        prices.length >= 300 && prices.shift();

        prices.push(message.data);
        setPrice(prices);

        times.length >= 275 && times.shift();

        times.push(moment(message.timestamp).format("YYYY-MM-DD h:mm:ss"));
        setTime(times);

        setCurrent(message.data);
      });
    }

    subscribe();

    return function cleanup() {
      channel.unsubscribe();
    };
  }, [channel, prices, times]);

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
        label: `Bitcoin Real Time Price - ${current} USD`,
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

  const viewData = () => {
    const chart = chartRef.current;
    var a = document.createElement("a");
    a.href = chart.toBase64Image("image/jpeg", 1);
    a.download = `${moment().format("YYYY-MM-DD h:mm:ss:ms")}.png`;
    a.click();
  };

  return (
    <div className="chart">
      <h4>Bitcoin Real Time Data USD</h4>

      <div className="box">
        <Line
          data={data}
          width={500}
          height={400}
          options={options}
          ref={chartRef}
        />
        <button
          onClick={() => {
            viewData();
          }}>
          Download current chart
        </button>
      </div>
    </div>
  );
}
