import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ForexApiContext = createContext();

export const ForexApiProvider = ({ children }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getForexPairsDescription = async () => {
          try {
            const apiKey = process.env.REACT_APP_API_KEY;
            if (!apiKey) {
              throw new Error("API key nao foi definida.");
            }
            //pega as moedas do banco de dados, que é atualizado diariamente pelo job.
            const response = await axios.get(
              `http://localhost:3000/api/currencies`,
              {
              headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem("token") || ''
              }
              }
            );
            
            console.log("ForexApiContext response:", response);
            setData(response.data);
          } catch (err) {
            console.log(err)
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



