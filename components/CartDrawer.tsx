"use client";

import { selectCartSubtotal, useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-sand border-l border-mist shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-mist">
            <h2 className="font-display text-2xl tracking-wider-2">Panier</h2>
            <button
              onClick={close}
              aria-label="Close cart"
              className="text-xs uppercase tracking-wider-2 text-ink hover:text-terracotta"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <p className="text-sm text-ink/60 mt-12 text-center">
                Your cart is empty.
              </p>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover bg-mist"
                    />
                    <div className="flex-1 flex flex-col">
                      <p className="font-display text-lg leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs uppercase tracking-wider-2 text-ink/60 mt-1">
                        {item.size} · {item.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <button
                            onClick={() =>
                              updateQty(
                                item.productId,
                                item.size,
                                item.color,
                                item.qty - 1,
                              )
                            }
                            className="w-6 h-6 border border-ink/30 hover:border-ink"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center">{item.qty}</span>
                          <button
                            onClick={() =>
                              updateQty(
                                item.productId,
                                item.size,
                                item.color,
                                item.qty + 1,
                              )
                            }
                            className="w-6 h-6 border border-ink/30 hover:border-ink"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm">€{(item.price * item.qty).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.size, item.color)
                        }
                        className="text-[10px] uppercase tracking-wider-2 text-ink/50 hover:text-terracotta mt-2 self-start"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-mist px-6 py-5 space-y-4">
            <div className="flex items-center justify-between text-sm uppercase tracking-wider-2">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled
            >
              Checkout
            </Button>
            <p className="text-[10px] uppercase tracking-wider-2 text-ink/50 text-center">
              MVP — checkout coming soon
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
