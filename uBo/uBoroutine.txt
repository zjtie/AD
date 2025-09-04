#======社交平台=====================================================================================================

! 2023-04-13 https://discord.com
discord.com##.wrapper-2JEvo0

! 2024年6月27日 https://x.com
! 移除URL中的特定参数，以防止用户被跟踪
twitter.com,x.com##[data-testid="primaryColumn"] [data-testid="cellInnerDiv"] > div:has([data-testid$="-impression-pixel"]):remove()
twitter.com,x.com,~platform.twitter.com##+js(json-prune-xhr-response, data.home.home_timeline_urt.instructions.[].entries.[-].content.itemContent.promotedMetadata, , propsToMatch, url:/Home)
twitter.com,x.com,~platform.twitter.com##+js(json-prune-xhr-response, data.search_by_raw_query.search_timeline.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata, , propsToMatch, url:/SearchTimeline)
twitter.com,x.com,~platform.twitter.com##+js(json-prune-xhr-response, data.threaded_conversation_with_injections_v2.instructions.[].entries.[-].content.items.[].item.itemContent.promotedMetadata, , propsToMatch, url:/TweetDetail)
twitter.com,x.com,~platform.twitter.com##+js(json-prune-xhr-response, data.user.result.timeline_v2.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata, , propsToMatch, url:/UserTweets)
twitter.com,x.com,~platform.twitter.com##+js(json-prune-xhr-response, data.immersiveMedia.timeline.instructions.[].entries.[-].content.itemContent.promotedMetadata, , propsToMatch, url:/ImmersiveMedia)

x.com##script:has-text(/block/):remove()
x.com##noscript,#nonce-csp,.errorContainer:remove()
x.com##:matches-path(/home) .r-1h8ys4a
! 发帖


! 2024-08-03 https://www.reddit.com
||ad-delivery.net
||reddit.com/ads/*
||redditmedia.com/ads/*
||redditstatic.com/ads/*
||reddit.com/track/*
||redditmedia.com/track/*
||redditstatic.com/track/*

reddit.com###xpromo-bottom-sheet,create-post-entry-point-wrapper,shreddit-comments-page-ad,shreddit-comment-tree-ad,[data-part="advertise"]:remove()
! APP中打开，发布内容
reddit.com##.block.w-100.h-100+div:remove()
reddit.com##img[loading="lazy"]:remove-attr(style)
 ! 移除模糊样式
! reddit.com##script:remove()
reddit.com##[noun="about_reddit_menu"],[noun="advertise_menu"],[noun="reddit_pro_menu"],[noun="help_menu"],[noun="blog_menu"],[noun="careers_menu"],[noun="press_menu"]:remove()
reddit.com##[noun="content_policy_menu"],[noun="privacy_policy_menu"],[noun="user_agreement_menu"],[noun="accessibility_menu"]:remove()
reddit.com##[noun="advertise"],[noun="try_reddit_pro"],[noun="entrypoint"]:remove()


! 2024年5月3日 https://www.douyin.com 抖音
douyin.com^$header=user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.48 Safari/537.36
! douyin.com##script[crossorigin="anonymous"],script[nonce]:remove()
! douyin.com##script:has-text(/mark|_reactRetry|insertBefore|TeaAnalytics/):remove()
! ! mark 函数，用于 性能标记（Performance Mark），帮助开发者分析网页性能
! douyin.com##script:has-text(/setPageViewLog|getMultiWindowLogInfo/):remove()
! ! 网页数据收集、优化浏览体验 和 用户行为分析，可能涉及 埋点监测、页面日志记录和 Cookie 处理
! douyin.com##script:has-text(/unhandledrejection/):remove()
! ! 主要用于 性能监控、错误收集和数据埋点，可能涉及 页面性能分析、错误追踪和长任务检测。
! douyin.com##script:has-text(/Slardar/):remove()
! ! 用户反馈系统，它会在页面加载后 延迟 9 秒 添加一个 反馈按钮
! douyin.com##script:has-text(/SdkGlueInit/):remove()
! ! ✅API 请求监控：拦截特定 API 请求，可能用于 反作弊或数据分析。
! ! ✅ 验证码处理：动态加载验证码 SDK，确保安全验证机制正常运行。 
! ! ✅ 设备适配：根据 CPU 线程数和设备内存 调整参数，优化低端设备体验。 如果 CPU 线程数 ≤ 4 且 设备内存 ≤ 2GB
! ! ✅ 安全验证：加载 bdms.js 进行 数据加密、签名校验或反爬虫
! douyin.com##script:has-text(/sdk-glue/):remove()
! ! ✅ SDK 加载监控：跟踪 SDK 是否正确加载，检测 sdk-glue 相关脚本是否报错。 
! ! ✅ 错误收集：监听 error 事件，捕获 JavaScript 运行时错误，并上报到监控服务器。 
! ! ✅ 数据埋点：记录 window.location.href、timestamp 等信息，可能用于 用户行为分析。 
! ! ✅ 采样控制：通过 Math.random() 设定 数据采集比例，避免过多上报影响性能。
! douyin.com##script:has-text(/window.pageLog/):remove()
! ! ✅ 页面性能监测：收集 Largest Contentful Paint（LCP） 数据，优化页面加载速度。 
! ! ✅ 用户行为分析：监听 点击、按键、页面可见性变化，分析用户交互模式。 
! ! ✅ 数据埋点：存储 window.pageLog，可能用于 日志分析或 A/B 测试。 
! ! ✅ 优化 Web Vitals：LCP 是 Google 推荐的 Web Vitals 指标，影响 SEO 和用户体验
! ||lf-security.bytegoofy.com/obj/security-secsdk-gray/runtime_bundler_34.js
! ||lf3-cdn-tos.bytescm.com/obj/static/log-sdk/
! ! 字节跳动（ByteDance） 的 日志收集 SDK，用于 数据埋点、用户行为分析和错误监控
! douyin.com##:xpath(/html/body/div[2]/div[1]/div[3]/div/div[2]/div/div/pace-island)
! douyin.com##:xpath(/html/body/div[2]/div[1]/div[4]/div[1]/div[1]/header/div/div/div[2]/div/pace-island/div/div[position() <= 3])
! douyin.com##:xpath(/html/body/div[2]/div[1]/div[4]/div[1]/div[1]/header/div/div/div[2]/div/pace-island/div/div[4])
! !关于抖音， 充钻石|快捷访问|投稿|客户端|壁纸


douyin.com##.dZZJWTJL,.JdGgM3r6
,.Xu0nlrYh


! douyin.com##.mode-search div[id^="douyin-header-menu"] > div > div > div:has(a[download^="douyin-downloader"])
! douyin.com##.mode-search div:has(> div[data-e2e="something-button"] path[d="M18.404 19.018h-12v-1.5h12v1.5zM11.654 13.457v-8.19h1.5v8.19l3.22-3.22 1.06 1.061-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5 1.06-1.06 3.22 3.22z"])
! ! 搜索页专属规则 屏蔽搜索结果页面的客户端下载提示
! ouyin.com##.mode-live #douyin-header pace-island[id^="island"] > div[class]:has(div[data-e2e="something-button"]) .dy-tip-container:has(a)
! douyin.com##.mode-live #douyin-header pace-island[id^="island"] > div[class] span:has(a[download][href*="client"])
! douyin.com##.mode-live .semi-portal-inner .semi-dropdown-content .semi-dropdown-item:has(a[download][href*="client"])
! ! 在观看抖音直播时生效，用于屏蔽直播页面右上角的客户端提



tiktok.com##[data-e2e="nav-upload"],#top-right-action-bar,[data-e2e="LivePage-GetCoin"],.css-behvuc-DivModalContainer,[class^="e1dsngob"],.matrix-smart-wrapper


patreon.com##a:remove-attr(target)



! 2023-02-11 https://www.douban.com 豆瓣
douban.com##.nav-open-app,.talion-nav-footer,.download-app
douban.com##[rel*="icon"],#footer,.lnk-doubanapp
douban.com##script:has-text(global)

! 2023-09-13 https://www.bilibili.com 哔哩哔哩
bilibili.com##li.v-popover-wrap:has-text(/游戏中心|会员购|赛事|下载客户端|大会员|创作|投稿/)
bilibili.com##.adblock-tips

! 2022-11-20 https://fuliba2023.net 福利吧
fuliba2023.net##meta,[rel*="icon"],body>*:not(section),.sidebar,div.title,.shares,.post-actions,#respond

! 2023-12-15 https://www.jdlingyu.com 绝对领域
jdlingyu.com##footer,.aside-container,section#b2-widget-html-11,section#b2-widget-html-20,.comments-box,.single-top-html,.single-bottom-html,#b2-widget-user-3,#b2-widget-html-10
jdlingyu.com##.top-submit,#ym-menu,#top-menu-ul>li:nth-of-type(7),#home-row-gzh,#home-row-wzq .widget-area,#home-row-chinajoy,#b2-widget-html-4,#b2-widget-html-12

! 2024-05-11 https://iui.su 不死鸟
iui.su##footer,[data-title="广告"]~*
! 2023-09-13 https://www.v2ex.com
www.v2ex.com###Bottom

! 2024-01-11 https://blog.csdn.net
csdn.net##.openApp,.m_toolbar_left_app_btn,.passport-login-container,.weixin-shadowbox,.feed-Sign-weixin,.app_abtest_btn_open,.blind_box

! 2024年4月23日 https://www.landiannews.com 蓝点网 - 给你感兴趣的内容
landiannews.com##.top-bar.module-bg,footer
landiannews.com##.comment-respond

! 2022-11-26 https://www.coolapk.com 玩数码，真实有趣的数码社区
www.coolapk.com###sidebar
www.coolapk.com###footer
www.coolapk.com###header-developer
www.coolapk.com##.feed-hot-reply
www.coolapk.com##.download-group
www.coolapk.com##.navbar-contact

! 2023-09-30 https://zhrwx.com 风车动漫
woiso.com##.myui-foot

! 2023-12-15 https://m.agedm.org AGE动漫
! agedm.org##[rel*="icon"],.modal-footer,#notice_box,.extra-box,.foot_content_wrapper,.col-md-12,.nav-download-link,.comment-box-wrapper
! agedm.org##.global_notice_wrapper,.video-comments-box,.van-dialog:remove()
! agedm.org##.van-overlay:remove-class(van-overlay)

agedm.org,agedm.vip##.comment-box-wrapper,.watch-qrcode-popover,.float-end,small:remove()
agedm.org,agedm.vip##.video-comments-box,.video-feedback-box,.hd,[class*="dialog"],.go-marketing:remove()
agedm.org,agedm.vip##.van-overlay:remove-class(van-overlay)
agedm.org,agedm.vip###notice_box,.extra-box,.nav-download-link,.foot_content_wrapper:remove()



foot-container
#======文档工具==========================================================================
! 2023-06-06 https://shimo.im 石墨文档
shimo.im##[class*="StyledUpgradeEntrance"],[class*="StyledTipTooltip"]

! 2023-07-27 https://www.yuque.com 语雀文档
yuque.com##script:has-text(error)
yuque.com###footer,[class^="like-module_"],#siteTipGuide,.dashboard-sidebar-scrollbar+div,#openInAppBtn
yuque.com##[class^="H5DocReader-module_meta"],[class^="H5DocReader-module_actions"]
yuque.com##[data-testid="h5-page-toolbar"]>div+div~*:remove()


! 2022-11-21 https://www.jianguoyun.com  坚果云盘
jianguoyun.com##.teaser-container,.isActive.account-type,.active.bar-item,div.bar-item:nth-of-type(4)

! 2023-02-11 https://up.woozooo.com 蓝奏云盘
up.woozooo.com##if_top
up.woozooo.com###f_right

! 2023-07-27 https://apkcombo.com APP下载
apkcombo.com##footer,nav,.is-nav,[class*="ad-"]
apkpure.com###policy-info,.chrome-install-pop,.footer_new,#nav_download_management,.aegon-down-item
apkpure.com##script:has-text(/adsense/):remove()


! 2024-01-22 https://www.yckceo.com 源仓库 阅读APP
www.yckceo.com##div.layui-hide-md.layui-container > .layui-card
www.yckceo.com##.footer

! 2023-12-15 https://www.wenshushu.cn 文叔叔
www.wenshushu.cn##.g-footer
www.wenshushu.cn##.g-open_app
www.wenshushu.cn##.footer

! 2024-05-15 https://www.alipan.com 阿里云盘
www.alipan.com##.nav-sub-tab-bottom--mLRLo
www.alipan.com##.container--T0zFN
www.alipan.com##.text-secondary--TlI9K

! 2022-12-15 https://smailpro.com/temp-gmail 临时谷歌邮箱
smailpro.com##scrcpy:has-text(/getAdConfig/):remove()
smailpro.com##[src*="adsbygoogle"],[src*="analytics"]:remove()
smailpro.com###menu,footer,main>[x-data]~*:remove()

! 2024年8月6日 https://poe.com 
poe.com##[class^="Banner_root"]:remove()
poe.com##menu[class^="MainLeftSidebar_sidebar"] > section:nth-of-type(4):remove()

! AI工具：视频总结
bibigpt.co##[data-sidebar="footer"]

rsshub.app##.VPCarbonAds,.VPDocAsideCarbonAds

apkmirror.com###bottom-slider,.footer,.desktopTitle 

#======文档工具==========================================================================


! 2024年8月6日 https://rebang.today 新闻资讯热榜

zhihu.com##.Button--primary,.MobileModal-wrapper
ithome.com##.open-app,.ruanmei-footer
hupu.com##.tabs-component-search-app
huxiu.com##.btn-open,.bottom-open-app-btn,.qr_code_pc,footer
sspai.com##script,footer,.btn-call-app,script[src*="open"]
163.com##section>a.js-open-newsapp,.logoBottom.js-bottom-container,.s-top>.s-btn,.comment-footer
thepaper.cn###moblink_header,[class^="index_footer_banner__"],footer
36kr.com##[rel*="icon"],.assit-wrapper,.kr-footer,.app-track-card,.float-app-button-wrp,.kr-mobile-footer
36kr.com##script:has-text(统计代码)
smzdm.com##.footer-banner-wrap,.logo-download,.btn-open-app

! 2024年8月6日 https://tophub.today 今日热榜
tophub.today##.open-in-app

! 2024年8月6日 https://www.207788.xyz 好资源不私藏
207788.xyz##.alignnone 

#======图片===========================================================================
! 2022-01-21 https://www.huashi6.com  触站画师
huashi6.com##footer,.chuzhan-app-download,[id^="popup_"],.c-sidebar,.p-home-swiper-hot,.work-middle-ad:remove()

! 2022-11-20 http://www.cnu.cc CNU视觉联盟
cnu.cc##meta,[rel*="icon"],.pageFooter,.blackBG
cnu.cc##a[href="http://www.cnu.cc/mobile.html"]


! 2024-01-20 https://m.huaban.com
huaban.com##.ant-modal-root,[class^="ant-tooltip"],[href="#buyVip-personal"],[data-content-source="导航_企业VIP"],.item.app,.open-add

! 2024年8月6日 https://www.soutushenqi.com 搜图神器
soutushenqi.com##script,style,link[rel="modulepreload"],.ant-modal-root,[class*="_download_"],[class*="_community_"],#footerWrap:remove()
soutushenqi.com###root > .Home-module_tabs_wrap_fSeSw ~ *:remove()

! 2024年8月6日 https://www.artstation.com
artstation.com##.ad,script,.productPage-description-col,.report-section,.share-grid,.project-comments-form,#fb-root,iframe:remove()

! sspai.com##:matches-path(/post/) .app_toolbar,.related-read-box,.article-side,.right-side-directory,.greyBgBox,.bgGrey,#app>header,#root~*,#app~*,.article-copyrights~*:remove()
