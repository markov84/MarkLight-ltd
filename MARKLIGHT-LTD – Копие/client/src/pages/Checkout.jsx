import React from "react";

export default function Checkout() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Плащане</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold mb-4">Плащане с карта</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Име на картодържателя</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Име и фамилия" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Номер на карта</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="1234 5678 9012 3456" required maxLength={19} />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Валидна до</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="MM/YY" required maxLength={5} />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-200 mb-1">CVV</label>
              <input type="password" className="w-full border rounded px-3 py-2" placeholder="CVV" required maxLength={4} />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-4">
            Плати
          </button>
        </form>
      </div>
    </div>
  );
}
