import React, { createContext, useState, useEffect } from "react";
import API from "../utils/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Recalculate discount if cart changes and coupon is applied
  useEffect(() => {
    if (coupon) {
      const subtotal = calculateItemsPrice();
      if (subtotal < coupon.minPurchase) {
        removeCoupon();
        setCouponError(`Min purchase of Rs. ${coupon.minPurchase} required for this coupon.`);
      } else {
        calculateDiscount(coupon, subtotal);
      }
    }
  }, [cartItems]);

  // ADD TO CART
  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCartItems((prev) => {
      // Look for identical product and variant
      const exists = prev.find(
        (item) =>
          item.product === product._id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      );

      if (exists) {
        return prev.map((item) =>
          item.product === product._id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.discountPrice || product.price,
          quantity,
          selectedVariant,
          stock: product.stock
        }
      ];
    });
  };

  // REMOVE FROM CART
  const removeFromCart = (productId, selectedVariant = null) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product === productId &&
            JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
          )
      )
    );
  };

  // UPDATE QUANTITY
  const updateQuantity = (productId, quantity, selectedVariant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId &&
        JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
          ? { ...item, quantity }
          : item
      )
    );
  };

  // CLEAR CART
  const clearCart = () => {
    setCartItems([]);
    removeCoupon();
  };

  // WISHLIST TOGGLE
  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  // CALCULATE PRICES
  const calculateItemsPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateDiscount = (couponData, subtotal) => {
    let disc = 0;
    if (couponData.discountType === "Percentage") {
      disc = (subtotal * couponData.discountValue) / 100;
      if (couponData.maxDiscount && disc > couponData.maxDiscount) {
        disc = couponData.maxDiscount;
      }
    } else {
      disc = couponData.discountValue;
    }
    setDiscount(Math.min(disc, subtotal));
  };

  // APPLY COUPON
  const applyCouponCode = async (code) => {
    setCouponError("");
    const subtotal = calculateItemsPrice();
    try {
      const { data } = await API.post("/coupons/validate", {
        code,
        purchaseAmount: subtotal
      });
      setCoupon(data);
      calculateDiscount(data, subtotal);
      return { success: true };
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      return {
        success: false,
        message: err.response?.data?.message || "Invalid coupon"
      };
    }
  };

  // REMOVE COUPON
  const removeCoupon = () => {
    setCoupon(null);
    setDiscount(0);
    setCouponError("");
  };

  // PRICING SUMMARY OBJECT
  const getPricingSummary = () => {
    const itemsPrice = calculateItemsPrice();
    const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100; // 18% GST
    const shippingPrice = itemsPrice - discount > 500 ? 0 : 50; // Rs. 50 or Free above Rs. 500
    const totalPrice = Math.max(0, itemsPrice + taxPrice + shippingPrice - discount);

    return {
      itemsPrice,
      taxPrice,
      shippingPrice,
      discount,
      totalPrice
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        coupon,
        couponError,
        discount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCouponCode,
        removeCoupon,
        getPricingSummary
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
