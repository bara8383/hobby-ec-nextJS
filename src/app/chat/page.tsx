import ChatWidget from "@/components/ChatWidget";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "サポートチャット",
  description: "商品に関する質問をリアルタイムで受け付けるサポートチャット。",
  path: "/chat",
  image: "https://example.com/og/chat.jpg",
  index: false,
  follow: false
});

export default function ChatPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">サポートチャット</h1>
      <ChatWidget />
    </section>
  );
}
