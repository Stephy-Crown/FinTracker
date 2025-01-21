// import React, { useState, useEffect } from "react";
// import {
//   PlusCircle,
//   MinusCircle,
//   Calendar,
//   Edit2,
//   Trash2,
//   Heart,
//   GitHub,
//   Twitter,
//   Mail,
//   ChevronDown,
//   ChevronUp,
//   RefreshCcw,
// } from "lucide-react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import axios from "axios";

// const MoneyMinder = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showTransactions, setShowTransactions] = useState(true);
//   const [notification, setNotification] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [currency, setCurrency] = useState("USD");
//   const [exchangeRates, setExchangeRates] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load saved data from localStorage on initial render
//   useEffect(() => {
//     const savedTransactions = localStorage.getItem("transactions");
//     if (savedTransactions) {
//       setTransactions(JSON.parse(savedTransactions));
//     }

//     const savedCurrency = localStorage.getItem("preferredCurrency");
//     if (savedCurrency) {
//       setCurrency(savedCurrency);
//     }

//     fetchExchangeRates();
//   }, []);

//   // Save to localStorage whenever transactions change
//   useEffect(() => {
//     localStorage.setItem("transactions", JSON.stringify(transactions));
//   }, [transactions]);

//   // Save preferred currency
//   useEffect(() => {
//     localStorage.setItem("preferredCurrency", currency);
//   }, [currency]);

//   const fetchExchangeRates = async () => {
//     try {
//       const response = await axios.get(
//         "https://api.exchangerate-api.com/v4/latest/USD"
//       );
//       setExchangeRates(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch exchange rates:", error);
//       setNotification("Failed to fetch exchange rates");
//       setIsLoading(false);
//     }
//   };

//   const convertAmount = (amount, from, to) => {
//     if (!exchangeRates || !exchangeRates.rates) return amount;

//     // Convert to USD first
//     const amountInUSD =
//       from === "USD" ? amount : amount / exchangeRates.rates[from];
//     // Convert from USD to target currency
//     return to === "USD" ? amountInUSD : amountInUSD * exchangeRates.rates[to];
//   };

//   const formatMoney = (amount, curr = currency) => {
//     const convertedAmount = convertAmount(amount, "USD", curr);

//     return new Intl.NumberFormat(curr === "USD" ? "en-US" : "en-NG", {
//       style: "currency",
//       currency: curr,
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(convertedAmount);
//   };

//   const calculateTotals = () => {
//     const income = transactions
//       .filter((t) => parseFloat(t.amount) > 0)
//       .reduce((sum, t) => sum + parseFloat(t.amount), 0);

//     const expenses = transactions
//       .filter((t) => parseFloat(t.amount) < 0)
//       .reduce((sum, t) => sum + parseFloat(t.amount), 0);

//     return {
//       income,
//       expenses,
//       balance: income + expenses,
//     };
//   };

//   const handleAddTransaction = () => {
//     if (!description || !amount) {
//       setNotification("Please fill in all fields");
//       setTimeout(() => setNotification(""), 3000);
//       return;
//     }

//     if (editingId) {
//       setTransactions(
//         transactions.map((t) =>
//           t.id === editingId
//             ? { ...t, description, amount: parseFloat(amount), date }
//             : t
//         )
//       );
//       setNotification("Transaction updated successfully!");
//       setEditingId(null);
//     } else {
//       const newTransaction = {
//         id: Date.now(),
//         description,
//         amount: parseFloat(amount),
//         date,
//         currency: currency,
//       };
//       setTransactions([...transactions, newTransaction]);
//       setNotification("Transaction added successfully!");
//     }

//     setDescription("");
//     setAmount("");
//     setTimeout(() => setNotification(""), 3000);
//   };

//   const editTransaction = (transaction) => {
//     setDescription(transaction.description);
//     setAmount(transaction.amount);
//     setDate(transaction.date);
//     setEditingId(transaction.id);
//   };

//   const deleteTransaction = (id) => {
//     setTransactions(transactions.filter((t) => t.id !== id));
//     setNotification("Transaction deleted");
//     setTimeout(() => setNotification(""), 3000);
//   };

//   const { income, expenses, balance } = calculateTotals();

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
//       <div className="max-w-4xl mx-auto p-4 space-y-6">
//         <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle className="text-4xl font-bold text-white">
//                 MoneyMinder
//               </CardTitle>
//               <div className="flex items-center space-x-4">
//                 <select
//                   value={currency}
//                   onChange={(e) => setCurrency(e.target.value)}
//                   className="bg-white text-gray-800 rounded-lg px-3 py-1 text-sm font-medium"
//                 >
//                   <option value="USD">$ USD</option>
//                   <option value="EUR">€ EUR</option>
//                   <option value="GBP">£ GBP</option>
//                   <option value="NGN">₦ NGN</option>
//                   <option value="CNY">¥ CNY</option>
//                 </select>
//                 <button
//                   onClick={fetchExchangeRates}
//                   className="text-white hover:text-gray-200 flex items-center space-x-1"
//                   disabled={isLoading}
//                 >
//                   <RefreshCcw
//                     size={16}
//                     className={isLoading ? "animate-spin" : ""}
//                   />
//                   <span className="text-sm">Update Rates</span>
//                 </button>
//               </div>
//             </div>
//             <p className="text-center text-white opacity-90">
//               Smart Financial Management
//             </p>
//           </CardHeader>
//         </Card>

//         {notification && (
//           <Alert className="animate-fade-in bg-white shadow-lg">
//             <AlertDescription>{notification}</AlertDescription>
//           </Alert>
//         )}

//         <div className="grid md:grid-cols-3 gap-4">
//           <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardHeader>
//               <CardTitle className="text-lg font-medium text-gray-600">
//                 Total Balance
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p
//                 className={`text-2xl font-bold ${
//                   balance >= 0 ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {formatMoney(balance)}
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardHeader>
//               <CardTitle className="text-lg font-medium text-gray-600">
//                 Total Income
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold text-green-500">
//                 {formatMoney(income)}
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardHeader>
//               <CardTitle className="text-lg font-medium text-gray-600">
//                 Total Expenses
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold text-red-500">
//                 {formatMoney(Math.abs(expenses))}
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="bg-white shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">
//               {editingId ? "Edit Transaction" : "Add New Transaction"}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Description"
//                 className="w-full p-3 border rounded-lg pl-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div className="relative">
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder={`Amount (+ Income, - Expense) in ${currency}`}
//                 className="w-full p-3 border rounded-lg pl-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div className="relative">
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full p-3 border rounded-lg pl-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <button
//               onClick={handleAddTransaction}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
//             >
//               {editingId ? "Update Transaction" : "Add Transaction"}
//             </button>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-lg">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-xl font-bold">
//               Transaction History
//             </CardTitle>
//             <button
//               onClick={() => setShowTransactions(!showTransactions)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               {showTransactions ? (
//                 <ChevronUp size={24} />
//               ) : (
//                 <ChevronDown size={24} />
//               )}
//             </button>
//           </CardHeader>
//           {showTransactions && (
//             <CardContent>
//               <div className="space-y-3">
//                 {transactions.length === 0 ? (
//                   <p className="text-center text-gray-500">
//                     No transactions yet
//                   </p>
//                 ) : (
//                   transactions.map((transaction) => (
//                     <div
//                       key={transaction.id}
//                       className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       <div className="flex items-center space-x-3">
//                         {transaction.amount > 0 ? (
//                           <PlusCircle className="text-green-500" size={24} />
//                         ) : (
//                           <MinusCircle className="text-red-500" size={24} />
//                         )}
//                         <div>
//                           <p className="font-medium">
//                             {transaction.description}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {transaction.date}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4">
//                         <span
//                           className={`font-bold ${
//                             transaction.amount > 0
//                               ? "text-green-500"
//                               : "text-red-500"
//                           }`}
//                         >
//                           {formatMoney(Math.abs(transaction.amount))}
//                         </span>
//                         <button
//                           onClick={() => editTransaction(transaction)}
//                           className="text-blue-500 hover:text-blue-700"
//                         >
//                           <Edit2 size={18} />
//                         </button>
//                         <button
//                           onClick={() => deleteTransaction(transaction.id)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           )}
//         </Card>

//         <footer className="py-8 text-center">
//           <div className="flex flex-col items-center space-y-4">
//             <p className="flex items-center text-gray-600">
//               Made with <Heart className="text-red-500 mx-1" size={16} /> by
//               Stephane Udemezue
//             </p>
//             <div className="flex space-x-4">
//               <a
//                 href="https://github.com/yourusername"
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <GitHub size={20} />
//               </a>
//               <a
//                 href="https://twitter.com/yourusername"
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <Twitter size={20} />
//               </a>
//               <a
//                 href="mailto:your.email@example.com"
//                 className="text-gray-600 hover:text-blue-600 transition-colors"
//               >
//                 <Mail size={20} />
//               </a>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default MoneyMinder;

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  MinusCircle,
  Calendar,
  Edit2,
  Trash2,
  Heart,
  GitHub,
  Twitter,
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

const MoneyMinder = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showTransactions, setShowTransactions] = useState(true);
  const [notification, setNotification] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    const savedCurrency = localStorage.getItem("preferredCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("preferredCurrency", currency);
  }, [currency]);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      setExchangeRates(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      setNotification("Failed to fetch exchange rates");
      setIsLoading(false);
    }
  };

  const convertAmount = (amount, from, to) => {
    if (!exchangeRates || !exchangeRates.rates) return amount;
    const amountInUSD =
      from === "USD" ? amount : amount / exchangeRates.rates[from];
    return to === "USD" ? amountInUSD : amountInUSD * exchangeRates.rates[to];
  };

  const formatMoney = (amount, curr = currency) => {
    const convertedAmount = convertAmount(amount, "USD", curr);

    return new Intl.NumberFormat(curr === "USD" ? "en-US" : "en-NG", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  };

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => parseFloat(t.amount) > 0)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = transactions
      .filter((t) => parseFloat(t.amount) < 0)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      income,
      expenses,
      balance: income + expenses,
    };
  };

  const handleAddTransaction = () => {
    if (!description || !amount) {
      setNotification("Please fill in all fields");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    if (editingId) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingId
            ? { ...t, description, amount: parseFloat(amount), date }
            : t
        )
      );
      setNotification("Transaction updated successfully!");
      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        date,
        currency: currency,
      };
      setTransactions([...transactions, newTransaction]);
      setNotification("Transaction added successfully!");
    }

    setDescription("");
    setAmount("");
    setTimeout(() => setNotification(""), 3000);
  };

  const editTransaction = (transaction) => {
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setDate(transaction.date);
    setEditingId(transaction.id);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    setNotification("Transaction deleted");
    setTimeout(() => setNotification(""), 3000);
  };

  const { income, expenses, balance } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card>...</Card>
        <Card>...</Card>
      </div>
    </div>
  );
};

export default MoneyMinder;

{
  /* Transaction History
        <Card className="bg-white shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-800">
                Transaction History
              </CardTitle>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showTransactions ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </CardHeader>
          {showTransactions && (
            <CardContent className="p-6">
              {transactions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No transactions found
                </p>
              ) : (
                <ul className="space-y-4">
                  {transactions.map((transaction) => (
                    <li
                      key={transaction.id}
                      className="flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center">
                        {transaction.amount >= 0 ? (
                          <PlusCircle
                            size={20}
                            className="inline mr-2 text-green-500"
                          />
                        ) : (
                          <MinusCircle
                            size={20}
                            className="inline mr-2 text-red-500"
                          />
                        )}
                        <p className="text-gray-800 font-medium">
                          {transaction.description}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-4">
                        <p
                          className={`font-bold ${
                            transaction.amount >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatMoney(transaction.amount)}
                        </p>
                        <button
                          onClick={() => editTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-700  transition-opacity"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700 transition-opacity"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          )}
        </Card> */
}

{
  /* Transaction History
        <Card className="bg-white shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-800">
                Transaction History
              </CardTitle>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showTransactions ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </CardHeader>
          {showTransactions && (
            <CardContent className="p-4 sm:p-6 max-h-96 overflow-auto">
              {transactions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No transactions found
                </p>
              ) : (
                <ul className="space-y-4">
                  {transactions.map((transaction) => (
                    <li
                      key={transaction.id}
                      className="flex flex-wrap justify-between items-center p-1 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        {transaction.amount >= 0 ? (
                          <PlusCircle size={20} className="text-green-500" />
                        ) : (
                          <MinusCircle size={20} className="text-red-500" />
                        )}
                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                          {transaction.description}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 w-full sm:w-auto text-right sm:text-left">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <p
                          className={`font-bold text-sm sm:text-base ${
                            transaction.amount >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatMoney(transaction.amount)}
                        </p>
                        <button
                          onClick={() => editTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-700 transition-opacity"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700 transition-opacity"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          )}
        </Card> */
}
