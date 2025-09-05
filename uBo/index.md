! Homepage: https://github.com
! Title: Pixel uBlock Origin
! Version: 1.0
[TOC]


*##+js(fingerprint2.js)
#FingerprintJS2 第三方库，设备指纹，用于跟踪，识别唯一用户

#### 全域广告
||ad-nex.com^
||adapf.com^
||adtng.com^
||jads.co^
||assistads.net^
||crs.adapf.com^
||livedoor.net^
||juicyads.com^
||magsrv.com^
||pemsrv.com^
||popmagicldr^
||exosrv.com^
||exoclick.com^
||pagead2.googlesyndication.com^



#### URL净化 / 跟踪参数
||www.xiaohongshu.com/*$removeparam=/^(app_platform|ignoreEngage|app_version|share_from_user_hidden|xsec_source|type|author_share|xhsshare|shareRedId|apptime|share_id|appuid)/
||weixin.qq.com*$removeparam=scene
||youtube.com^$removeparam=/^(pp|si)/
||www.pixiv.net^$removeparam=/^(utm_|st_|ref=|via=)/
||douyinpic.com^$removeparam=/^(from)/
! ||bilibili.com$removeparam=/^(bvid)/



####  PCDN 
||*pcdn.*^$important   
||*p2p.*^$important   
||*cdn.p2p.*^$important   
||*peer.*^$important   
||szbdyd.com^$important   
||cn-*.bilivideo.com   
#利用用户闲置网络资源（如带宽）来分发内容的技术
#屏蔽能节省上传流量,不影响下载速度
#[哔哩哔哩技术文章](https://itdong.me/bilibili_pcdn/)
#[nodeseek技术文章](https://www.nodeseek.com/post-204579-1)




#### 显示视频控件
! sex8.cc##+js(set-attr, video, controls)



#### 导入其他规则
!#include uBoroutine.txt
!#include uBOAdultPlatform.txt
!#include uBOAdultVideo.txt
!#include uBOAdultPic.txt
!#include uBoTelegram.txt
!#include uBoOther.txt





