import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ForexApiContext = createContext();

export const ForexApiProvider = ({ children }) => {
    const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const getForexPairsDescription = async () => {
          try {
            // setLoading(true);
            const apiKey = process.env.REACT_APP_API_KEY;
            if (!apiKey) {
              throw new Error("API key nao foi definida.");
            }
            const response = await axios.get(
              `https://brapi.dev/api/v2/currency/available?token=${apiKey}`
            );
            setData(response.data.currencies);
          } catch (err) {
            // setError(err.message);
          } finally {
            // setLoading(false);
          }
        };
        getForexPairsDescription();
      }, []);
    return (
        <ForexApiContext.Provider value={data}>
            {children}
        </ForexApiContext.Provider>
    );
};