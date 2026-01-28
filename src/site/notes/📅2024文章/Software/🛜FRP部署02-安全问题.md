---
{"dg-publish":true,"permalink":"/2024/software/frp-02/","tags":["Network"],"created":"2024-08-31T11:12:58.119+08:00"}
---


**原则：**
1. 最小化服务权限：对暴露服务实施 **Least Privilege Principle**（最小权限原则），确保即使被攻击，影响也能控制在最小范围内。
2. 强化密码安全：所有暴露的服务都应使用 **Strong Passwords** 或 **密钥**。定期更换密码。

**实操：**
1. 防范网络爆破攻击：部分攻击者通过扫描 IP 和 ping 测试来确认服务器在线。为防止这种攻击，可以关闭跳板服务器的 **ICMP** 协议，并使用 **Intrusion Detection Systems (IDS)** 监控异常登录尝试。另外，考虑使用 **fail 2 ban** 来自动阻止可疑的 IP。
2. 对于 SSH 访问，可以关闭密码验证，只启用密钥验证，以增强安全性。
3. 将域名解析转到 Cloudflare DNS，然后使用 Cloudflare DNS Proxy
