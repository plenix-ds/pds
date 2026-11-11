// Library part w13A (wave 13, lane A): commerce. ProductCard (one product in a catalog: grid, list, sale, out of stock),
// ProductOptions (size buttons, color swatches, quantity) and the Commerce templates (product discovery, listing and
// detail, cart, checkout, payment, order confirmation, order management, subscription management, returns).
export { ProductCard, ProductPrice } from '../patterns/ProductCard/ProductCard.tsx';
export { ProductOptions } from '../components/ProductOptions/ProductOptions.tsx';
export { COMMERCE_PAGES } from '../templates/Commerce/pages.ts';
export { useCommercePage } from '../templates/Commerce/useCommercePage.ts';
export { orderTotals } from '../templates/Commerce/totals.ts';
export { CommerceLine, OrderSummary } from '../templates/Commerce/shared.tsx';
export { ProductListing } from '../templates/Commerce/ProductListing.tsx';
export { ProductDiscovery } from '../templates/Commerce/ProductDiscovery.tsx';
export { ProductDetail } from '../templates/Commerce/ProductDetail.tsx';
export { productFields } from '../templates/Commerce/productFields.ts';
export { Cart } from '../templates/Commerce/Cart.tsx';
export { Checkout } from '../templates/Commerce/Checkout.tsx';
export { Payment } from '../templates/Commerce/Payment.tsx';
export { PaymentFields } from '../templates/Commerce/PaymentFields.tsx';
export { OrderConfirmation } from '../templates/Commerce/OrderConfirmation.tsx';
export { cardBrand, formatCardNumber } from '../templates/Commerce/card.ts';
export { ORDER_STATUSES } from '../templates/Commerce/statuses.ts';
export { OrderStatus } from '../templates/Commerce/OrderStatus.tsx';
export { OrderManagement } from '../templates/Commerce/OrderManagement.tsx';
export { OrderDetail } from '../templates/Commerce/OrderDetail.tsx';
export { SubscriptionManagement } from '../templates/Commerce/SubscriptionManagement.tsx';
export { Returns } from '../templates/Commerce/Returns.tsx';
