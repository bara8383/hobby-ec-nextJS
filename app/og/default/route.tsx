import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = {
  width: 1200,
  height: 630
};

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ fontSize: 34, color: '#bfdbfe', marginBottom: 24 }}>Digital Creator Market</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
          壁紙・写真・イラスト・デジタル音源を
          <br />
          比較して購入できるECサイト
        </div>
        <div style={{ fontSize: 30, color: '#dbeafe', lineHeight: 1.4 }}>
          用途・ライセンス・形式が分かる情報設計で、公開ページを機械可読に整理。
        </div>
      </div>
    ),
    size
  );
}
