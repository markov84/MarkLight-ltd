import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PriceDisplay from "../components/PriceDisplay";
import { Helmet } from "../components/Helmet";

export default function ModalProductDetails({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const modalRef = useRef(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError("");
    axios.get(`${API}/products/${productId}`)
      .then(res => {
        setProduct(res.data);
        const imgs = [
          ...(res.data.image ? [res.data.image] : []),
          ...(Array.isArray(res.data.images) ? res.data.images.filter(img => img && img !== res.data.image) : [])
        ];
        setMainImage(imgs[0] || null);
      })
      .catch(() => setError("Грешка при зареждането на продукта"))
      .finally(() => setLoading(false));
  }, [productId]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  if (!productId) return null;

  const allImages = [
    ...(product?.image ? [product.image] : []),
    ...(Array.isArray(product?.images) ? product.images.filter(img => img && img !== product.image) : [])
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={modalRef}
        className="max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 mt-10 relative overflow-auto"
        style={{ maxHeight: '90vh', wordBreak: 'break-word' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-bold">&times;</button>
        {loading ? (
          <div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : !product ? (
          <div className="text-center py-16 text-gray-500">Продуктът не е намерен</div>
        ) : (
          <>
            <Helmet>
              <title>{product.name} | MARK LIGHT LTD</title>
              <meta name="description" content={product.description} />
            </Helmet>
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-shrink-0 w-full md:w-1/2 flex flex-col items-center justify-center">
                {mainImage && (
                  <img
                    src={mainImage && mainImage.startsWith('/uploads') ? `${API}${mainImage}` : mainImage}
                    alt={product.name}
                    className="w-full max-w-lg h-96 object-contain rounded-lg bg-gray-100 dark:bg-gray-700 mb-4 cursor-pointer transition-transform duration-300 hover:scale-125"
                    onError={e => e.target.src = "/api/placeholder/300/300"}
                  />
                )}
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-2 justify-center">
                    {allImages.map((img, idx) => {
                      let src = img;
                      if (img && img.startsWith('/uploads')) {
                        src = `${API}${img}`;
                      }
                      return (
                        <img
                          key={idx}
                          src={src}
                          alt={product.name + ' thumb ' + (idx + 1)}
                          className={`w-20 h-20 object-contain rounded-lg border-2 ${mainImage === img ? 'border-blue-500' : 'border-gray-300'} bg-gray-100 dark:bg-gray-700 cursor-pointer transition-transform duration-300 hover:scale-125`}
                          onClick={() => setMainImage(img)}
                          onError={e => e.target.src = "/api/placeholder/100/100"}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white break-words">{product.name}</h1>
                <div className="mb-4">
                  <PriceDisplay price={product.price} priceEUR={product.priceEUR} />
                </div>
                <div className="mb-4 text-gray-700 dark:text-gray-200 break-words whitespace-pre-line overflow-x-auto max-w-full">
                  {product.description}
                </div>
                <div className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
                  Категория: {product.category?.name || "-"}
                </div>
                {product.subcategory && (
                  <div className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
                    Подкатегория: {product.subcategory.name}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
