import React from 'react';

const TransactionsTable = ({ transactions, getAccountDetails }) => {
  return (
    <div className="transactions-list mt-8">
      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#1b1d33] table-auto rounded-lg shadow-sm">
            <thead className="bg-[#3a3f66] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Merchant</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Account</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b hover:bg-[#555a7c] text-white">
                  <td className="py-3 px-4">{transaction.merchant_name || transaction.name || 'Unknown'}</td>
                  <td className="py-3 px-4">{transaction.personal_finance_category.primary || 'Unknown'}</td>
                  <td className={`py-3 px-4 ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4">{getAccountDetails(transaction.account_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600">No transactions to display.</div>
      )}
    </div>
  );
};

export default TransactionsTable;