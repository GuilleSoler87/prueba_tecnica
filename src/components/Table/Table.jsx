import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../../context/ProductContext/ProductState';
import './Table.scss';

const Table = () => {
    const { products, getProducts } = useContext(ProductContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortDirection, setSortDirection] = useState({
        title: 'none',
        price: 'none',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const productsPerPage = 10;

    useEffect(() => {
        getProducts().then(() => setIsLoading(false));
    }, [getProducts]);

    useEffect(() => {
        const filterProducts = () => {
            let filtered = [...products];

            if (selectedCategory !== 'all') {
                filtered = filtered.filter((product) => product.category === selectedCategory);
            }

            filtered.sort((a, b) => {
                if (sortDirection.title !== 'none') {
                    const titleA = a.title.toLowerCase();
                    const titleB = b.title.toLowerCase();
                    if (titleA < titleB) {
                        return sortDirection.title === 'asc' ? -1 : 1;
                    }
                    if (titleA > titleB) {
                        return sortDirection.title === 'asc' ? 1 : -1;
                    }
                }

                if (sortDirection.price !== 'none') {
                    return sortDirection.price === 'asc' ? a.price - b.price : b.price - a.price;
                }

                return 0;
            });

            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const paginatedProducts = filtered.slice(startIndex, endIndex);
            setFilteredProducts(paginatedProducts);

            setTotalPages(Math.ceil(filtered.length / productsPerPage));
        };

        filterProducts();
    }, [selectedCategory, sortDirection, products, currentPage]);

    useEffect(() => {
        const categoryList = [...new Set(products.map((product) => product.category))];
        setCategories(categoryList);
    }, [products]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setCurrentPage(1);
    };

    const handleSort = (columnName) => {
        setSortDirection((prevSortDirection) => {
            const newSortDirection = { ...prevSortDirection };
            if (columnName === 'title') {
                newSortDirection.title = prevSortDirection.title === 'asc' ? 'desc' : 'asc';
                newSortDirection.price = 'none';
            } else if (columnName === 'price') {
                newSortDirection.price = prevSortDirection.price === 'asc' ? 'desc' : 'asc';
                newSortDirection.title = 'none';
            }
            return newSortDirection;
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return null;
    }

    return (
        <div className="table-container">
            <div className="category-filter">
                <label htmlFor="category">Category: </label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="all">All</option>
                    {categories.map
                        ((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                </select>
            </div>

            {filteredProducts.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                Product{' '}
                                <button
                                    className={`sort-button ${sortDirection.title !== 'none' ? 'active' : ''}`}
                                    onClick={() => handleSort('title')}
                                >
                                    {sortDirection.title === 'asc' ? '↑' : '↓'}
                                </button>
                            </th>
                            <th>Category</th>
                            <th>
                                Price{' '}
                                <button
                                    className={`sort-button ${sortDirection.price !== 'none' ? 'active' : ''}`}
                                    onClick={() => handleSort('price')}
                                >
                                    {sortDirection.price === 'asc' ? '↑' : '↓'}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.title}</td>
                                <td>{product.category}</td>
                                <td>{product.price} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        className={`page-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Table;
