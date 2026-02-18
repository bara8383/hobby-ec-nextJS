import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { getProductBySlug } from '@/data/products';

export const runtime = 'edge';
const size = {
  width: 1200,
  height: 630
};

function createPreviewDataUrl(title: string) {
  const safeTitle = title.replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="630" viewBox="0 0 920 630"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#0f172a" offset="0"/><stop stop-color="#2563eb" offset="1"/></linearGradient></defs><rect width="920" height="630" fill="url(#g)"/><text x="60" y="320" fill="#e2e8f0" font-size="62" font-family="Arial, sans-serif">${safeTitle}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') ?? '';
  const product = getProductBySlug(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111827',
            color: '#f9fafb',
            fontSize: 48,
            fontWeight: 700
          }}
        >
          Product Not Found
        </div>
      ),
      size
    );
  }

  const imageMedia = product.media.find((media) => media.type === 'image');
  const priceText = `JPY ${product.priceJpy.toLocaleString('en-US')}`;
  const previewImageUrl = createPreviewDataUrl(product.name);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#0b1020',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          padding: '40px',
          gap: '28px'
        }}
      >
        <div
          style={{
            width: 460,
            height: '100%',
            borderRadius: 24,
            backgroundColor: '#1f2937',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={imageMedia?.alt ?? product.name}
            src={previewImageUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 34, color: '#93c5fd' }}>Digital Creator Market</div>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>{product.name}</div>
            <div style={{ fontSize: 28, color: '#cbd5e1', lineHeight: 1.4 }}>Premium digital item preview</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', fontSize: 52, fontWeight: 700 }}>{priceText}</div>
            <div style={{ display: 'flex', fontSize: 26, color: '#93c5fd' }}>/{product.slug}</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
