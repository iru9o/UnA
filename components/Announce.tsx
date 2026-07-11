'use client'

import { useState } from 'react'
import { Megaphone, Copy, Check, Shuffle } from '@phosphor-icons/react'

interface MenuWithDetails {
  food: string
  drink: string
}

const VARIATIONS = [
  (food: string, drink: string) =>
    `/joball 🍟 BURUAN CEK, UP N ATOM LAGI OPEN! 🍟 | ✨ ${food} ✨ + 💜 ${drink} | Ada Menu Apipi khusus buat yang berdua 🥰 | 🕒 Buka 24 jam nonstop | 📍 948 Roxwood | 📱 Cek di Companies App | Custom menu? Gas langsung!`,

  (food: string, drink: string) =>
    `/joball 🔥 PERUT AMAN? UP N ATOM READY STANDBY! 🔥 | Menu hits: ⭐ ${food} ⭐ + 💧 ${drink} | Yang bawa pasangan ada Menu Apipi spesial 💖 | 🍳 24 Jam | 📍 948 Roxwood | 📱 Companies App | Custom? Bebas request!`,

  (food: string, drink: string) =>
    `/joball 🍟 MASIH BINGUNG MAKAN? UP N ATOM SOLUSINYA! 🍟 | 🕒 24 jam full | Ada ${food} & ${drink} | Mau Menu Apipi buat si doi? Ready 👩‍❤️‍👨 | 📍 948 Roxwood | 📱 Companies App | Menerima menu custom!`,

  (food: string, drink: string) =>
    `/joball ✨ TEBAK SIAPA YANG OPEN? RESTO UP N ATOM! ✨ | Combo: ${food} + ${drink} 🍹 | Menu Apipi buat yang bucin juga ready nih 🌹 | 🕒 Buka 24 jam | 📍 948 Roxwood | 📱 Companies App | Custom? Chat aja!`,

  (food: string, drink: string) =>
    `/joball 🍟 JANGAN KELAPERAN DI JALAN, DI UP N ATOM AJA! 🍟 | 🎉 ${food} 🎉 & 🍹 ${drink} | Sedia Menu Apipi buat lo yang nge-date 👩‍❤️‍💋‍👨 | 💫 24 jam nonstop | 📍 948 Roxwood | 📱 Companies App | Request custom? Siap!`,

  (food: string, drink: string) =>
    `/joball 🔔 KOTA LAGI RAME, UP N ATOM SIAP MELAYANI! 🔔 | Ada 🌟 ${food} 🌟 + 🍹 ${drink} | Paket Menu Apipi buat pacar lo ada juga 😘 | 🍳 24 Jam gass terus 💪 | 📍 948 Roxwood | 📱 Companies App | Custom menu? Gasin!`,

  (food: string, drink: string) =>
    `/joball 🍟 COMBO MAUT HADIR LAGI DI UP N ATOM! 🍟 | ${food} + ${drink} ready stock! | Menu Apipi buat kaum kasmaran juga ada lho 💕 | 🕒 Nonstop 24 jam | 📍 948 Roxwood | 📱 Cek Companies App | Custom order? Ready!`,

  (food: string, drink: string) =>
    `/joball 💥 HALO KOTA! RESTO UP N ATOM BUKA KEMBALI! 💥 | ⭐ ${food} ⭐ + 💜 ${drink} | Beli Menu Apipi biar makin disayang doi 😍 | 🕒 Tetap buka 24 jam | 📍 948 Roxwood | 📱 Companies App | Bisa request menu sesukamu!`,

  (food: string, drink: string) =>
    `/joball 🍟 PERUT KOSONG? TENANG, UP N ATOM MASIH OPEN! 🍟 | Ada: ${food} + ${drink} | Lagi berdua? Cobain Menu Apipi yang romantis 🥂 | 🕒 24 jam aman | 📍 948 Roxwood | 📱 Companies App | Mau custom? Kita buatin!`,

  (food: string, drink: string) =>
    `/joball 🔥 MANTAP BETUL, UP N ATOM DAPURNYA NGEBUL! 🔥 | Wajib coba: 🎯 ${food} + ${drink} | Menu Apipi buat yang punya kesayangan ada 😻 | 🍳 Masak 24 jam nonstop | 📍 948 Roxwood | 📱 Companies App | Custom order? Gas!`,

  (food: string, drink: string) =>
    `/joball 😋 CARI YANG PASTI AMAN DI KANTONG? UP N ATOM AJA! 😋 | Combo: 🔥 ${food} + ${drink} 🔥 | Sikat Menu Apipi buat pacar tercinta 💘 | 🕒 24 jam | 📍 948 Roxwood | 📱 Companies App | Menerima custom orderan!`,

  (food: string, drink: string) =>
    `/joball 🍟 BUTUH YANG SEGER-SEGER? DI UP N ATOM AJA! 🍹 | ✨ ${food} ✨ bareng ${drink} | Menu Apipi buat pelipur lara juga ready 👩‍❤️‍👨 | 🕒 24 jam anti libur | 📍 948 Roxwood | 📱 Companies App | Bisa custom sesuka hati!`,

  (food: string, drink: string) =>
    `/joball ⚡ GAK PAKE LAMA, DI UP N ATOM AJA! ⚡ | Menu: ${food} plus segeranya ${drink} | Tenang, Menu Apipi khusus buciners selalu ada 💍 | 🕒 24 jam siap saji | 📍 948 Roxwood | 📱 Companies App | Custom? Sikat bos!`,

  (food: string, drink: string) =>
    `/joball 🍟 RESTO UP N ATOM SERBA READY! 🍟 | 🎉 ${food} 🎉 + 🍹 ${drink} | Menu Apipi porsi berdua siap memanjakan lidah 👩‍❤️‍👨 | 🕒 Buka 24 jam | 📍 948 Roxwood | 📱 Companies App | Pesenan custom? Hubungi kami!`,

  (food: string, drink: string) =>
    `/joball 🔔 KABAR GEMBIRA UP N ATOM BUKA FULL! 🔔 | Pas ada ${food} sama 💜 ${drink} | Menu Apipi spesial edisi pacaran ada kok 💞 | 🍳 Buka 24 jam | 📍 948 Roxwood | 📱 Cek Companies App | Custom orderan? Hubungi aja!`
]

const DELIVERY_VARIATIONS = [
  (food: string, drink: string) =>
    `/joball 🛵 UP N ATOM DELIVERY ONLY! 🛵 | Resto offline sedang kosong, tapi dapur ON khusus delivery di Companies App! | Menu: ${food} & ${drink} | Langsung order!`,

  (food: string, drink: string) =>
    `/joball 🔔 MODE CLOUD KITCHEN UP N ATOM! 🔔 | Tidak ada staff di resto, tapi kami siap melayani orderan via Delivery! | Menu: ${food} + ${drink} | Order lewat Companies App!`,

  (food: string, drink: string) =>
    `/joball 🍟 UP N ATOM READY VIA DELIVERY! 🍟 | Pegawai minim, makan di tempat tutup. Silakan order ${food} + ${drink} via Companies App | Kami antar sampai tujuan!`,

  (food: string, drink: string) =>
    `/joball 📢 KABAR UP N ATOM: DELIVERY AKTIF! 📢 | Resto offline tutup, kami beroperasi sebagai Cloud Kitchen! | Menu: ${food} + ${drink} | Hubungi kami di Companies App!`,

  (food: string, drink: string) =>
    `/joball 🛵 TETAP MASAK KHUSUS DELIVERY! 🛵 | Dapur Up n Atom tetap ON! Hubungi kami di Companies App | Nikmati ${food} & ${drink} hangat langsung ke tempat Anda!`,

  (food: string, drink: string) =>
    `/joball 🔥 RESTO OFF, DELIVERY ON! 🔥 | Tidak ada staff di resto, tapi kami melayani via delivery (Cloud Kitchen) | Order ${food} & ${drink} via Companies App | Gass!`,

  (food: string, drink: string) =>
    `/joball 🍟 LAPAR? ORDER DELIVERY AJA! 🍟 | Up n Atom buka khusus delivery via Companies App | Menu hits: ${food} + ${drink} | Nikmati kemudahan tanpa antre!`,

  (food: string, drink: string) =>
    `/joball 📢 UP N ATOM CLOUD KITCHEN MODE! 📢 | Pegawai kurang untuk jaga resto, tapi dapur delivery siap saji! | Pilihan menu: ${food} + ${drink} | Cek di Companies App!`,

  (food: string, drink: string) =>
    `/joball 🛵 LAPAR? DELIVERY AJA! 🛵 | Layanan dine-in tutup, tapi delivery via Companies App selalu ON | Menu: ${food} & ${drink} | Siap meluncur!`,

  (food: string, drink: string) =>
    `/joball 🔔 UP N ATOM KITCHEN UPDATE 🔔 | Dapur ON khusus delivery (Cloud Kitchen) | Menu: ${food} + ${drink} | Pesan cepat lewat Companies App sekarang juga!`
]

interface AnnounceProps {
  todayMenu: { food: string; drink: string } | null
}

export default function Announce({ todayMenu }: AnnounceProps) {
  const [variationIndex, setVariationIndex] = useState(0)
  const [history, setHistory] = useState<number[]>([0])
  const [copied, setCopied] = useState(false)

  const [deliveryIndex, setDeliveryIndex] = useState(0)
  const [deliveryHistory, setDeliveryHistory] = useState<number[]>([0])
  const [deliveryCopied, setDeliveryCopied] = useState(false)

  const currentMessage = todayMenu
    ? VARIATIONS[variationIndex](todayMenu.food.toUpperCase(), todayMenu.drink.toUpperCase())
    : ''

  const currentDeliveryMessage = todayMenu
    ? DELIVERY_VARIATIONS[deliveryIndex](todayMenu.food.toUpperCase(), todayMenu.drink.toUpperCase())
    : ''

  const charCount = currentMessage.length
  const isOverLimit = charCount > 250

  const deliveryCharCount = currentDeliveryMessage.length
  const isDeliveryOverLimit = deliveryCharCount > 250

  const shuffleVariation = () => {
    if (VARIATIONS.length <= 1) return

    const unused = Array.from({ length: VARIATIONS.length }, (_, i) => i)
      .filter(i => !history.includes(i))

    if (unused.length === 0) {
      const remaining = Array.from({ length: VARIATIONS.length }, (_, i) => i)
        .filter(i => i !== variationIndex)
      
      const nextIndex = remaining.length > 0
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : 0
      setVariationIndex(nextIndex)
      setHistory([nextIndex])
    } else {
      const nextIndex = unused[Math.floor(Math.random() * unused.length)]
      setVariationIndex(nextIndex)
      setHistory(prev => [...prev, nextIndex])
    }
  }

  const shuffleDelivery = () => {
    if (DELIVERY_VARIATIONS.length <= 1) return

    const unused = Array.from({ length: DELIVERY_VARIATIONS.length }, (_, i) => i)
      .filter(i => !deliveryHistory.includes(i))

    if (unused.length === 0) {
      const remaining = Array.from({ length: DELIVERY_VARIATIONS.length }, (_, i) => i)
        .filter(i => i !== deliveryIndex)
      
      const nextIndex = remaining.length > 0
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : 0
      setDeliveryIndex(nextIndex)
      setDeliveryHistory([nextIndex])
    } else {
      const nextIndex = unused[Math.floor(Math.random() * unused.length)]
      setDeliveryIndex(nextIndex)
      setDeliveryHistory(prev => [...prev, nextIndex])
    }
  }

  const copyToClipboard = async () => {
    if (isOverLimit) return
    try {
      await navigator.clipboard.writeText(currentMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyDeliveryToClipboard = async () => {
    if (isDeliveryOverLimit) return
    try {
      await navigator.clipboard.writeText(currentDeliveryMessage)
      setDeliveryCopied(true)
      setTimeout(() => setDeliveryCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!todayMenu) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-3.5 w-16 bg-bg-border rounded" />
        <div className="h-20 bg-bg-border rounded" />
        <div className="h-20 bg-bg-border rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
          <Megaphone size={12} className="text-accent" />
          Announce
        </h2>
      </div>

      {/* Dine-in / Regular Announce */}
      <div className="bg-bg-primary rounded p-2 space-y-1.5 border border-bg-border/30">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-accent uppercase tracking-wider">Dine-in / Regular</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-text-secondary">Prog: {history.length}/{VARIATIONS.length}</span>
            <span className={`text-[9px] font-mono ${isOverLimit ? 'text-error' : 'text-success'}`}>{charCount}/250</span>
            <button onClick={shuffleVariation} className="p-0.5 hover:bg-bg-border rounded" title="Random">
              <Shuffle size={10} className="text-text-secondary" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-text-primary leading-relaxed break-words line-clamp-2">{currentMessage}</p>
        <button onClick={copyToClipboard} disabled={isOverLimit}
          className={`w-full py-1 px-2 rounded text-[10px] font-medium flex items-center justify-center gap-1.5 ${isOverLimit ? 'bg-bg-border text-text-secondary' : copied ? 'bg-success text-bg-primary' : 'bg-accent text-bg-primary'}`}>
          {copied ? <><Check size={10} weight="bold" /> Copied!</> : <><Copy size={10} /> Copy</>}
        </button>
      </div>

      {/* Delivery / Cloud Kitchen Announce */}
      <div className="bg-bg-primary rounded p-2 space-y-1.5 border border-bg-border/30">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-accent uppercase tracking-wider">Delivery / Cloud Kitchen</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-text-secondary">Prog: {deliveryHistory.length}/{DELIVERY_VARIATIONS.length}</span>
            <span className={`text-[9px] font-mono ${isDeliveryOverLimit ? 'text-error' : 'text-success'}`}>{deliveryCharCount}/250</span>
            <button onClick={shuffleDelivery} className="p-0.5 hover:bg-bg-border rounded" title="Random">
              <Shuffle size={10} className="text-text-secondary" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-text-primary leading-relaxed break-words line-clamp-2">{currentDeliveryMessage}</p>
        <button onClick={copyDeliveryToClipboard} disabled={isDeliveryOverLimit}
          className={`w-full py-1 px-2 rounded text-[10px] font-medium flex items-center justify-center gap-1.5 ${isDeliveryOverLimit ? 'bg-bg-border text-text-secondary' : deliveryCopied ? 'bg-success text-bg-primary' : 'bg-accent text-bg-primary'}`}>
          {deliveryCopied ? <><Check size={10} weight="bold" /> Copied!</> : <><Copy size={10} /> Copy</>}
        </button>
      </div>
    </div>
  )
}
