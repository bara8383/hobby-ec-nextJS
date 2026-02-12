import { addToCart } from "@/actions/cartActions";
import type { Product } from "@/types";
import Button from "@/components/ui/Button";

export default function AddToCartButton({ product }: { product: Product }) {
  const action = addToCart.bind(null, product.id);

  return (
    <form action={action}>
      <Button type="submit">カートに追加</Button>
    </form>
  );
}
