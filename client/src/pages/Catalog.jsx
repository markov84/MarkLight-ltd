import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import ModalProductDetails from "../components/ModalProductDetails";
import { useCart } from "../context/CartContext";
import { Helmet } from "../components/Helmet";

const API = import.meta.env.VITE_API_URL;


export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1); // Reset to first page on filter change
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, page]);

  useEffect(() => {
    // Update selections when URL params change
    setSelectedCategory(searchParams.get('category') || "");
    setSelectedSubcategory(searchParams.get('subcategory') || "");
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${API}/products`;
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      params.append('page', page);
      params.append('limit', 12);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await axios.get(url);
  setProducts(response.data.products || response.data);
  setTotalPages(response.data.totalPages || 1);
  setTotalProducts(response.data.total || (response.data.products ? response.data.products.length : 0));
    } catch (err) {
      setError("Грешка при зареждането на продуктите");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/products/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categorySlug) => {
    try {
      const response = await axios.get(`${API}/products/subcategories/${categorySlug}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleAddToCart = async (product) => {
    addToCart(product);
  };

  // Modal state for product details
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Filter and sort products (client-side search/sort/price)
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                           (!priceRange.max || product.price <= parseFloat(priceRange.max));
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Опитай отново
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
  <title>Каталог | MARK LIGHT LTD</title>
        <meta name="description" content="Каталог с луксозни осветителни тела – открийте нашата богата колекция от продукти." />
      </Helmet>
  <div className="space-y-8 w-full mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Каталог на продукти
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Открийте нашата колекция от луксозни осветителни тела
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("");
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Всички категории</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          {/* Subcategory Dropdown */}
          <select
            value={selectedSubcategory}
            onChange={e => setSelectedSubcategory(e.target.value)}
            disabled={!selectedCategory || subcategories.length === 0}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Всички подкатегории</option>
            {subcategories.map(sub => (
              <option key={sub._id} value={sub.slug}>{sub.name}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Търсене..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="name">Сортирай по име</option>
            <option value="price-low">Цена: ниска към висока</option>
            <option value="price-high">Цена: висока към ниска</option>
          </select>

          {/* Price Range */}
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Мин. цена"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Макс. цена"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setSortBy("name");
              setPriceRange({ min: "", max: "" });
              setSelectedCategory("");
              setSelectedSubcategory("");
            }}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Изчисти филтрите
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-gray-600 dark:text-gray-300">
        Показват се {filteredProducts.length} от {totalProducts} продукта
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {searchTerm || priceRange.min || priceRange.max ? 
              "Няма продукти, които отговарят на критериите" : 
              "Няма налични продукти"}
          </div>
          {(searchTerm || priceRange.min || priceRange.max) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setPriceRange({ min: "", max: "" });
              }}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Изчисти филтрите
            </button>
          )}
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onCardClick={() => setSelectedProductId(product._id)}
              disableLink={true}
            />
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50"
          >
            &larr;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
            <button
              key={pn}
              onClick={() => setPage(pn)}
              className={`px-3 py-2 rounded-lg ${pn === page ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:bg-blue-400 hover:text-white transition-colors`}
              disabled={pn === page}
            >
              {pn}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50"
          >
            &rarr;
          </button>
        </div>
        </>
      )}
      </div>
      {/* Modal for product details */}
      {selectedProductId && (
        <ModalProductDetails
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </>
  );
}
