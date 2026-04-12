import os
import json
import time
import requests
from typing import List, Dict, Any

# ── CONFIGURATION & FAILOVER ───────────────────────────────────
# Load keys from environment
KEY_1 = "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" # Primary
KEY_2 = "YOUR_SECOND_KEY_HERE" # User should update in .env.local

class GroqClient:
    def __init__(self, keys: List[str]):
        self.keys = [k for k in keys if k and "YOUR_SECOND" not in k]
        self.current_key_index = 0
        
    def get_current_key(self):
        if not self.keys:
            raise ValueError("No valid API keys found. Please update .env.local")
        return self.keys[self.current_key_index]

    def switch_key(self):
        if len(self.keys) > 1:
            self.current_key_index = (self.current_key_index + 1) % len(self.keys)
            print(f"⚠️ Failover detected. Switching to Key {self.current_key_index + 1}...")
            return True
        return False

    def chat_completion(self, model: str, messages: List[Dict], temperature: float = 0.7):
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        while True:
            headers = {
                "Authorization": f"Bearer {self.get_current_key()}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "response_format": {"type": "json_object"}
            }
            
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=30)
                
                if response.status_code == 200:
                    return response.json()
                
                # Check for rate limit or auth errors
                if response.status_code in [401, 429, 500, 503]:
                    print(f"❌ Error {response.status_code}: {response.text}")
                    if "rate_limit" in response.text.lower():
                        # Cooldown logic: If rate limited, wait 1 minute if no fallback, 
                        # or switch immediately if fallback exists.
                        if self.switch_key():
                            continue
                        else:
                            print("⏳ Rate limited on all keys. Waiting 60 seconds...")
                            time.sleep(60)
                            continue
                    
                    if self.switch_key():
                        continue
                        
                response.raise_for_status()
                
            except Exception as e:
                print(f"🚨 Connection Error: {str(e)}")
                if self.switch_key():
                    continue
                raise

# ── TOKEN ESTIMATION (Cheapest Options) ──────────────────────────
def estimate_cost(num_roadmaps: int):
    # Groq Prices: Llama 3 8B ($0.05 / 1M), Llama 3 70B ($0.59 / 1M)
    rate_8b = 0.05 / 1_000_000
    rate_70b = 0.59 / 1_000_000
    
    # 1 Roadmap = ~10,000 tokens (Output heavy)
    tokens = 10_000
    
    cost_8b = rate_8b * tokens * num_roadmaps
    cost_70b = rate_70b * tokens * num_roadmaps
    
    print("-" * 50)
    print(f"💰 Roadmap Cost for {num_roadmaps} Generations:")
    print(f"Llama 3 8B  (Fastest/Cheapest): ${cost_8b:.6f} (~{cost_8b*83:.4f} INR)")
    print(f"Llama 3 70B (High Intelligence): ${cost_70b:.6f} (~{cost_70b*83:.3f} INR)")
    print("-" * 50)

if __name__ == "__main__":
    estimate_cost(1)
    print("📋 System Ready for Failover.")
