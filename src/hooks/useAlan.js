// import { useRef } from "react"
// import alanBtn from "@alan-ai/alan-sdk-web"
// import { useCart } from "../context/CartContext"
// import storeItems from "../items.json"

// const COMMANDS = {
//   OPEN_CART: "open-cart",
//   CLOSE_CART: "close-cart",
//   ADD_ITEM: "add-item",
//   REMOVE_ITEM: "remove-item",
//   PURCHASE_ITEMS: "purchase-items"
// }

// export default function useAlan() {
//   const {
//     cart,
//     isCartEmpty,
//     setShowCartItems,
//     addToCart,
//     removeFromCart,
//     checkout
//   } = useCart()

//   const alan = useRef()
//   if (alan.current == null) {
//     alan.current = alanBtn({
//       key: process.env.REACT_APP_ALAN_KEY,
//       onCommand: ({ command, payload }) => {
//         switch (command) {
//           case COMMANDS.OPEN_CART:
//             openCart(alan)
//             break
//           case COMMANDS.CLOSE_CART:
//             closeCart(alan)
//             break
//           case COMMANDS.ADD_ITEM:
//             addItem(alan, payload)
//             break
//           case COMMANDS.REMOVE_ITEM:
//             removeItem(alan, payload)
//             break
//           case COMMANDS.PURCHASE_ITEMS:
//             purchaseItems(alan)
//             break
//         }
//       }
//     })
//   }

//   function openCart(alan) {
//     if (isCartEmpty) {
//       alan.playText("Your cart is empty")
//     } else {
//       setShowCartItems(true)
//       alan.playText("Opening Cart")
//     }
//   }

//   function closeCart(alan) {
//     if (isCartEmpty) {
//       alan.playText("Your cart is empty")
//     } else {
//       setShowCartItems(false)
//       alan.playText("Closing Cart")
//     }
//   }

//   function addItem(alan, { name, quantity }) {
//     const item = storeItems.find(
//       i => i.name.toLowerCase() === name.toLowerCase()
//     )
//     if (item == null) {
//       alan.playText(`I cannot find the ${name} item`)
//     } else {
//       addToCart(item.id, quantity)
//       alan.playText(`Added ${quantity} of the ${name} item to your cart`)
//     }
//   }

//   function removeItem(alan, { name }) {
//     const entry = cart.find(
//       e => e.item.name.toLowerCase() === name.toLowerCase()
//     )
//     if (entry == null) {
//       alan.playText(`I cannot find the ${name} item in your cart`)
//     } else {
//       removeFromCart(entry.itemId)
//       alan.playText(`Removed the ${name} item from your cart`)
//     }
//   }

//   function purchaseItems() {
//     if (isCartEmpty) {
//       alan.current.playText("Your cart is empty")
//     } else {
//       alan.current.playText("Checking out")
//       checkout()
//     }
//   }
// }

import { useCallback, useEffect } from "react"
import alanBtn from "@alan-ai/alan-sdk-web"
import { useCart } from "../context/CartContext"
import storeItems from "../items.json"
import { deepStrictEqual } from "assert"

let alanBtnInstance;

const COMMANDS = {
  OPEN_CART: "open-cart",
  CLOSE_CART: "close-cart",
  ADD_ITEM: "add-item",
  REMOVE_ITEM: "remove-item",
  PURCHASE_ITEMS: "purchase-items"
}

export default function useAlan() {
  const {
    cart,
    isCartEmpty,
    setShowCartItems,
    addToCart,
    removeFromCart,
    checkout
  } = useCart()

  function openCart(isEmpty) {
    if (isEmpty) {
      alanBtnInstance.playText("Your cart is empty")
    } else {
      setShowCartItems(true)
      alanBtnInstance.playText("Opening Cart")
    }
  }

  function closeCart(isEmpty) {
    if (isEmpty) {
      alanBtnInstance.playText("Your cart is empty")
    } else {
      setShowCartItems(false)
      alanBtnInstance.playText("Closing Cart")
    }
  }

  function addItem(alan, { name, quantity }) {
    const item = storeItems.find(
      i => i.name.toLowerCase() === name.toLowerCase()
    )
    if (item == null) {
      alan.playText(`I cannot find the ${name} item`)
    } else {
      addToCart(item.id, quantity)
      alan.playText(`Added ${quantity} of the ${name} item to your cart`)
    }
  }

  function removeItem(alan, { name }) {
    const entry = cart.find(
      e => e.item.name.toLowerCase() === name.toLowerCase()
    )
    if (entry == null) {
      alan.playText(`I cannot find the ${name} item in your cart`)
    } else {
      removeFromCart(entry.itemId)
      alan.playText(`Removed the ${name} item from your cart`)
    }
  }

  function purchaseItems(alan) {
    if (isCartEmpty) {
      alan.playText("Your cart is empty")
    } else {
      alan.playText("Checking out")
      checkout()
    }
  }


  const openCartCb = useCallback(event => {
    openCart(isCartEmpty);
  }, [isCartEmpty, openCart]);

  const closeCartCb = useCallback(event => {
    closeCart(isCartEmpty);
  }, [isCartEmpty, closeCart]);

  useEffect(() => {
    window.addEventListener(COMMANDS.OPEN_CART, openCartCb);
    window.addEventListener(COMMANDS.CLOSE_CART, closeCartCb);
    return () => {
      window.removeEventListener(COMMANDS.OPEN_CART, openCartCb);
      window.removeEventListener(COMMANDS.CLOSE_CART, closeCartCb);
    };
  }, [openCartCb]);


  useEffect(() => {
    alanBtnInstance = alanBtn({
      key: process.env.REACT_APP_ALAN_KEY,
      onCommand: ({ command, payload }) => {
        window.dispatchEvent(new CustomEvent(command));
      }
    })
  }, [])
}
