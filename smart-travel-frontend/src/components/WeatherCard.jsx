function WeatherCard({ data }) {
    if (!data) return null;
  
    return (
      <div className="bg-white p-5 rounded-xl shadow-md w-full max-w-md mt-5">
        <h2 className="text-xl font-semibold mb-2">Weather in {data.city}</h2>
        <p>Temperature: {data.temp} °C</p>
        <p>Condition: {data.weather}</p>
        <p>Humidity: {data.humidity}%</p>
        <p>Wind Speed: {data.wind_m_s} m/s</p>
      </div>
    );
  }
  
  export default WeatherCard;
  