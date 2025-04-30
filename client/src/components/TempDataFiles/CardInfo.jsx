import React, { createContext, useContext, useState} from "react";

//Creates custom hook
const CardInfo = createContext();
export const useCard = () => useContext(CardInfo);

//Provides component
export const CardProvider = ({ children }) => {
    const [cards, setCards] = useState([
        {
          id: 1,
          type: 'Visa',
          balance: 3690.0,
          last4: '1890',
          validUntil: '5/26',
          cardName: 'Bank of America',
          cvv: '***',
          bgColor: 'bg-purple-600',
        },
        {
          id: 2,
          type: 'Visa',
          balance: 2000.0,
          last4: '3287',
          validUntil: '6/27',
          cardName: 'Chase Bank',
          cvv: '***',
          bgColor: 'bg-green-600',
        },
        {
          id: 3,
          type: 'MasterCard',
          balance: 4500.0,
          last4: '1122',
          validUntil: '7/28',
          cardName: 'TD Bank',
          cvv: '***',
          bgColor: 'bg-blue-600',
        },
        {
          id: 4,
          type: 'MasterCard',
          balance: 3200.0,
          last4: '3344',
          validUntil: '8/29',
          cardName: 'M&T Bank',
          cvv: '***',
          bgColor: 'bg-red-600',
        },
      ]);
    
      return (
        <CardInfo.Provider value={{ cards, setCards }}>
            {children}
        </CardInfo.Provider>
      )
}
