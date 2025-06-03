# asaas.py
import requests
import os

ASAAS_BASE_URL = "https://www.asaas.com/api/v3"
API_KEY = os.getenv("ASAAS_API_KEY")

def create_pix_charge(customer_id, value, due_date, pedido_id):
    headers = {
        "accept": "application/json",
        "access_token": API_KEY
    }

    payload = {
        "customer": customer_id,
        "billingType": "PIX",
        "value": value,
        "dueDate": due_date.strftime("%Y-%m-%d"),
        "description": f"Pedido #{pedido_id}",
        "externalReference": str(pedido_id),
        "callback": os.getenv("BASE_URL") + "webhook/asaas"
    }

    response = requests.post(f"{ASAAS_BASE_URL}/payments", json=payload, headers=headers)
    return response.json()