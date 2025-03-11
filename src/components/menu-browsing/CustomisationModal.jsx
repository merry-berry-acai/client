import React, { useState, useContext } from 'react';
import {
  Dialog, DialogContent, Grid
} from '@mui/material';
import { MenuContext } from '../../contexts/MenuContext';
import AppImage from '../common/AppImage';
import MenuItemBuilder from './MenuItemBuilder';

// Import using barrel file
import {
  DebugPanel,
  ItemPreview,
  ToppingsPanel,
  ModalFooter,
  ModalHeader
} from './customisation-modal';

// Enable this for development debugging
const DEBUG_MODE = false;
// Maximum quantity for a single topping
const MAX_TOPPING_QUANTITY = 3;

const CustomisationModal = ({ open, onClose, onAdd, item, variant = 'new' }) => {
  const { toppings } = useContext(MenuContext);

  // Sanitize initial toppings to ensure they have all required properties
  const [selectedToppings, setSelectedToppings] = useState(() => {
    const existing = variant === 'edit'
      ? (Array.isArray(item.customization) ? item.customization : [])
      : (item.toppings || []);

    // Filter out invalid entries and ensure all required properties exist
    return existing
      .filter(t => t && t._id && t.name && typeof t.price === 'number')
      .map(t => ({
        ...t,
        quantity: t.quantity || 1,
        // Ensure price is a valid number
        price: typeof t.price === 'number' ? t.price : parseFloat(t.price) || 0
      }));
  });
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [showDebug, setShowDebug] = useState(false);

  // Calculate prices with proper decimal precision and validation
  const toppingsTotal = selectedToppings.reduce((sum, t) => {
    // Ensure we have valid numbers before calculation
    if (!t || typeof t.price !== 'number' || !t.quantity) {
      if (DEBUG_MODE) console.warn('Invalid topping found:', t);
      return sum;
    }
    return sum + (parseFloat((t.price * t.quantity).toFixed(2)));
  }, 0);

  // Ensure base price is a number and properly formatted
  const basePrice = parseFloat(item.basePrice || 0).toFixed(2);

  // Calculate total with proper formatting
  const totalPrice = parseFloat(
    ((parseFloat(basePrice) + toppingsTotal) * quantity).toFixed(2)
  );

  const incrementTopping = (topping) => {
    // Validate topping object
    if (!topping || !topping._id || typeof topping.price !== 'number') {
      if (DEBUG_MODE) console.error('Cannot add invalid topping:', topping);
      return;
    }

    setSelectedToppings(prev => {
      const exists = prev.find(t => t._id === topping._id);
      if (exists) {
        // Check if maximum quantity has been reached
        if (exists.quantity >= MAX_TOPPING_QUANTITY) {
          if (DEBUG_MODE) console.log(`Maximum quantity (${MAX_TOPPING_QUANTITY}) reached for ${topping.name}`);
          return prev; // Don't update if at max
        }

        const updated = prev.map(t =>
          t._id === topping._id ? { ...t, quantity: t.quantity + 1 } : t
        );
        if (DEBUG_MODE) console.log(`Increased quantity of ${topping.name} to ${exists.quantity + 1}`);
        return updated;
      }
      if (DEBUG_MODE) console.log(`Added new topping: ${topping.name}`);
      // Ensure we add a complete topping object
      return [...prev, {
        _id: topping._id,
        name: topping.name,
        price: topping.price,
        quantity: 1
      }];
    });
  };

  const decrementTopping = (topping) => {
    // Validate topping object
    if (!topping || !topping._id) {
      if (DEBUG_MODE) console.error('Cannot remove invalid topping:', topping);
      return;
    }

    setSelectedToppings(prev => {
      const exists = prev.find(t => t._id === topping._id);
      if (exists && exists.quantity > 1) {
        const updated = prev.map(t =>
          t._id === topping._id ? { ...t, quantity: t.quantity - 1 } : t
        );
        if (DEBUG_MODE) console.log(`Decreased quantity of ${topping.name} to ${exists.quantity - 1}`);
        return updated;
      }
      if (DEBUG_MODE) console.log(`Removed topping: ${topping.name}`);
      return prev.filter(t => t._id !== topping._id);
    });
  };

  const incrementQuantity = () => {
    setQuantity(prev => {
      const newQty = prev + 1;
      if (DEBUG_MODE) console.log(`Increased item quantity to ${newQty}`);
      return newQty;
    });
  };

  const decrementQuantity = () => {
    setQuantity(prev => {
      const newQty = Math.max(prev - 1, 1);
      if (DEBUG_MODE) console.log(`Decreased item quantity to ${newQty}`);
      return newQty;
    });
  };

  const handleAdd = () => {
    // Filter any potentially invalid toppings before submitting
    const validToppings = selectedToppings.filter(
      t => t && t._id && t.name && typeof t.price === 'number'
    );

    const menuItemBuilder = new MenuItemBuilder(item);
    menuItemBuilder
      .addItemProperty('quantity', quantity)
      .addItemProperty('customization', validToppings)
      .addItemProperty('cartItemId', item.cartItemId || `${item._id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
      .addItemProperty('calculatedItemTotal', totalPrice);

    const finalItem = menuItemBuilder.build();

    onAdd(finalItem);
    onClose();
  };

  const debugData = {
    item: {
      id: item._id,
      name: item.name,
      basePrice: parseFloat(basePrice),
    },
    quantity,
    selectedToppings: selectedToppings
      .filter(t => t && t._id && typeof t.price === 'number')
      .map(t => ({
        id: t._id,
        name: t.name,
        price: t.price,
        quantity: t.quantity,
        itemTotal: parseFloat((t.price * t.quantity).toFixed(2))
      })),
    toppingsTotal: parseFloat(toppingsTotal.toFixed(2)),
    totalPrice: totalPrice
  };

  const title = variant === 'edit' ? `Edit ${item.name}` : `Customise Your ${item.name}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <ModalHeader
        title={title}
        onClose={onClose}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
        debugMode={DEBUG_MODE}
      />

      {DEBUG_MODE && <DebugPanel showDebug={showDebug} debugData={debugData} />}

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <ItemPreview
              item={item}
              basePrice={basePrice}
              quantity={quantity}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />
            {/* Properly pass all possible image sources */}

          </Grid>

          <Grid item xs={12} md={7}>
            <ToppingsPanel
              toppings={toppings}
              selectedToppings={selectedToppings}
              incrementTopping={incrementTopping}
              decrementTopping={decrementTopping}
              maxToppingQuantity={MAX_TOPPING_QUANTITY}
              toppingsTotal={toppingsTotal}
              debugMode={DEBUG_MODE}
            />
          </Grid>
        </Grid>

        <ModalFooter
          basePrice={basePrice}
          toppingsTotal={toppingsTotal}
          quantity={quantity}
          totalPrice={totalPrice}
          onCancel={onClose}
          onConfirm={handleAdd}
          variant={variant}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomisationModal;
