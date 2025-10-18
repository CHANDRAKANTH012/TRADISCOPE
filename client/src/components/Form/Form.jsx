import React, { useEffect, useState } from "react";
import { optionsData } from "../../assets/assets";

const Form = () => {
  const [options, setOptions] = useState([]);
  const [data, setData] = useState({
    action: "",
    pair: "",
    news: false,
    events: false,
    insights: false,
    entryPrice: "",
    expectedPrice: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!data.action || !data.pair) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if at least one option is selected
    if (!data.news && !data.events && !data.insights) {
      alert("Please select at least one option (news, events, or insights)");
      return;
    }

    console.log("Form Data:", data);

    // Here you would typically send this data to your backend
    // Example: Send to API
    // sendToBackend(data);

    // Reset form after submission (optional)
    // setData({
    //   action: '',
    //   pair: '',
    //   news: false,
    //   events: false,
    //   insights: false,
    //   entryPrice: '',
    //   expectedPrice: ''
    // });
  };

  useEffect(() => {
    setOptions(optionsData);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h3>Enter details:</h3>

      {/* Action and Pair Selection */}
      <div>
        <input
          type="text"
          name="action"
          value={data.action}
          onChange={handleChange}
          placeholder="Buy / Sell ?"
          required
        />

        <select name="pair" value={data.pair} onChange={handleChange} required>
          <option value="">Select a trading pair</option>
          {options.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Checkbox Options */}
      <div>
        <input
          id="news"
          type="checkbox"
          name="news"
          checked={data.news}
          onChange={handleChange}
        />
        <label htmlFor="news">News</label>

        <input
          id="events"
          type="checkbox"
          name="events"
          checked={data.events}
          onChange={handleChange}
        />
        <label htmlFor="events">Events</label>

        <input
          id="insights"
          type="checkbox"
          name="insights"
          checked={data.insights}
          onChange={handleChange}
        />
        <label htmlFor="insights">Insights</label>
      </div>

      {/* Price Inputs */}
      <div>
        <input
          type="number"
          name="entryPrice"
          value={data.entryPrice}
          onChange={handleChange}
          placeholder="Entry price"
          step="0.01"
        />

        <input
          type="number"
          name="expectedPrice"
          value={data.expectedPrice}
          onChange={handleChange}
          placeholder="Expected price"
          step="0.01"
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
