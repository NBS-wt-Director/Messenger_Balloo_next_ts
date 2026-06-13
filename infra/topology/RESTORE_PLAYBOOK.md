# 📖 RESTORE PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🚨 EMERGENCY RESTORATION PROCEDURES

### Scenario 1: Loss of work-server (CRITICAL)

**Impact:** Production DOWN

**Steps:**

1. **Provision new server**
   ```bash
   # Install Ubuntu 22.04 LTS
   # Configure hostname: work-server
   # Set up user with sudo
   ```

2. **Install base software**
   ```bash
   # Docker
   curl -fsSL https://get.docker.com | sh
   
   # Docker Compose
   sudo apt install docker-compose
   
   # Tailscale
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up
   
   # Git
   sudo apt install git
   ```

3. **Restore configuration**
   ```bash
   # Clone repositories
   git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
   cd Messenger_Balloo_next_ts
   
   # Restore .env from encrypted backup (home_nas or password manager)
   # Copy to /opt/balloo/prod/.env
   ```

4. **Restore database**
   ```bash
   # Connect to home_nas
   ssh home_nas
   
   # Find latest backup
   ls -lt /backups/postgres/
   
   # Restore
   pg_restore -U balloo -d balloo latest_backup.dump
   
   # Or from remote backup
   gsutil cp gs://balloo-backups/postgres/latest.dump .
   pg_restore -U balloo -d balloo latest.dump
   ```

5. **Start services**
   ```bash
   cd /opt/balloo/prod
   docker-compose pull
   docker-compose up -d
   
   # Verify
   docker-compose ps
   curl http://localhost:3000/health
   ```

6. **Update DNS (if IP changed)**
   ```bash
   # Update DNS records
   # balloo.su → new work-server IP via reverse proxy
   ```

---

### Scenario 2: Loss of laptop_control

**Impact:** Cannot manage system

**Steps:**

1. **Setup new laptop**
   ```bash
   # Install OS (Windows 11 / Linux)
   
   # Install VS Code / Koda
   # Install Git
   # Install SSH client
   # Install Tailscale
   ```

2. **Restore access**
   ```bash
   # Restore SSH keys from password manager
   # Clone git repositories
   git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
   
   # Configure Tailscale
   tailscale up
   
   # Test SSH access to work-server
   ssh work-server
   ```

---

### Scenario 3: Loss of home_nas

**Impact:** No backups

**Steps:**

1. **Setup new NAS**
   ```bash
   # Install NAS OS (TrueNAS / OpenMediaVault)
   # Configure storage pool
   # Set up SMB/NFS sharing
   ```

2. **Configure access**
   ```bash
   # Install Tailscale
   tailscale up
   
   # Configure backup sync from work-server
   # Edit /etc/cron.daily/backup-sync
   ```

3. **Restore from remote backup (if available)**
   ```bash
   # Download from encrypted cloud storage
   # Restore to NAS
   ```

---

## ✅ VERIFICATION CHECKLIST

After any restoration:

- [ ] All nodes visible in Tailscale
- [ ] SSH access from laptop_control to all nodes
- [ ] Docker containers running on work-server
- [ ] Database accessible
- [ ] DNS records pointing correctly
- [ ] Reverse proxy active
- [ ] Health endpoints responding
- [ ] 2FA working on phones
- [ ] Backup sync configured

---

## 📁 REQUIRED DOCUMENTS

**Must have for recovery:**
- NodeTreeContract.md
- NodeRecoveryContract.md
- docker-compose.yml
- database schema
- .env template
- SSH keys backup
- Recovery codes

**Locations:**
- Primary: work-server
- Backup: home_nas
- Offsite: encrypted cloud storage

---

**Создано:** 2026-06-13

---

**🎈 Balloo**