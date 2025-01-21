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
  TrendingUp,
  DollarSign,
  LineChart,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Footer from "../components/Footer";

const getLocalStorage = (key, defaultValue) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    try {
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return stored || defaultValue;
    }
  }
  return defaultValue;
};

const NairaSense = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showTransactions, setShowTransactions] = useState(true);
  const [notification, setNotification] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currency, setCurrency] = useState("NGN");
  const [conversionRate, setConversionRate] = useState(1600);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    setTransactions(getLocalStorage("transactions", []));
    setCurrency(getLocalStorage("currency", "NGN"));
    setConversionRate(getLocalStorage("conversionRate", 1600));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("currency", currency);
      localStorage.setItem("conversionRate", JSON.stringify(conversionRate));
      setConversionRate(conversionRate);
    }
  }, [transactions, currency, conversionRate]);

  const formatMoney = (amount, curr = currency) => {
    const rate = curr === "USD" ? conversionRate : 1;
    const convertedAmount = curr === "USD" ? amount / rate : amount;

    return new Intl.NumberFormat(curr === "USD" ? "en-US" : "en-NG", {
      style: "currency",
      currency: curr,
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

  // Rest of your functions remain the same
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

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-white">
      {/* Enhanced Header Section with Interactive Elements */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-700 py-12 px-4 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/400/320')] opacity-10 bg-center bg-cover"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 to-blue-700/90"></div>

        <div className="max-w-4xl mx-auto text-center space-y-3 relative z-10">
          {/* Greeting Section */}
          <p className="text-purple-200 text-lg animate-fade-in">
            {greeting}! 👋
          </p>

          {/* Enhanced Title with Emoji */}
          <div className="space-y-2">
            <h1 className="md:text-6xl text-4xl  font-bold font-mono tracking-tight text-white flex items-center justify-center gap-2">
              FinTracker
              <span className="animate-bounce text-5xl">📊</span>
            </h1>
            <p className="text-purple-200 md:text-lg text-md font-medium">
              Simplify Your Finances, Track Smartly and Succeed.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 transform hover:scale-105 transition-all">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-200" />
            <p className="text-sm text-gray-50">Today's Balance</p>
            <p className="text-xl font-bold">{formatMoney(totals.balance)}</p>
          </div>
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:gap-4 gap-4 my-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-300" />
              <p className="text-sm">Income</p>
              <p className="text-xl font-bold text-green-300">
                +{formatMoney(totals.income)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all">
              <LineChart className="w-6 h-6 mx-auto mb-2 text-red-300" />
              <p className="text-sm">Expenses</p>
              <p className="text-xl font-bold text-red-300">
                <span>-</span>
                {formatMoney(Math.abs(totals.expenses))}
              </p>
            </div>
          </div>

          {/* Enhanced Currency Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8 bg-white/10 backdrop-blur-sm py-4 px-6 rounded-xl  mx-auto">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white/90 text-gray-800 rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:bg-white transition-colors"
            >
              <option value="NGN">₦ NGN</option>
              <option value="USD">$ USD</option>
            </select>
            {isEditingRate ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  className="w-28 px-3 py-2 rounded-lg text-sm bg-white/90 shadow-sm"
                  placeholder="NGN to USD"
                />
                <button
                  onClick={() => setIsEditingRate(false)}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingRate(true)}
                className="text-white hover:text-purple-200 transition-colors flex items-center space-x-2"
              >
                <RefreshCcw size={16} />
                <span className="text-sm">1 USD = {conversionRate} NGN</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      <div className="max-w-4xl mx-auto space-y-6 my-4">
        {notification && (
          <Alert className="animate-fade-in bg-white shadow-xl border-l-4 border-purple-500">
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        )}

        {/* Transaction Form */}
        <Card className="bg-white shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-xl font-bold text-gray-800">
              {editingId ? "Edit Transaction" : "Add New Transaction"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Amount (+Income, -Expense) in ${currency}`}
              className="w-full p-3 border mt-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleAddTransaction}
              className="w-full bg-gradient-to-r mt-4 from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              {editingId ? "Update Transaction" : "Add Transaction"}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="max-w-4xl mx-auto space-y-6 my-4">
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
                      className="flex flex-wrap items-center justify-between gap-4 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Left Section */}
                      <div className="flex items-center flex-wrap space-x-2">
                        {transaction.amount >= 0 ? (
                          <PlusCircle size={20} className="text-green-500" />
                        ) : (
                          <MinusCircle size={20} className="text-red-500" />
                        )}
                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                          {transaction.description}
                        </p>
                      </div>

                      {/* Center Section */}
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>

                      {/* Right Section */}
                      <div className="flex items-center space-x-4">
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
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default NairaSense;
