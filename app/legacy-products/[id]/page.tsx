import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacyProductPage({ params }: Props) {
  const { id } = await params;
  redirect(`/products/${id}`);
}
