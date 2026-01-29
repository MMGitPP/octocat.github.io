import http.server
import socketserver
import json
import os
import time

PORT = 8000
ORDERS_FILE = 'orders.json'

# 初始化订单文件
if not os.path.exists(ORDERS_FILE):
    with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False, indent=2)

# 自定义请求处理器
class MyHandler(http.server.SimpleHTTPRequestHandler):
    # 读取所有订单
    def get_orders(self):
        with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)

    # 保存订单
    def save_order(self, order):
        orders = self.get_orders()
        orders.append(order)
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(orders, f, ensure_ascii=False, indent=2)
        return True

    # 处理POST请求
    def do_POST(self):
        if self.path == '/api/submit-order':
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            order_data = json.loads(post_data.decode('utf-8'))
            
            # 生成订单ID和时间
            order = {
                'order_id': f"ORDER_{int(time.time())}_{len(self.get_orders()) + 1}",
                'table_number': order_data.get('tableNumber'),
                'items': order_data.get('items', []),
                'total': order_data.get('total', 0),
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'status': 'pending'
            }
            
            # 保存订单
            self.save_order(order)
            
            # 返回响应
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                'success': True,
                'message': '订单提交成功',
                'order_id': order['order_id']
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            return
        
        # 其他POST请求
        self.send_response(404)
        self.end_headers()
        self.wfile.write(b'Not Found')
    
    # 处理GET请求
    def do_GET(self):
        # 处理API请求
        if self.path == '/api/orders':
            orders = self.get_orders()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                'success': True,
                'orders': orders
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            return
        
        # 处理根路径请求
        if self.path == '/':
            self.path = '/index.html'
        
        # 调用父类的do_GET处理静态文件
        try:
            super().do_GET()
        except Exception as e:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'File Not Found')

# 启动服务器
with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"服务器启动成功！")
    print(f"点餐页面：http://localhost:{PORT}")
    print(f"后台管理：http://localhost:{PORT}/admin.html")
    print(f"API文档：http://localhost:{PORT}/api/orders")
    print(f"按 Ctrl+C 停止服务器")
    httpd.serve_forever()