from flask import Flask, request, jsonify, send_from_directory
import json
import os
import time

app = Flask(__name__)

# 订单存储文件
ORDERS_FILE = 'orders.json'

# 初始化订单文件
if not os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False, indent=2)

# 读取所有订单
def get_orders():
    with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

# 保存订单
def save_order(order):
    orders = get_orders()
    orders.append(order)
    with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(orders, f, ensure_ascii=False, indent=2)
    return True

# 静态文件路由
@app.route('/<path:filename>')
def static_file(filename):
    return send_from_directory('.', filename)

# 根路径路由
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# 提交订单路由
@app.route('/api/submit-order', methods=['POST'])
def submit_order():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': '无效的订单数据'}), 400
        
        # 生成订单ID和时间
        order = {
            'order_id': f"ORDER_{int(time.time())}_{len(get_orders()) + 1}",
            'table_number': data.get('tableNumber'),
            'items': data.get('items', []),
            'total': data.get('total', 0),
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'pending'
        }
        
        # 保存订单
        save_order(order)
        
        # 这里可以添加微信通知逻辑
        # send_wechat_notification(order)
        
        return jsonify({'success': True, 'message': '订单提交成功', 'order_id': order['order_id']})
    except Exception as e:
        return jsonify({'success': False, 'message': f'服务器错误: {str(e)}'}), 500

# 后台管理API - 获取所有订单
@app.route('/api/orders', methods=['GET'])
def get_all_orders():
    try:
        orders = get_orders()
        return jsonify({'success': True, 'orders': orders})
    except Exception as e:
        return jsonify({'success': False, 'message': f'服务器错误: {str(e)}'}), 500

# 微信通知功能（示例，需要配置微信公众号或企业微信）
def send_wechat_notification(order):
    # 这里是微信通知的示例代码
    # 实际使用时需要配置微信API
    print(f"微信通知：新订单来了！订单号：{order['order_id']}，桌号：{order['table_number']}号桌，金额：¥{order['total']}")
    # 实际实现可能需要使用requests库调用微信API

if __name__ == '__main__':
    print("服务器启动成功！")
    print("点餐页面：http://localhost:5000")
    print("后台管理：http://localhost:5000/admin.html")
    print("API文档：http://localhost:5000/api/orders")
    app.run(host='127.0.0.1', port=5000, debug=True)
