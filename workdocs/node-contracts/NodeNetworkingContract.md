---
title: Node Networking Contract
description: Контракт сетевого взаимодействия узлов
version: 1.0.0
date: 2026-06-13
---

# 🌐 NODE NETWORKING CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🎯 ЦЕЛЬ

Определить сетевую модель экосистемы.

---

## 📡 PRIVATE OVERLAY NETWORK

**Technology:** Tailscale  
**Purpose:** Secure communication between all nodes  
**Requirements:**
- ALL nodes MUST join Tailscale network
- ALL service-to-service communication MUST use Tailscale IPs
- NO direct internet exposure for internal services

---

## 🌍 PUBLIC INGRESS

**Technology:** Cloudflare Tunnel  
**Purpose:** Secure public access  
**Rules:**
- ONLY reverse proxy exposed publicly
- ALL public traffic MUST go through Cloudflare
- NO direct port forwarding

---

## 🔗 INTERNAL SERVICE-TO-SERVICE

**Network:** Tailscale + Docker internal network  
**Rules:**
- Services communicate via Docker network
- Database accessible ONLY from work-server
- Redis accessible ONLY from work-server

---

## 📝 DNS EXPECTATIONS

- Internal: Tailscale DNS
- External: Cloudflare DNS
- Services: Internal DNS names only

---

**Создано:** 2026-06-13

---

**🎈 Balloo**