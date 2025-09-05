! ======Telegram ===========================================================================
t.me##.tgme_head_right_btn
下载APP
telegram.org##.chatlist-bottom:remove()
! 左侧 联系方式
telegram.org###new-menu:remove()
! 新建 新频道/群组/私人聊天
telegram.org##.badge-primary:remove()
! 顶部 未读数量
telegram.org##.chat-join,.btn-primary:remove()
! 加入
telegram.org##.chat-input-control.chat-input-wrapper:remove()
! 开始 解除封锁 申请加入小组 小组名称 不显示固定消息 打开聊天 
telegram.org##.new-message-wrapper.rows-wrapper-row>*:remove-class(hide)
! 取消聊天输入框的隐藏选项
telegram.org##.popup-send-gift:remove()
telegram.org##.menu-open div.btn-menu-item:has-text(Send a Gift):remove()
送礼物
telegram.org##.media-viewer-buttons .hide:remove-class(hide)
telegram.org##.media-viewer-buttons:style(display: flex !important; justify-content: flex-end !important; align-items: center !important; position: fixed !important; right: 20px !important; top: 40px !important;)
! 移除视频控件的隐藏；再之后移动端不显示，视频播放按钮改为Flexbox浮动，固定在屏幕距离
telegram.org##section.bubbles-date-group .bubble-content-wrapper .service-msg:has-text(/joined the group/):upward(4)
! 用户加入的消息显示
telegram.org##i.data-saved-from:has-text(/SOSO搜搜/):upward(6):remove()
! 用户加入的消息显示 正文下方


! ======Telegram ===========================================================================
telegram.org##.message span:has-text(/OverWall加速器|酒馆AI|绅士玩具屋|樱川爱|特价|支付|新用户|信誉|USDT|免费|SoulAI|游玩|体育/):nth-ancestor(4)
telegram.org##blockquote:has-text(/付费/):remove()

telegram.org##span.reply-markup-button-text:has-text(/6G国际娱乐/):upward(3):remove()
! 匹配按钮，屏蔽正文卡片 下方的广告按钮【通用】

telegram.org##span.reply-markup-button-text:has-text(/赞助|保证金/):upward(2):remove()
! 匹配按钮，屏蔽按钮 下方的广告按钮【通用】



! ======Telegram ===========================================================================
