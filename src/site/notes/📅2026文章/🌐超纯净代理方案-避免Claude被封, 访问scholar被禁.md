---
{"dg-publish":true,"dg-permalink":"superpure-proxy","permalink":"/superpure-proxy/","tags":["Network"],"created":"2026-02-05T23:37:54.536+08:00"}
---


机场提供的节点，大部分是多人共用的，即使是支持家宽的机场，家宽节点在 `ping0.cc`  的测试结果也可能是多人使用且安全等级不高。

自己租赁其他地区的云服务器 VPS 的时候，会被标记为机房节点 IDC IP，导致无法正常访问 Google Scholar。

**构建干净 IP 代理的方案**：租赁 VPS（Sing-box 配置 Vless 协议，outbound 绑定家宽 ip，走 SOCKS 流量），家宽 IP 可以通过 IPRoyal 等网站购买。
**主要问题**：价格偏高，云服务器每月  $ 3-4，IPRoyal 购买家宽 IP（使用优惠码）大概 $2  每 GB 流量。实测 1 个月大模型对话最多消耗 3G $6。这个方案每月总计消耗 $10。

最终使用 Safari 和 Claude Helper 这 2个进程名构建流量隔离策略，配置 Clash 使所有相应进程流量走家宽通道，其他流量正常按照规则走其他机场的代理节点。在保证访问高风控网站时节点纯净，且避免消耗过多流量。