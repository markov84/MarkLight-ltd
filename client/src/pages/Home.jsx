 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "../components/Helmet";
import Category from "../../../server/models/Category";


export default function Home() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Иновативен дизайн",
      description: "Модерни и елегантни решения за осветление"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Енергийна ефективност",
      description: "LED технология за максимална икономия"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Гарантирано качество",
      description: "Премиум материали и дълголетие"
    }
  ];

  // Модерни снимки за слайдшоу
  const bgImages = [
    "https://www.eglo.com/media/wysiwyg/dining_room_mobile_7.jpg",
    "https://koala.sh/api/image/v2-hg47m-ne4af.jpg?width=1216&height=832&dream",
    "https://art-rasvjeta.hr/images/news/008370_ins001_rain_pl3jpg_GQ4G10.jpg",
    "https://media.adeo.com/mkp/c7bd3a4aa10518ce2db373961294c383/media.jpeg?width=3000&height=3000&format=jpg&quality=80&fit=bounds",
    "https://www.eglo.com/media/wysiwyg/modern-web_32.jpg"
  ];
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>MARK LIGHT LTD</title>
        <meta name="description" content="Луксозно осветление за дома и бизнеса. Модерни и елегантни решения за осветление, LED технологии, премиум качество и иновации." />
      </Helmet>
  <div className="space-y-24">
      {/* Hero Section with Beautiful Images */}
  <section className="relative py-24 overflow-hidden">
        {/* Оригинален тъмен background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"></div>

        {/* Hero Main Image */}
        <div className="absolute inset-0 opacity-30 transition-all duration-1000">
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-1000"
            style={{
              backgroundImage: `url('${bgImages[bgIndex]}')`,
              transition: 'background-image 1s ease-in-out'
            }}
          ></div>
        </div>

  {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-2 mb-6">
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-blue-200 font-medium">Луксозно осветление от 2008</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              MARK LIGHT LTD
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            Превърнете всяко пространство в произведение на изкуството с нашите 
            <span className="text-white font-semibold"> изключителни осветителни решения</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/catalog"
              className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 inline-flex items-center space-x-2"
            >
              <span>Разгледай каталога</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="group border-2 border-white/30 backdrop-blur-sm text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-white/50 inline-flex items-center space-x-2"
            >
              <span>Научи повече</span>
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200">Доволни клиенти</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-blue-200">Години опит</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-200">Проекта</div>
            </div>
          </div>
        </div>
      </section>

  {/* Recommended Products Section */}
  <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900 dark:text-white tracking-tight drop-shadow-lg">
            Препоръчани продукти
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-200 max-w-2xl mx-auto font-medium">
            Нашите експерти препоръчват тези продукти за вашия дом и офис
          </p>
        </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            {
              image: "https://www.eglo.com/media/wysiwyg/modern-web_32.jpg",
              title: "Модерен полилей",
              category: "Полилеи"
            },
            {
              image: "https://elbulgaria.com/data/kimo_images/kimo_product_images_unit_111218/small_3034bk-7-elbulgaria.webp?f=36764",
              title: "Таванна лампа",
              category: "Таванни лампи"
            },
            {
              image: "https://art-rasvjeta.hr/images/news/008370_ins001_rain_pl3jpg_GQ4G10.jpg",
              title: "LED Плафони",
              category: "LED Плафони"
            },
            {
              image: "https://maistorplus.com/media/cache/image_original_700/image/0001/15/fd041ae26a12c812c28fdc555a76f0c8c08b66b6.jpeg",
              title: "Соларна градинска лампа",
              category: "Градинско осветление"
            },
          ].map((product, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-blue-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
            >
              <div
                className="h-64 bg-cover bg-center transition-transform duration-700 hover:scale-110 cursor-pointer"
                style={{ backgroundImage: `url('${product.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
                  <h3 className="font-bold text-xl mb-1">{product.title}</h3>
                  <p className="text-base text-blue-200 font-medium">{product.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-110"
          >
            <span>Виж всички продукти</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Featured Products Gallery */}
  <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900 dark:text-white text-center tracking-tight drop-shadow-lg">
          Избрани продукти
        </h2>
        <p className="text-xl text-blue-700 dark:text-blue-200 max-w-2xl mx-auto mb-10 text-center font-medium">
          Открийте нашите най-популярни и иновативни осветителни решения
        </p>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            {
              image: "https://artboxdesign.eu/wp-content/uploads/2025/04/6-Photoroom-33-300x300.jpg",
              title: "Кристална лампа",
              category: "Луксозни "
            },
            {
              image: "https://www.aleti.eu/web/images/upload/919/slamp_liza_aleti_moderno_italiansko_osvetlenie_1.jpg",
              title: "Модерна лампа",
              category: "Настолни лампи"
            },
            {
              image: "https://smarthomesys.eu/wp-content/uploads/2020/12/%D0%9E%D1%81%D0%B2%D0%B5%D1%82%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BB%D0%B8%D0%BB%D0%B0%D0%B2%D0%BE.jpg",
              title: "LED осветление",
              category: "Умно осветление"
            },
            {
              image: "https://s9.badu.bg/photos/1036799/790x1203_66eb465ce79ba.jpg",
              title: "Дизайнерска лампа",
              category: "Стенни лампи"
            },
            {
              image:"https://maistorplus.com/media/cache/image_original_700/image/0001/15/fd041ae26a12c812c28fdc555a76f0c8c08b66b6.jpeg",
              title:"Соларно Осветление",
              Category:"Соларно Осветление"

            },
            
            {
              image: "data:image/jpeg;base64,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",
              title: "Schneider Asfora",
              category: "Ключове и контакти"
            },
          ].map((product, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-blue-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
            >
              <div 
                className="h-64 bg-cover bg-center transition-transform duration-700 hover:scale-110 cursor-pointer"
                style={{ backgroundImage: `url('${product.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
                  <h3 className="font-bold text-xl mb-1">{product.title}</h3>
                  <p className="text-base text-blue-200 font-medium">{product.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-110"
          >
            <span>Виж всички продукти</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}