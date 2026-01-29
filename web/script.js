// 菜品数据
const menuData = [
    {
        id: 1,
        name: '宫保鸡丁',
        price: 38,
        category: 'hot',
        image: 'https://via.placeholder.com/200x120/ff6b6b/ffffff?text=宫保鸡丁'
    },
    {
        id: 2,
        name: '鱼香肉丝',
        price: 32,
        category: 'hot',
        image: 'https://via.placeholder.com/200x120/4ecdc4/ffffff?text=鱼香肉丝'
    },
    {
        id: 3,
        name: '麻婆豆腐',
        price: 28,
        category: 'hot',
        image: 'https://via.placeholder.com/200x120/45b7d1/ffffff?text=麻婆豆腐'
    },
    {
        id: 4,
        name: '水煮鱼',
        price: 68,
        category: 'hot',
        image: 'https://via.placeholder.com/200x120/96ceb4/ffffff?text=水煮鱼'
    },
    {
        id: 5,
        name: '拍黄瓜',
        price: 18,
        category: 'cold',
        image: 'https://via.placeholder.com/200x120/ffeaa7/000000?text=拍黄瓜'
    },
    {
        id: 6,
        name: '凉拌西红柿',
        price: 15,
        category: 'cold',
        image: 'https://via.placeholder.com/200x120/dda0dd/ffffff?text=凉拌西红柿'
    },
    {
        id: 7,
        name: '糖醋排骨',
        price: 48,
        category: 'hot',
        image: 'https://via.placeholder.com/200x120/98d8c8/ffffff?text=糖醋排骨'
    },
    {
        id: 8,
        name: '番茄鸡蛋汤',
        price: 22,
        category: 'soup',
        image: 'https://via.placeholder.com/200x120/f7dc6f/000000?text=番茄鸡蛋汤'
    },
    {
        id: 9,
        name: '酸辣汤',
        price: 20,
        category: 'soup',
        image: 'https://via.placeholder.com/200x120/bb8fce/ffffff?text=酸辣汤'
    },
    {
        id: 10,
        name: '可乐',
        price: 10,
        category: 'drink',
        image: 'https://via.placeholder.com/200x120/85c1e9/ffffff?text=可乐'
    },
    {
        id: 11,
        name: '雪碧',
        price: 10,
        category: 'drink',
        image: 'https://via.placeholder.com/200x120/82e0aa/000000?text=雪碧'
    },
    {
        id: 12,
        name: '啤酒',
        price: 15,
        category: 'drink',
        image: 'https://via.placeholder.com/200x120/f1948a/ffffff?text=啤酒'
    }
];

// 订单数据
let orderItems = [];

// DOM元素
const menuItemsContainer = document.getElementById('menuItems');
const categoryBtns = document.querySelectorAll('.category-btn');
const orderList = document.getElementById('orderList');
const totalPriceElement = document.querySelector('.total-price');
const submitBtn = document.getElementById('submitOrder');

// 初始化页面
function init() {
    renderMenu();
    renderOrder();
    
    // 分类按钮事件监听
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryChange);
    });
    
    // 提交订单事件监听
    submitBtn.addEventListener('click', handleSubmitOrder);
}

// 渲染菜单
function renderMenu(category = 'all') {
    menuItemsContainer.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        const menuItem = createMenuItem(item);
        menuItemsContainer.appendChild(menuItem);
    });
}

// 创建菜单项元素
function createMenuItem(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    
    const orderItem = orderItems.find(oi => oi.id === item.id);
    const quantity = orderItem ? orderItem.quantity : 0;
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <div class="price">¥${item.price.toFixed(2)}</div>
        <div class="btn-group">
            <button class="decrease" data-id="${item.id}">-</button>
            <span class="quantity">${quantity}</span>
            <button class="increase" data-id="${item.id}">+</button>
        </div>
    `;
    
    // 添加事件监听
    div.querySelector('.increase').addEventListener('click', () => handleQuantityChange(item.id, 1));
    div.querySelector('.decrease').addEventListener('click', () => handleQuantityChange(item.id, -1));
    
    return div;
}

// 处理数量变化
function handleQuantityChange(itemId, change) {
    const menuItem = menuData.find(item => item.id === itemId);
    const existingOrderItemIndex = orderItems.findIndex(item => item.id === itemId);
    
    if (change > 0) {
        // 增加数量
        if (existingOrderItemIndex >= 0) {
            orderItems[existingOrderItemIndex].quantity += 1;
        } else {
            orderItems.push({
                ...menuItem,
                quantity: 1
            });
        }
    } else {
        // 减少数量
        if (existingOrderItemIndex >= 0) {
            if (orderItems[existingOrderItemIndex].quantity > 1) {
                orderItems[existingOrderItemIndex].quantity -= 1;
            } else {
                orderItems.splice(existingOrderItemIndex, 1);
            }
        }
    }
    
    // 更新UI
    renderMenu(getCurrentCategory());
    renderOrder();
}

// 处理分类变化
function handleCategoryChange(e) {
    // 移除所有激活状态
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    
    // 添加当前激活状态
    e.target.classList.add('active');
    
    // 渲染对应分类的菜单
    const category = e.target.dataset.category;
    renderMenu(category);
}

// 获取当前分类
function getCurrentCategory() {
    const activeBtn = document.querySelector('.category-btn.active');
    return activeBtn ? activeBtn.dataset.category : 'all';
}

// 渲染订单
function renderOrder() {
    orderList.innerHTML = '';
    
    if (orderItems.length === 0) {
        orderList.innerHTML = '<p class="empty-order">暂无订单</p>';
        updateTotalPrice();
        return;
    }
    
    orderItems.forEach(item => {
        const orderItem = createOrderItem(item);
        orderList.appendChild(orderItem);
    });
    
    updateTotalPrice();
}

// 创建订单项元素
function createOrderItem(item) {
    const div = document.createElement('div');
    div.className = 'order-item';
    
    const subtotal = (item.price * item.quantity).toFixed(2);
    
    div.innerHTML = `
        <div class="order-item-info">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-details">
                <span>¥${item.price.toFixed(2)}/份</span>
                <span>x${item.quantity}</span>
                <span>小计: ¥${subtotal}</span>
            </div>
        </div>
        <div class="order-item-actions">
            <button class="order-decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="order-increase" data-id="${item.id}">+</button>
        </div>
    `;
    
    // 添加事件监听
    div.querySelector('.order-increase').addEventListener('click', () => handleQuantityChange(item.id, 1));
    div.querySelector('.order-decrease').addEventListener('click', () => handleQuantityChange(item.id, -1));
    
    return div;
}

// 更新总价
function updateTotalPrice() {
    const total = orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    totalPriceElement.textContent = `¥${total.toFixed(2)}`;
}

// 保存订单到本地存储
function saveOrderToLocal(order) {
    // 从本地存储获取现有订单
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    // 保存回本地存储
    localStorage.setItem('orders', JSON.stringify(orders));
    return true;
}

// 处理提交订单
function handleSubmitOrder() {
    if (orderItems.length === 0) {
        alert('请先添加菜品到订单');
        return;
    }
    
    const tableNumber = document.getElementById('tableSelect').value;
    
    const orderData = {
        order_id: `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        table_number: tableNumber,
        items: orderItems,
        total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toLocaleString('zh-CN'),
        status: 'pending'
    };
    
    // 保存订单到本地存储
    saveOrderToLocal(orderData);
    
    // 模拟微信通知
    simulateWechatNotification(orderData);
    
    alert(`订单提交成功！\n订单号：${orderData.order_id}\n桌号：${tableNumber}\n订单金额：¥${orderData.total.toFixed(2)}\n\n感谢您的点餐！`);
    
    // 清空订单
    orderItems = [];
    renderMenu();
    renderOrder();
}

// 模拟微信通知
function simulateWechatNotification(order) {
    console.log('=== 微信通知 ===');
    console.log(`新订单来了！`);
    console.log(`订单号：${order.order_id}`);
    console.log(`桌号：${order.table_number}号桌`);
    console.log(`时间：${order.timestamp}`);
    console.log(`金额：¥${order.total.toFixed(2)}`);
    console.log('================');
    
    // 可以在这里添加实际的微信通知API调用
    // 例如：调用企业微信机器人API发送消息
    // sendWechatMessage(order);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);