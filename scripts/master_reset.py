import os
import requests

url = "https://f8224a53-b155-4576-b4ef-bf2eb4b7f6bf.supabase.co/rest/v1/user_active_plans"
headers = {
    "apikey": os.environ.get("SUPABASE_KEY", ""),
    "Authorization": f"Bearer {os.environ.get('SUPABASE_KEY', '')}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Marcar todos os planos como abandonados para forçar reset
response = requests.patch(url, headers=headers, params={"status": "eq.active"}, json={"status": "abandoned"})
print(f"Reset Status: {response.status_code}")
