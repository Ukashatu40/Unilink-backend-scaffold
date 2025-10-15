function TrafficCard({ data }) {
    if (!data) return null;
  
    return (
      <div className="bg-white p-5 rounded-xl shadow-md w-full max-w-md mt-5">
        <h2 className="text-xl font-semibold mb-2">Traffic in {data.city}</h2>
        <p>Status: {data.status}</p>
        <p>Expected Delay: {data.expected_delay_min} minutes</p>
        <p>Notes: {data.notes}</p>
      </div>
    );
  }
  
  export default TrafficCard;
  