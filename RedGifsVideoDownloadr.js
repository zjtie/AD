// ==UserScript==
// @name         RedGifs Video Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a prominent video download button to specific divs under previewFeed on RedGifs
// @author       Grok
// @match        https://www.redgifs.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- 已处理元素记录 ---
    const processedElements = new WeakSet();

    // --- 添加下载按钮的核心函数 ---
    function addDownloadButtons() {
        const previewFeeds = document.querySelectorAll('div.previewFeed');
        
        previewFeeds.forEach(feed => {
            const targetDivs = feed.querySelectorAll('div[id]:not(.processed)');
            
            targetDivs.forEach(target => {
                if (processedElements.has(target)) return;

                // 检查是否存在 ImageGif-Thumbnail，如果有则跳过
                const thumbnailImg = target.querySelector('img.ImageGif-Thumbnail');
                if (thumbnailImg) return;

                // 创建下载按钮
                const downloadButton = document.createElement('button');
                downloadButton.textContent = '视频下载';
                
                // 设置明显样式
                downloadButton.style.position = 'absolute';
                downloadButton.style.top = '10px';
                downloadButton.style.right = '10px';
                downloadButton.style.zIndex = '1000';
                downloadButton.style.backgroundColor = '#4287f5'; // 蓝色背景
                downloadButton.style.color = 'white';
                downloadButton.style.padding = '5px 10px';
                downloadButton.style.border = 'none';
                downloadButton.style.borderRadius = '4px';
                downloadButton.style.cursor = 'pointer';
                downloadButton.style.fontWeight = 'bold';

                // 点击触发下载
                downloadButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const posterImg = target.querySelector('img.Player-Poster');
                    if (posterImg && posterImg.src) {
                        const originalLink = posterImg.src;
                        const modifiedLink = originalLink.replace('.jpg', '.m4s');
                        
                        // 触发下载
                        const a = document.createElement('a');
                        a.href = modifiedLink;
                        a.download = '';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        
                        // 成功反馈
                        downloadButton.textContent = '下载已触发';
                        downloadButton.style.backgroundColor = '#44ff44'; // 绿色
                        setTimeout(() => {
                            downloadButton.textContent = '视频下载';
                            downloadButton.style.backgroundColor = '#4287f5';
                        }, 2000);
                    } else {
                        // 无链接反馈
                        downloadButton.textContent = '无视频';
                        downloadButton.style.backgroundColor = '#666666'; // 灰色
                        setTimeout(() => {
                            downloadButton.textContent = '视频下载';
                            downloadButton.style.backgroundColor = '#4287f5';
                        }, 2000);
                    }
                });

                // 添加按钮到目标 div
                target.style.position = 'relative';
                target.appendChild(downloadButton);
                processedElements.add(target);
                target.classList.add('processed');
            });
        });
    }

    // --- 初始加载 ---
    setTimeout(() => {
        console.log('首次加载按钮');
        addDownloadButtons();
    }, 5000);

    // --- 滚动刷新 ---
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            console.log('滚动触发更新');
            addDownloadButtons();
        }, 500);
    });

    // --- DOM 变化监控 ---
    const observer = new MutationObserver(() => {
        console.log('DOM变化检测');
        addDownloadButtons();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
