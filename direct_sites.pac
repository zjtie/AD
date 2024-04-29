function FindProxyForURL(url, host) {
    // 直连的网站列表
    var directSites = [
        "www.baidu.com"
    ];

    // 如果 host 在直连列表中，则直连
    for (var i = 0; i < directSites.length; i++) {
        if (dnsDomainIs(host, directSites[i])) {
            return "DIRECT";
        }
    }

    // 其余情况使用代理
    return proxy;
}
