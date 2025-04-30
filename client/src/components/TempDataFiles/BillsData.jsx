// Sample bills data
const getFutureDate = (daysAhead) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split('T')[0];
  };
  
  export const billsData = [
    {
        month: "May",
        bills: [
          { merchant: "Electric Company", account: "987654", amount: "150.00", date: getFutureDate(2) },
          { merchant: "Internet Provider", account: "123456", amount: "80.00", date: getFutureDate(4) },
          { merchant: "Spotify", account: "998877", amount: "10.00", date: getFutureDate(9) },
          { merchant: "Credit Card", account: "222222", amount: "300.00", date: getFutureDate(11) },
          { merchant: "Gym Membership", account: "789012", amount: "60.00", date: getFutureDate(14) },
          { merchant: "Health Insurance", account: "334455", amount: "120.00", date: getFutureDate(18) },
          { merchant: "Phone Bill", account: "456789", amount: "95.00", date: getFutureDate(22) },
          { merchant: "Netflix", account: "565656", amount: "15.99", date: getFutureDate(27) },
        ]
      },
      {
        month: "June",
        bills: [
          { merchant: "Rent", account: "112233", amount: "1200.00", date: getFutureDate(32) },
          { merchant: "Water Bill", account: "444444", amount: "45.00", date: getFutureDate(34) },
          { merchant: "Student Loan", account: "777777", amount: "500.00", date: getFutureDate(38) },
          { merchant: "Amazon Prime", account: "999999", amount: "14.99", date: getFutureDate(42) },
        ]
      },
      {
        month: "July",
        bills: [
          { merchant: "Car Insurance", account: "101010", amount: "200.00", date: getFutureDate(62) },
          { merchant: "Internet Provider", account: "123456", amount: "80.00", date: getFutureDate(65) },
          { merchant: "Spotify", account: "998877", amount: "10.00", date: getFutureDate(67) },
        ]
      },
      {
        month: "August",
        bills: [
          { merchant: "Electric Company", account: "987654", amount: "160.00", date: getFutureDate(95) },
          { merchant: "Netflix", account: "565656", amount: "15.99", date: getFutureDate(100) },
          { merchant: "Gym Membership", account: "789012", amount: "65.00", date: getFutureDate(104) },
        ]
      }
    ];
  