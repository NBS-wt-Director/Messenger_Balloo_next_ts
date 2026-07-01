# 🏢 Физическая Инфраструктура

**Дата создания:** 26.06.2026  
**Последнее обновление:** 2026-06-26  
**Платформа:** Balloo Platform  

---

## Серверная инфраструктура

### Физическая инфраструктура

**Локация:** Екатеринбург, РФ  
**Домен:** balloo.su  
**DNS провайдер:** RU-CENTER / REG.RU  
**SSL:** Let's Encrypt (Auto-renew)  
**ОС:** Ubuntu 22.04 LTS (x86_64)

### Compliance

- ✅ 152-ФЗ (ПДн — серверы в РФ)
- ✅ 150-ФЗ (Закон Яровой — хранение трафика 6 мес)
- ✅ Система Технических Мер (СТМ) ФСТЭК

---

## Сеть и Безопасность

### Firewall и защита

- **Firewall:** UFW + Fail2Ban
- **DDoS защита:** Cloudflare (Proxy mode) + DDoS-Guard (RU)
- **Intrusion Detection:** AIDE (File Integrity) + OSSEC
- **Логирование:** ELK Stack (Elasticsearch, Logstash, Kibana) на отдельном узле

---

## Монорепо архитектура

**Тип:** Physical Server Monorepo  
**Рабочая область:** single workspace  
**Сеть:** balloo_net (Docker bridge)  
**Количество узлов:** 8

### Назначение портов

| Сервис | Порт |
|--------|------|
| API Gateway | 3001 |
| Messenger | 3002 |
| Admin Portal | 3003 |
| Web App | 3004 |
| Mobile API | 3005 |
| Database | 3006 |
| Cache | 3007 |
| File Storage | 3008 |

---

*Инфраструктура полностью соответствует требованиям 152-ФЗ и 150-ФЗ.*
