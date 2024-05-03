
import React, { useState, useEffect } from 'react';
import './App.css';


import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import CardPage from './components/CardPage';


function App() {
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [rating, setRating] = useState([]);

  const [updateRatings, setUpdateRatings] = useState([]);

  // these usestate us made for the filter the data in the card
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedRating, setSelectedRating] = useState('all');

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [minPrice, setMinPrice] = useState(12);
  const [maxPrice, setMaxPrice] = useState(1800);

  const [searchBrand, setSearchBrand] = useState('');

  //this will show the card when we click..
  const [showCart, setShowCart] = useState(false);

  //this usestate save the card items in the card section
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {

        setProducts(data.products);
        setUpdateRatings(data.products)

        console.log("the products are :", data.products);

        const uniqueCategories = [];
        data.products.forEach(product => {
          if (!uniqueCategories.includes(product.category)) {
            uniqueCategories.push(product.category);
          }
        });
        setCategories(uniqueCategories);

        const uniqueBrands = [];
        data.products.forEach(product => {
          if (!uniqueBrands.includes(product.brand)) {
            uniqueBrands.push(product.brand);
          }
        });
        setBrands(uniqueBrands);

        const Ratings = [];
        data.products.forEach(product => {
          if (!Ratings.includes(product.rating)) {
            Ratings.push(product.rating);
          }
        });
        setRating(Ratings);

      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);


  const addToCart = (product) => {

    // console.log("the product is :",product);

    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity++;
      setCartItems(cartItems);
    } else {
      // console.log("dhfjksdafkj", product);    
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const decreaseQuantity = (productId) => {

    // console.log("the productID is :",productId);
    const updatedCartItems = cartItems.map(item => {
      if (item.id === productId && item.quantity > 1) {
        item.quantity--;
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const increaseQuantity = (productId) => {
    // console.log("the productID is :",productId);
    const updatedCartItems = cartItems.map(item => {
      if (item.id === productId && item.quantity !== products[productId - 1].stock) {
        item.quantity++;
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };


  const toggleCart = () => {
    setShowCart(!showCart);
  };


  // this function is made for the filter the data in the checkbox
  const handleCategoryFilter = (category) => {
    // it check the if the category is already selected 
    const isSelected = selectedCategory.includes(category);
    // console.log("the isSelected category is : " , isSelected)
    if (isSelected) {
      const updatedCategories = selectedCategory.filter(cat => cat !== category);
      setSelectedCategory(updatedCategories);
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  };


  const handleBrandFilter = (brand) => {
    const isSelected = selectedBrand.includes(brand);

    if (isSelected) {
      const updatedBrands = selectedBrand.filter(brand => brand !== brand);
      setSelectedBrand(updatedBrands);
    }
    else {
      setSelectedBrand([...selectedBrand, brand]);
    }
  }




  // Price range filter handlers
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleBrandSearch = (e) => {
    setSearchBrand(e.target.value);
  };

  // Apply filters on sidebar options
  const filteredProducts = products.filter(product =>
    (selectedCategory.length === 0 || selectedCategory.includes(product.category)) &&
    (selectedBrand.length === 0 || selectedBrand.includes(product.brand)) &&
    (product.price >= minPrice && product.price <= maxPrice)
  );

  // Rating filter handler
  const handleRating = (selectedRating) => {
    if (selectedRating <= 3) {
      const filteredProducts = products.filter(product => product.rating <= selectedRating);
      setProducts(filteredProducts);
    } else {
      // if select the rating is above then 3 then show all the products 
      setProducts(updateRatings);
    }
  };


  return (
    <>


      <header className=''>

        <div className='header'>
        <h1><span><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWqF4hEa9v3_S_P1b-jQqPMhXts3rn3ZYK1oXfizCIcg&s" alt="" /></span>       
        </h1>    

          <ul>
            <li className='homepage'>Homepage</li>
          </ul>
    
        <div>       
          {cartItems.length > 0 && (
            <button className='cart-button' onClick={toggleCart}>
              <svg class="icon icon-cart" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className='svg-icon'>
                <path fill="currentColor" fill-rule="evenodd" d="M20.5 6.5a4.75 4.75 0 00-4.75 4.75v.56h-3.16l-.77 11.6a5 5 0 004.99 5.34h7.38a5 5 0 004.99-5.33l-.77-11.6h-3.16v-.57A4.75 4.75 0 0020.5 6.5zm3.75 5.31v-.56a3.75 3.75 0 10-7.5 0v.56h7.5zm-7.5 1h7.5v.56a3.75 3.75 0 11-7.5 0v-.56zm-1 0v.56a4.75 4.75 0 109.5 0v-.56h2.22l.71 10.67a4 4 0 01-3.99 4.27h-7.38a4 4 0 01-4-4.27l.72-10.67h2.22z"></path>
              </svg>
              <span className='cart-count'>{cartItems.length}</span>
            </button>
          )}
          {!showCart && cartItems.length === 0 && (
            <button className='cart-button' onClick={toggleCart}>
              <svg class="icon icon-cart" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className='svg-icon'>
                <path fill="currentColor" fill-rule="evenodd" d="M20.5 6.5a4.75 4.75 0 00-4.75 4.75v.56h-3.16l-.77 11.6a5 5 0 004.99 5.34h7.38a5 5 0 004.99-5.33l-.77-11.6h-3.16v-.57A4.75 4.75 0 0020.5 6.5zm3.75 5.31v-.56a3.75 3.75 0 10-7.5 0v.56h7.5zm-7.5 1h7.5v.56a3.75 3.75 0 11-7.5 0v-.56zm-1 0v.56a4.75 4.75 0 109.5 0v-.56h2.22l.71 10.67a4 4 0 01-3.99 4.27h-7.38a4 4 0 01-4-4.27l.72-10.67h2.22z"></path>
              </svg>
            </button>
          )}
        </div>

        </div>

        

      </header>


      {showCart ? (
        <div className="">
          <h2 style={{ textAlign: "center" }}>Cart Details</h2>
          <div className='cart-section'>
            {cartItems.map((item) => (
              <div className='cart-items'>
                <img src={item.images[0]} alt={item.brand} />

                <div className='card-details'>
                  <div className='name-price'>

                    <h3>{item.brand}</h3>
                    <p>{item.category}</p>
                    <p>₹{item.price * item.quantity}</p>
                  </div>

                  <div className='remove-button' onClick={() => removeFromCart(item.id)}>
                    <button className='delete-btn'>Delete</button>
                  </div>

                </div>

                <div className='add-to-cart-button'>
                  <button onClick={() => decreaseQuantity(item.id)} disabled={item.quantity === 1}>-</button>
                  <button>Qty {item.quantity}</button>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </div>
            ))}

          </div>
          <p className='total-price'>Total Price of all the products is : ₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
          <p className='total-price'> The length of the products is : {cartItems.length}</p>
        </div>
      ) : (
        <div className='section'>

          <div className='sidebar'>

            <h3 className='filter'>Filter</h3>
            <hr className='filter-hr'></hr>

            <div className='category'>
              <h2 onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>Categories<i className="fa-solid fa-caret-down"></i></h2>
              {showCategoryDropdown && (
                <div className='category-dropdown'>
                  {categories.map(category => (
                    <label key={category}><br></br>
                      <input
                        type="checkbox"
                        checked={selectedCategory.includes(category)}
                        onChange={() => handleCategoryFilter(category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              )}
            </div>



            <div className='brand'>
              <h2 onClick={() => setShowBrandDropdown(!showBrandDropdown)}>Brands<i class="fa-solid fa-caret-down"></i></h2>

              {showBrandDropdown && (
                <div className='brand-dropdown'>
                  <input type="text" placeholder="Search Brands" value={searchBrand} onChange={handleBrandSearch} />
                  {brands.filter(brand => brand.toLowerCase().includes(searchBrand.toLowerCase())).map(brand => (
                    <label key={brand}><br></br>
                      <input
                        type="checkbox"
                        checked={selectedBrand.includes(brand)}
                        // checked={selectedBrand === brand}
                        onChange={() => handleBrandFilter(brand)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className='price'>
              <h2>Price Range</h2>
              <input type="range" id="price-range" min="12" max="1800" value={maxPrice} onChange={handleMaxPriceChange} className="price-range" />
              <div className='price-level'>

                <div className='min-price'>
                  <label htmlFor="min-price">Min. Price:</label>
                  <input type="number" id="min-price" value={minPrice} onChange={handleMinPriceChange} />
                </div>

                <div className='max-price'>
                  <label htmlFor="max-price">Max. Price:</label>
                  <input type="number" id="max-price" value={maxPrice} onChange={handleMaxPriceChange} />
                </div>
              </div>
            </div>

            <div className='rating'>
              <h2 className='rating-options'>Rating</h2>
              <div className='rating-dropdown'>

                <p onClick={() => handleRating(4)}><input type='checkbox' /> 4 ★ and above</p>
                <p onClick={() => handleRating(3)}><input type='checkbox' /> 3 ★ and above</p>
                <p onClick={() => handleRating(2)}><input type='checkbox' /> 2 ★ and above</p>
                <p onClick={() => handleRating(1)}><input type='checkbox' /> 1 ★ and above</p>
              </div>
            </div>

          </div>

          <div className='main'>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div className='card' key={product.id}>
                  <img src={product.images[0]} />
                  <p className='product-description'>{product.description}</p>
                  <h2>{product.title}</h2>
                  <button className='product-rating'>{product.rating.toFixed(1)}<i className="fa-regular fa-star"></i></button>
                  <p className='product-price'>₹{product.price}</p>
                  <button className='add-to-cart' onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No products found for the selected filters.</p>
            )}
          </div>

        </div>
      )}

    </>
  );
}

export default App;






