import React from 'react';

const PrivacyPolicy = () => (
  <div className="container mx-auto p-6 max-w-3xl">
    <h1 className="text-2xl font-bold mb-4">Политика за защита на личните данни</h1>
    <p className="mb-4">Настоящата политика описва как онлайн магазин MarkLight събира, използва и защитава Вашите лични данни при посещение и поръчка от нашия сайт.</p>
    <h2 className="text-xl font-semibold mt-6 mb-2">1. Какви данни събираме?</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Име, адрес, телефон и имейл за доставка и контакт</li>
      <li>Данни за поръчки, плащания и история на покупки</li>
      <li>IP адрес, информация за браузър и устройство</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">2. Как използваме Вашите данни?</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>За обработка и изпълнение на поръчки</li>
      <li>За комуникация относно поръчки, доставки и промоции</li>
      <li>За подобряване на услугите и персонализиране на предложения</li>
      <li>За изпълнение на законови задължения</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">3. С кого споделяме данните?</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>С куриерски фирми и партньори за доставка</li>
      <li>С платежни оператори (например Stripe, PayPal)</li>
      <li>С държавни органи при законово изискване</li>
      <li>Никога не продаваме Вашите данни на трети лица</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">4. Вашите права</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Право на достъп, корекция и изтриване на данни</li>
      <li>Право на възражение срещу обработка</li>
      <li>Право на преносимост на данните</li>
      <li>Право да оттеглите съгласие по всяко време</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">5. Сигурност</h2>
    <p className="mb-4">Използваме съвременни технически и организационни мерки за защита на Вашите данни.</p>
    <h2 className="text-xl font-semibold mt-6 mb-2">6. Контакти</h2>
    <p>За въпроси относно личните данни, пишете на <a href="mailto:marklaitood@gmail.com" className="text-blue-600 underline">marklaitood@gmail.com</a> или използвайте формата за контакт в сайта.</p>
    <p className="mt-8 text-sm text-gray-500">Последна актуализация: 14.09.2025</p>
  </div>
);

export default PrivacyPolicy;
