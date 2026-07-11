'use client'

import { useState, useEffect } from 'react'
import { Megaphone, Copy, Check, Shuffle } from '@phosphor-icons/react'
import { getTodayMenuData } from '@/lib/clientDb'

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

export default function Announce() {
  const [menu, setMenu] = useState<{
    today: { food: string; drink: string }
  } | null>(null)
  const [variationIndex, setVariationIndex] = useState(0)
  const [history, setHistory] = useState<number[]>([0])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const data = getTodayMenuData()
      setMenu(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const currentMessage = menu?.today
    ? VARIATIONS[variationIndex](menu.today.food.toUpperCase(), menu.today.drink.toUpperCase())
    : ''

  const charCount = currentMessage.length
  const isOverLimit = charCount > 250

  const shuffleVariation = () => {
    if (VARIATIONS.length <= 1) return

    // Find indices that haven't been shown in the current shuffle cycle
    const unused = Array.from({ length: VARIATIONS.length }, (_, i) => i)
      .filter(i => !history.includes(i))

    if (unused.length === 0) {
      // All variation messages have been shown once. Reset the pool.
      // To prevent repeating the current message immediately, filter it out.
      const remaining = Array.from({ length: VARIATIONS.length }, (_, i) => i)
        .filter(i => i !== variationIndex)
      
      const nextIndex = remaining.length > 0
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : 0
      setVariationIndex(nextIndex)
      setHistory([nextIndex])
    } else {
      // Pick a random index from the unused ones
      const nextIndex = unused[Math.floor(Math.random() * unused.length)]
      setVariationIndex(nextIndex)
      setHistory(prev => [...prev, nextIndex])
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

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-3 w-16 bg-bg-border rounded" />
        <div className="h-10 bg-bg-border rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
          <Megaphone size={12} className="text-accent" />
          Announce
        </h2>
        <button onClick={shuffleVariation} className="p-1 hover:bg-bg-border rounded" title="Random">
          <Shuffle size={12} className="text-text-secondary" />
        </button>
      </div>

      <div className="bg-bg-primary rounded p-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">Progress: {history.length}/{VARIATIONS.length}</span>
          <span className={`text-[10px] font-mono ${isOverLimit ? 'text-error' : 'text-success'}`}>{charCount}/250</span>
        </div>
        <p className="text-[10px] text-text-primary leading-relaxed break-words line-clamp-2">{currentMessage}</p>
        <button onClick={copyToClipboard} disabled={isOverLimit}
          className={`w-full py-1 px-2 rounded text-[10px] font-medium flex items-center justify-center gap-1.5 ${isOverLimit ? 'bg-bg-border text-text-secondary' : copied ? 'bg-success text-bg-primary' : 'bg-accent text-bg-primary'}`}>
          {copied ? <><Check size={10} weight="bold" /> Copied!</> : <><Copy size={10} /> Copy</>}
        </button>
      </div>
    </div>
  )
}
