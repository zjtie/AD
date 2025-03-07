// ==UserScript==
// @name         RedGifs Enhanced Link Copier
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add copy link and IDM download buttons next to GifPreview_isVertical divs on RedGifs
// @author       Grok
// @match        https://www.redgifs.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置存储 ---
    const useIDM = GM_getValue('useIDM', false); // 默认关闭 IDM 功能

    // --- Violentmonkey 菜单 ---
    GM_registerMenuCommand(useIDM ? '关闭 IDM 下载' : '启用 IDM 下载', () => {
        const newValue = !GM_getValue('useIDM', false);
        GM_setValue('useIDM', newValue);
        alert(`IDM 下载功能已${newValue ? '启用' : '关闭'}，请刷新页面生效`);
    }, 'I');

    // --- 已处理元素记录 ---
    const processedElements = new WeakSet();

    // --- 添加按钮的核心函数 ---
    function addButtons() {
        const previewDivs = document.querySelectorAll('div.GifPreview_isVertical:not(.processed)');
        
        previewDivs.forEach(preview => {
            if (processedElements.has(preview)) return;

            // 创建复制链接按钮
            const copyButton = createButton('复制链接', '#ff4444');
            
            // 点击复制链接
            copyButton.addEventListener('click', function(e) {
                e.preventDefault();
                const link = getModifiedLink(preview);
                if (link) {
                    navigator.clipboard.writeText(link)
                        .then(() => showSuccess(copyButton))
                        .catch(err => showError(copyButton, err));
                } else {
                    showNoLink(copyButton);
                }
            });

            // 如果启用 IDM，添加下载按钮
            if (GM_getValue('useIDM', false)) {
                const downloadButton = createButton('IDM 下载', '#4287f5');
                
                // 点击触发 IDM 下载
                downloadButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const link = getModifiedLink(preview);
                    if (link) {
                        // 通过创建临时 a 标签触发 IDM
                        const a = document.createElement('a');
                        a.href = link;
                        a.download = '';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        showSuccess(downloadButton, '下载已触发');
                    } else {
                        showNoLink(downloadButton);
                    }
                });
                
                preview.appendChild(downloadButton);
            }

            // 添加按钮到页面
            preview.style.position = 'relative';
            preview.appendChild(copyButton);
            processedElements.add(preview);
            preview.classList.add('processed');
        });
    }

    // --- 创建按钮的辅助函数 ---
    function createButton(text, bgColor) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'absolute';
        button.style.top = text === '复制链接' ? '10px' : '40px'; // 堆叠排列
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        return button;
    }

    // --- 获取处理后的链接 ---
    function getModifiedLink(preview) {
        const posterImg = preview.querySelector('img.Player-Poster');
        return posterImg && posterImg.src ? posterImg.src.replace('.jpg', '.m4s') : null;
    }

    // --- 显示成功反馈 ---
    function showSuccess(button, text = '已复制!') {
        button.textContent = text;
        button.style.backgroundColor = '#44ff44';
        setTimeout(() => {
            button.textContent = button === copyButton ? '复制链接' : 'IDM 下载';
            button.style.backgroundColor = button === copyButton ? '#ff4444' : '#4287f5';
        }, 2000);
    }

    // --- 显示错误反馈 ---
    function showError(button, err) {
        console.error('操作失败:', err);
        button.textContent = '失败';
        button.style.backgroundColor = '#444444';
        setTimeout(() => {
            button.textContent = button === copyButton ? '复制链接' : 'IDM 下载';
            button.style.backgroundColor = button === copyButton ? '#ff4444' : '#4287f5';
        }, 2000);
    }

    // --- 显示无链接提示 ---
    function showNoLink(button) {
        button.textContent = '无链接';
        button.style.backgroundColor = '#666666';
        setTimeout(() => {
            button.textContent = button === copyButton ? '复制链接' : 'IDM 下载';
            button.style.backgroundColor = button === copyButton ? '#ff4444' : '#4287f5';
        }, 2000);
    }

    // --- 初始加载 ---
    setTimeout(() => {
        console.log('首次加载按钮');
        addButtons();
    }, 5000);

    // --- 滚动刷新 ---
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            console.log('滚动触发更新');
            addButtons();
        }, 500);
    });

    // --- DOM 变化监控 ---
    const observer = new MutationObserver(() => {
        console.log('DOM变化检测');
        addButtons();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
