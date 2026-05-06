"use client";
import React, { useEffect } from "react";
import { useRealtimePayments } from "../../hooks/useRealtimePayments";
import confetti from "canvas-confetti";

export default function SaleAlert() {
  const { latestPayment } = useRealtimePayments();

  useEffect(() => {
    if (latestPayment) {
      // Play sound
      const audio = new Audio('/sounds/kaching.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed', e));

      // Show confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#6366f1']
      });

      // Show toast
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.background = 'rgba(16, 185, 129, 0.9)';
      toast.style.color = '#fff';
      toast.style.padding = '16px 24px';
      toast.style.borderRadius = '12px';
      toast.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
      toast.style.zIndex = '9999';
      toast.style.fontWeight = '600';
      toast.style.backdropFilter = 'blur(10px)';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '12px';
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      toast.innerHTML = `
        <span style="font-size: 24px">💰</span>
        <div>
          <div style="font-size: 14px">New Premium Unlock!</div>
          <div style="font-size: 12px; opacity: 0.9">${latestPayment.exam_id?.toUpperCase()} — ₹${latestPayment.amount_paid || 0}</div>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      }, 100);

      setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 500);
      }, 5000);
    }
  }, [latestPayment]);

  return null;
}
