import { useState, useCallback } from 'react';
import {
  PRODUCTS, getProductsByCategory, getFeaturedProducts,
} from '../utils/constants';
import { sortProducts, filterProducts } from '../utils/helpers';

export const useProducts = () => {
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('all');
  const [sort, setSort]             = useState('featured');
  const [priceRange, setPriceRange] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const toggleBrand = useCallback((brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSearch(''); setCategory('all'); setSort('featured');
    setPriceRange(null); setSelectedBrands([]);
  }, []);

  const filteredProducts = sortProducts(
    filterProducts(PRODUCTS, {
      category,
      priceRange,
      brands: selectedBrands,
      search,
    }),
    sort
  );

  return {
    allProducts: PRODUCTS,
    filteredProducts,
    featuredProducts: getFeaturedProducts(),
    search, setSearch,
    category, setCategory,
    sort, setSort,
    priceRange, setPriceRange,
    selectedBrands, toggleBrand,
    resetFilters,
    totalCount: filteredProducts.length,
  };
};

export default useProducts;
