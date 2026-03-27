// ==UserScript==
// @name         移动端调试神器 (Eruda Injector)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  一键注入 Eruda 控制台，支持悬浮球点击和 F12 快捷键唤醒
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @icon         https://cdn.jsdelivr.net/npm/eruda/eruda.js
// ==/UserScript==

(function() {
    'use strict';

    // Eruda CDN 地址 (使用 jsDelivr 或 BootCDN)
    const ERUDA_SRC = '//cdn.jsdelivr.net/npm/eruda';
    
    let isErudaLoaded = false;

    /**
     * 核心函数：注入 Eruda 脚本
     */
    function loadEruda() {
        if (isErudaLoaded) {
            // 如果已加载，尝试重新初始化并显示
            if (typeof window.eruda !== 'undefined') {
                window.eruda.init();
                window.eruda.show();
            }
            return;
        }

        console.log('正在加载 Eruda 调试工具...');
        
        const script = document.createElement('script');
        script.src = ERUDA_SRC;
        script.crossOrigin = 'anonymous';
        
        script.onload = function() {
            isErudaLoaded = true;
            if (typeof window.eruda !== 'undefined') {
                // 初始化 Eruda，useShadowDom: true 可以防止样式冲突
                window.eruda.init({
                    useShadowDom: true
                });
                window.eruda.show();
                console.log('✅ Eruda 控制台已就绪');
            }
        };

        script.onerror = function() {
            console.error('❌ Eruda 加载失败，请检查网络连接或 CDN 是否被拦截');
        };

        document.body.appendChild(script);
    }

    /**
     * 功能 A：添加悬浮按钮 (适合手机端操作)
     */
    function createFloatingButton() {
        // 如果页面已有 iframe 或特殊结构，可能需要调整 z-index
        const btn = document.createElement('div');
        btn.innerHTML = '🛠️'; // 图标
        btn.title = '点击加载 Eruda 调试器';
        
        // 样式设置
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            backgroundColor: '#333',
            color: '#fff',
            borderRadius: '50%',
            textAlign: 'center',
            lineHeight: '50px',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: '2147483647', // 最高层级
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            userSelect: 'none',
            opacity: '0.8',
            transition: 'opacity 0.2s'
        });

        // 点击事件
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            loadEruda();
            // 点击后隐藏按钮，防止遮挡控制台
            btn.style.display = 'none';
        });

        document.body.appendChild(btn);
    }

    /**
     * 功能 B：监听快捷键 (适合电脑端或外接键盘)
     */
    document.addEventListener('keydown', function(e) {
        // 监听 F12 或 Ctrl+Shift+I
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
            e.preventDefault(); // 阻止浏览器默认行为（可选）
            loadEruda();
        }
    });

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 1. 创建悬浮球
        createFloatingButton();
        
        // 2. (可选) 如果你希望打开网页自动加载，取消下面这行的注释：
        // loadEruda(); 

    }

})();
