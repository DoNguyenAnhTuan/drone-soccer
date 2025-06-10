import requests

url = "https://www.nsmo.vn/HeThongDien/GetChartNguonDien"
headers = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://www.nsmo.vn/HeThongDien",
}
params = {
    "day": "12/05/2025"  # KHÔNG mã hóa %2F — requests tự lo
}

response = requests.get(url, headers=headers, params=params, verify=False)
print(response.status_code)
print(response.text)
