'use client'

import { useEffect, useState } from 'react'
import { Trash, FunnelSimple, DownloadSimple, Copy, Check } from '@phosphor-icons/react'
import { PAKET_LABELS } from '@/lib/pricing'
import { getOrders, clearOrders, calculateStatsForOrders, type Order, type DailyStats } from '@/lib/clientDb'
import { useTheme } from '@/components/ThemeProvider'

interface SalesHistoryProps {
  refreshKey?: number
  onSuccess?: () => void
}

interface GroupedOrders {
  [date: string]: Order[]
}

export default function SalesHistory({ refreshKey = 0, onSuccess }: SalesHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { theme } = useTheme()
  const [isExporting, setIsExporting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const fetchOrders = () => {
    try {
      const data = getOrders()
      setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [refreshKey])

  const clearHistory = () => {
    if (!confirm('Clear all sales history?')) return
    clearOrders()
    setOrders([])
    onSuccess?.()
  }

  const handleDownloadPNG = () => {
    if (!selectedDate) return
    setIsExporting(true)
    setTimeout(() => {
      try {
        const canvas = generateSalesHistoryCanvas(filteredOrders, selectedDate, theme)
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `Sales-History-${selectedDate.replace(/\s+/g, '-')}.png`
        link.href = url
        link.click()
      } catch (err) {
        console.error('Failed to export PNG', err)
      } finally {
        setIsExporting(false)
      }
    }, 100)
  }

  const handleCopyPNG = () => {
    if (!selectedDate) return
    setIsCopying(true)
    setTimeout(() => {
      try {
        const canvas = generateSalesHistoryCanvas(filteredOrders, selectedDate, theme)
        canvas.toBlob((blob) => {
          if (!blob) {
            setIsCopying(false)
            return
          }
          try {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
              setCopyFeedback(true)
              setTimeout(() => setCopyFeedback(false), 2000)
            }).catch(err => {
              console.error('Clipboard write failed, downloading instead', err)
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.download = `Sales-History-${selectedDate.replace(/\s+/g, '-')}.png`
              link.href = url
              link.click()
              URL.revokeObjectURL(url)
            }).finally(() => {
              setIsCopying(false)
            })
          } catch (clipboardErr) {
            console.error('ClipboardItem not supported or clipboard write failed', clipboardErr)
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `Sales-History-${selectedDate.replace(/\s+/g, '-')}.png`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
            setIsCopying(false)
          }
        }, 'image/png')
      } catch (err) {
        console.error('Failed to copy PNG', err)
        setIsCopying(false)
      }
    }, 100)
  }

  const groupedOrders: GroupedOrders = orders.reduce((acc, order) => {
    const date = new Date(order.timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(order)
    return acc
  }, {} as GroupedOrders)

  const filteredOrders = selectedDate ? groupedOrders[selectedDate] || [] : orders

  if (loading) {
    return (
      <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-medium text-text-secondary uppercase">History</h2>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-6 bg-bg-border rounded animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-medium text-text-secondary uppercase">History</h2>
          <button onClick={clearHistory} className="text-text-secondary hover:text-error">
            <Trash size={14} />
          </button>
        </div>
        <p className="text-text-secondary text-xs text-center py-4">No sales</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface border border-bg-border rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-medium text-text-secondary uppercase">History</h2>
        <div className="flex items-center gap-3">
          {selectedDate && (
            <>
              <button
                onClick={handleCopyPNG}
                disabled={isCopying}
                className={`text-[10px] flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                  copyFeedback 
                    ? 'text-success' 
                    : 'text-text-secondary hover:text-accent'
                }`}
                title="Copy Report as PNG to Clipboard"
              >
                {copyFeedback ? (
                  <Check size={12} weight="bold" />
                ) : (
                  <Copy size={12} />
                )}
                {copyFeedback ? 'Copied!' : isCopying ? 'Copying...' : 'Copy PNG'}
              </button>
              <button
                onClick={handleDownloadPNG}
                disabled={isExporting}
                className="text-[10px] flex items-center gap-1 text-text-secondary hover:text-accent font-medium transition-colors cursor-pointer"
                title="Download Report as PNG"
              >
                <DownloadSimple size={12} />
                {isExporting ? 'Exporting...' : 'Export PNG'}
              </button>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-[10px] text-accent hover:text-accent-hover font-medium cursor-pointer"
              >
                Clear filter
              </button>
            </>
          )}
          <button onClick={clearHistory} className="text-text-secondary hover:text-error cursor-pointer" title="Clear all history">
            <Trash size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-2 overflow-x-auto scrollbar-hide pb-1">
        {Object.keys(groupedOrders).map(date => (
          <button
            key={date}
            onClick={() => setSelectedDate(selectedDate === date ? null : date)}
            className={`px-2 py-1 rounded text-[10px] whitespace-nowrap ${
              selectedDate === date
                ? 'bg-accent text-bg-primary'
                : 'bg-bg-primary text-text-secondary hover:bg-bg-border'
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="bg-bg-primary rounded p-2 mb-2 border border-bg-border text-xs space-y-1.5">
          <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-text-secondary">
            <span>Summary: {selectedDate}</span>
            <span className="text-accent">
              Total: {filteredOrders.reduce((sum, o) => sum + o.quantity, 0)} Paket
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(
              filteredOrders.reduce((acc, order) => {
                const label = PAKET_LABELS[order.paket_type as keyof typeof PAKET_LABELS]?.replace('PAKET ', '') || order.paket_type;
                acc[label] = (acc[label] || 0) + order.quantity;
                return acc;
              }, {} as Record<string, number>)
            ).map(([label, qty]) => (
              <span key={label} className="bg-bg-surface px-1.5 py-0.5 rounded text-[10px] text-text-primary border border-bg-border">
                {label}: <span className="text-accent font-semibold">{qty}x</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1 max-h-[150px] overflow-y-auto scrollbar-hide">
        {(selectedDate ? filteredOrders : orders.slice(0, 50)).map(order => {
          const time = new Date(order.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })
          return (
            <div key={order.id} className="flex justify-between items-center p-2 bg-bg-primary rounded text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-text-secondary font-mono shrink-0">{time}</span>
                <span className="text-text-primary truncate">
                  {PAKET_LABELS[order.paket_type as keyof typeof PAKET_LABELS]?.replace('PAKET ', '')}
                  {order.quantity > 1 && <span className="text-accent ml-1">x{order.quantity}</span>}
                </span>
                {order.notes && (
                  <span className="text-text-secondary truncate text-[10px] italic hidden sm:inline">({order.notes})</span>
                )}
              </div>
              <span className="font-mono text-accent shrink-0 ml-2">
                ${order.total.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
      {!selectedDate && orders.length > 50 && (
        <p className="text-[10px] text-text-secondary text-center mt-2">+{orders.length - 50} more</p>
      )}
    </div>
  )
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawAtomLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Center circle
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, 2 * Math.PI);
  ctx.fillStyle = '#e84040';
  ctx.fill();

  // Ellipses
  ctx.strokeStyle = '#f0c040';
  ctx.lineWidth = 1.8;

  const drawEllipse = (angle: number) => {
    ctx.save();
    ctx.rotate(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 5.5, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  };

  drawEllipse(0);
  drawEllipse(60);
  drawEllipse(-60);

  // Outer small circles
  const drawOuterCircle = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, 2 * Math.PI);
    ctx.fillStyle = '#e84040';
    ctx.fill();
  };

  drawOuterCircle(13, 0);
  drawOuterCircle(-12.5, 6);
  drawOuterCircle(-12.5, -6);

  ctx.restore();
}

function generateSalesHistoryCanvas(
  orders: Order[],
  dateStr: string,
  theme: 'dark' | 'light'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const width = 450;
  
  // Calculate dynamic height
  const headerHeight = 90;
  const statsHeight = 135;
  const tableHeaderHeight = 35;
  const rowHeight = 28;
  const footerHeight = 60;
  const totalHeight = headerHeight + statsHeight + tableHeaderHeight + (orders.length * rowHeight) + footerHeight;

  const dpr = 2; // high res
  canvas.width = width * dpr;
  canvas.height = totalHeight * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${totalHeight}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.scale(dpr, dpr);

  // Colors based on theme
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1814' : '#faf8f5';
  const cardColor = isDark ? '#2a2520' : '#ffffff';
  const borderColor = isDark ? '#3d3630' : '#e8e4e0';
  const textPrimary = isDark ? '#f5f0e8' : '#1a1814';
  const textSecondary = isDark ? '#a89f94' : '#6b6560';
  const accentColor = isDark ? '#f0c040' : '#e8a820';
  const successColor = isDark ? '#7ab87a' : '#4a8a4a';

  // Fill Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, totalHeight);

  // Draw Header
  drawAtomLogo(ctx, 40, 45, 1.2);

  // Title
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'left';
  ctx.fillText('Up n Atom Kitchen', 72, 43);

  // Subtitle
  ctx.font = '500 11px sans-serif';
  ctx.fillStyle = textSecondary;
  ctx.fillText('DAILY SALES REPORT', 72, 58);

  // Date on the right
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = textPrimary;
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, width - 20, 50);

  // Header separator
  ctx.beginPath();
  ctx.moveTo(20, 80);
  ctx.lineTo(width - 20, 80);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Stats Card
  const stats = calculateStatsForOrders(orders);
  const grandTotal = stats.totalRevenue + stats.totalTax + stats.totalDelivery;

  const cardX = 20;
  const cardY = 95;
  const cardW = width - 40;
  const cardH = 115;
  const cardRadius = 8;

  // Draw stats card background
  ctx.fillStyle = cardColor;
  drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Title
  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = textSecondary;
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL SALES', cardX + 15, cardY + 25);

  // Grand Total amount
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'right';
  ctx.fillText(`$${grandTotal.toLocaleString()}`, cardX + cardW - 15, cardY + 28);

  // Package quantities summary
  const activePackages = (['reguler', 'custom', 'delivery', 'custom_delivery', 'apipi', 'catering'] as const)
    .map(type => {
      const data = stats[type];
      return { label: PAKET_LABELS[type].replace('PAKET ', ''), count: data.count };
    })
    .filter(p => p.count > 0);

  const pkgTexts = activePackages.map(p => `${p.label}: ${p.count}x`).join('  •  ');
  ctx.font = '11px sans-serif';
  ctx.fillStyle = textPrimary;
  ctx.textAlign = 'left';
  ctx.fillText(pkgTexts || 'No Sales packages', cardX + 15, cardY + 54);

  // Share cut line
  ctx.beginPath();
  ctx.moveTo(cardX + 15, cardY + 72);
  ctx.lineTo(cardX + cardW - 15, cardY + 72);
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  // Share values
  ctx.font = '11px sans-serif';
  ctx.fillStyle = textSecondary;
  ctx.fillText(`Comp Cut: $${stats.companyCut.toLocaleString()}`, cardX + 15, cardY + 94);

  ctx.fillStyle = successColor;
  ctx.textAlign = 'right';
  ctx.fillText(`Staff Cut: $${(stats.staffCut + stats.totalDelivery).toLocaleString()}`, cardX + cardW - 15, cardY + 94);

  // Table Header
  const tableY = cardY + cardH + 25;
  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = textSecondary;
  ctx.textAlign = 'left';
  ctx.fillText('TIME', 20, tableY);
  ctx.fillText('ORDER DETAILS', 75, tableY);
  ctx.textAlign = 'right';
  ctx.fillText('TOTAL', width - 20, tableY);

  // Table header line
  ctx.beginPath();
  ctx.moveTo(20, tableY + 6);
  ctx.lineTo(width - 20, tableY + 6);
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  // Table Rows (Orders)
  let currentY = tableY + 22;
  orders.forEach(order => {
    const timeStr = new Date(order.timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Time
    ctx.font = '11px monospace';
    ctx.fillStyle = textSecondary;
    ctx.textAlign = 'left';
    ctx.fillText(timeStr, 20, currentY);

    // Order label & Notes
    const pkgLabel = PAKET_LABELS[order.paket_type as keyof typeof PAKET_LABELS]?.replace('PAKET ', '') || order.paket_type;
    const qtyStr = order.quantity > 1 ? ` x${order.quantity}` : '';
    const notesStr = order.notes ? ` (${order.notes})` : '';
    
    // Draw package label
    ctx.font = '11px sans-serif';
    ctx.fillStyle = textPrimary;
    ctx.fillText(pkgLabel + qtyStr, 75, currentY);
    
    // Measure package label width to place notes in italics
    if (notesStr) {
      const labelWidth = ctx.measureText(pkgLabel + qtyStr).width;
      ctx.font = 'italic 10px sans-serif';
      ctx.fillStyle = textSecondary;
      ctx.fillText(notesStr, 75 + labelWidth + 4, currentY);
    }

    // Total price
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'right';
    ctx.fillText(`$${order.total.toLocaleString()}`, width - 20, currentY);

    // Row divider
    ctx.beginPath();
    ctx.moveTo(20, currentY + 7);
    ctx.lineTo(width - 20, currentY + 7);
    ctx.strokeStyle = isDark ? 'rgba(61, 54, 48, 0.3)' : 'rgba(232, 228, 224, 0.4)';
    ctx.stroke();

    currentY += rowHeight;
  });

  // Footer
  const footerY = totalHeight - 25;
  ctx.font = '9px sans-serif';
  ctx.fillStyle = textSecondary;
  ctx.textAlign = 'center';
  ctx.fillText('Generated by Up n Atom Kitchen Dashboard', width / 2, footerY);

  return canvas;
}
