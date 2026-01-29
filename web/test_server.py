import requests
import time

def test_server():
    print("测试服务器连接...")
    base_url = 'http://127.0.0.1:5000'
    
    # 测试点餐页面
    try:
        response = requests.get(base_url, timeout=5)
        print(f"点餐页面测试结果: {response.status_code} - {response.reason}")
        print(f"响应内容长度: {len(response.text)} 字符")
    except Exception as e:
        print(f"点餐页面测试失败: {e}")
    
    time.sleep(1)
    
    # 测试后台管理页面
    try:
        response = requests.get(f'{base_url}/admin.html', timeout=5)
        print(f"后台管理页面测试结果: {response.status_code} - {response.reason}")
        print(f"响应内容长度: {len(response.text)} 字符")
    except Exception as e:
        print(f"后台管理页面测试失败: {e}")
    
    time.sleep(1)
    
    # 测试API - 获取订单列表
    try:
        response = requests.get(f'{base_url}/api/orders', timeout=5)
        print(f"获取订单API测试结果: {response.status_code} - {response.reason}")
        print(f"API响应: {response.json()}")
    except Exception as e:
        print(f"获取订单API测试失败: {e}")
    
    time.sleep(1)
    
    # 测试API - 提交订单
    try:
        test_order = {
            "tableNumber": "1",
            "items": [
                {"id": 1, "name": "宫保鸡丁", "price": 38, "quantity": 1}
            ],
            "total": 38,
            "timestamp": "2026-01-24 10:00:00"
        }
        response = requests.post(f'{base_url}/api/submit-order', json=test_order, timeout=5)
        print(f"提交订单API测试结果: {response.status_code} - {response.reason}")
        print(f"API响应: {response.json()}")
    except Exception as e:
        print(f"提交订单API测试失败: {e}")

if __name__ == "__main__":
    test_server()