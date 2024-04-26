import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Recommendations.css'; // Import custom CSS file for styling
import { useNavigate } from 'react-router-dom';

export const Recommendations = () => {
  const [previousOrders, setPreviousOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [recommendedSubCategoryProducts, setRecommendedSubCategoryProducts] = useState([]);
  const subCategorySliderRef = useRef(null);
  const navigate = useNavigate(); 
  const userString = sessionStorage.getItem("UToken");
  const parsedUser = JSON.parse(userString);
  const uid = parsedUser.id;

  useEffect(() => {
    fetch(`https://localhost:7199/api/Order/Get All Orders Based On User Id/${uid}`)
      .then(response => response.json())
      .then(data => {
        setPreviousOrders(data);
      })
      .catch(error => {
        console.error('Error fetching previous orders:', error);
      });

    fetch('https://localhost:7199/api/Product/GetAllProducts')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);  

//   useEffect(() => {
//     if (previousOrders.length > 0 && products.length > 0) {
//         // Get the top 3 most frequent subcategories
//         const top3SubCategories = getTopNMostFrequent(previousOrders.map(order => order.subCategory), 3);
//         // Get the top 3 most frequent colors
//         const top3Colors = getTopNMostFrequent(previousOrders.map(order => order.color), 3);

//         // Filter products based on the top 3 most frequent subcategories and colors
//         const filteredProducts = products.filter(product => {
//             return top3SubCategories.includes(product.subCategory) && top3Colors.includes(product.color);
//         });
//         setRecommendedSubCategoryProducts(filteredProducts);
//     }
// }, [previousOrders, products]);

// // Function to get the top N most frequent items from an array
// const getTopNMostFrequent = (arr, n) => {
//     const counts = {};
//     arr.forEach(item => { 
//         counts[item] = (counts[item] || 0) + 1;
//     });
//     return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, n);
// };


//   useEffect(() => {
//     if (previousOrders.length > 0 && products.length > 0) {
//         // Calculate the frequencies of subcategories
//         const subCategoryCounts = {};

//         previousOrders.forEach(order => {
//             subCategoryCounts[order.subCategory] = (subCategoryCounts[order.subCategory] || 0) + 1;
//         });

//         // Sort subcategory counts in descending order
//         const sortedSubCategories = Object.entries(subCategoryCounts).sort((a, b) => b[1] - a[1]);

//         // Take the top 3 most frequent subcategories
//         const top3SubCategories = sortedSubCategories.slice(0, 3).map(entry => entry[0]);

//         // Filter products based on the top 3 most frequent subcategories
//         const filteredProducts = products.filter(product => {
//             return top3SubCategories.includes(product.subCategory);
//         });

//         setRecommendedSubCategoryProducts(filteredProducts);
//     }
// }, [previousOrders, products]);




  useEffect(() => {
    if (previousOrders.length > 0 && products.length > 0) {
      const subCategories = previousOrders.map(order => order.subCategory);
      const colors = previousOrders.map(order => order.color); 
      
      const filteredProducts = products.filter(product => {
        return subCategories.includes(product.subCategory) && colors.includes(product.color);
      });
      setRecommendedSubCategoryProducts(filteredProducts);
    }
  }, [previousOrders, products]); 

  // useEffect(() => {
  //   if (previousOrders.length > 0 && products.length > 0) {
  //     // Count occurrences of subcategories and colors
  //     const subCategoryCounts = {};
  //     const colorCounts = {};
  //     previousOrders.forEach(order => {
  //       subCategoryCounts[order.subCategory] = (subCategoryCounts[order.subCategory] || 0) + 1;
  //       colorCounts[order.color] = (colorCounts[order.color] || 0) + 1;
  //     });
  
  //     // Find the most purchased subcategory and color
  //     let mostPurchasedSubCategory = null;
  //     let mostPurchasedColor = null;
  //     let maxSubCategoryCount = 0;
  //     let maxColorCount = 0;
  
  //     for (const subCategory in subCategoryCounts) {
  //       if (subCategoryCounts[subCategory] > maxSubCategoryCount) {
  //         maxSubCategoryCount = subCategoryCounts[subCategory];
  //         mostPurchasedSubCategory = subCategory;
  //       }
  //     }
  
  //     for (const color in colorCounts) {
  //       if (colorCounts[color] > maxColorCount) {
  //         maxColorCount = colorCounts[color];
  //         mostPurchasedColor = color;
  //       }
  //     }
  
  //     // Filter products based on the most purchased subcategory and color
  //     const filteredProducts = products.filter(product => {
  //       return product.subCategory === mostPurchasedSubCategory && product.color === mostPurchasedColor;
  //     });
  
  //     setRecommendedSubCategoryProducts(filteredProducts);
  //   }
  // }, [previousOrders, products]);
  

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(3, recommendedSubCategoryProducts.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '20px'
        }
      }
    ]
  };

  const handleSubCategoryPrevClick = () => {
    subCategorySliderRef.current.slickPrev();
  };

  const handleSubCategoryNextClick = () => {
    subCategorySliderRef.current.slickNext();
  };

  const ViewProduct = (id) => {
    navigate(`view`, { state: { uid, pid: id } });
    console.log(`click`)
  };

  return (
    <div>
      <div className="slider-container" style={{ paddingBottom: 70 }}>  
      {recommendedSubCategoryProducts.length>0 && <div>
      <h4>Recommended based on previous Orders</h4>
        <Slider ref={subCategorySliderRef} {...sliderSettings}>
          {recommendedSubCategoryProducts.map(product => (
            <div key={product.id}>
              <div className="product-container" onClick={() => ViewProduct(product.id)}>
                <img src={product.image} alt={product.brandName} style={{ width: 200, marginBottom: 10 }} />
                <div className="product-details">
                  <h3 className="brand-name">{product.brandName}</h3>
                  <p className="description">{product.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <div className="navigation-buttons">
          <button onClick={handleSubCategoryPrevClick}>&#10094;</button>
          <button onClick={handleSubCategoryNextClick}>&#10095;</button>
        </div> 
      </div> }
      </div>
    </div>
  );
};
