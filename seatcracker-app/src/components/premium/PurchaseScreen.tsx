"use client";

import React, { useState } from "react";
import styles from "./PurchaseScreen.module.css";
import { ExamConfig } from "@/config/examConfig";
import { User } from "firebase/auth";

interface Props {
  config: ExamConfig;
  user: User | null | any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PurchaseScreen({ config, user, onClose, onSuccess }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in to purchase premium access.");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Step 1: Create Order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: config.price,
          examId: config.examId,
          userId: user.uid || user.id,
        }),
      });

      if (!orderRes.ok) {
        const errBody = await orderRes.text();
        let errMsg = "Order creation failed";
        try {
          const parsed = JSON.parse(errBody);
          errMsg = parsed.error || errMsg;
        } catch (e) {
          errMsg = errBody || errMsg;
        }
        throw new Error(errMsg);
      }

      const orderData = await orderRes.json();

      // Step 2: Open Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SeatCracker",
        description: `${config.examName} Premium Access`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Step 3: Verify Payment
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              examId: config.examId,
              userId: user.uid || user.id,
              amount: config.price
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("🎉 Premium Unlocked! All days are now accessible.");
            onSuccess();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(error.message || "An error occurred during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeX} onClick={onClose}>×</button>
        <div className={styles.examName}>{config.examName} Premium</div>
        <h2 className={styles.title}>Unlock Full Access</h2>

        <div className={styles.benefitList}>
          <div className={styles.benefitItem}><span className={styles.check}>✅</span> Best Practice: All 10 Days Unlocked</div>
          <div className={styles.benefitItem}><span className={styles.check}>✅</span> Full Paper 1 + Paper 2 Each Day</div>
          <div className={styles.benefitItem}><span className={styles.check}>✅</span> Detailed Percentile & Rank Analysis</div>
          <div className={styles.benefitItem}><span className={styles.check}>✅</span> Category Qualification Table</div>
          <div className={styles.benefitItem}><span className={styles.check}>✅</span> 10-Day Progress Tracking</div>
        </div>

        <div className={styles.priceContainer}>
          <div className={styles.price}>₹{config.price}</div>
          <span className={styles.priceSub}>One-time payment • 1 Year Access</span>
        </div>

        <button 
          className={styles.payBtn} 
          onClick={handlePayment} 
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Unlock ${config.examName} Now`}
        </button>

        <button className={styles.laterBtn} onClick={onClose}>Maybe Later</button>
      </div>
    </div>
  );
}
