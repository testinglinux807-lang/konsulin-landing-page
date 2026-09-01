# Deploy Konsulin ke VPS

Ganti `namadomain.com` di bawah dengan domain kamu yang beneran.

Status di VPS ini (dicek 2026-09-01): Node.js v22 & PM2 sudah terpasang (dipakai app lain di server yang sama). Nginx belum ada. Project sudah di-clone ke `~/konsulin-landing-page`.

## 0. Arahkan domain ke VPS

Di dashboard registrar/DNS domain kamu, tambahkan (atau edit) record ke IP VPS ini:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | IP VPS kamu |
| A | `www` | IP VPS kamu |

Propagasi DNS biasanya beberapa menit sampai 1-2 jam. Cek sudah nyambung dengan:

```sh
ping namadomain.com
```

## 1. Install Nginx (satu-satunya yang belum ada)

```sh
sudo apt update
sudo apt install -y nginx
sudo ufw allow "Nginx Full"
```

## 2. Build project

```sh
cd ~/konsulin-landing-page
npm install
npm run build   # hasil masuk ke .output/ — target Node server, bukan Cloudflare
```

## 3. Isi `.env`

File `.env` tidak ikut ke Git (sengaja di-gitignore). Buat baru di VPS:

```sh
nano .env
```

Isi:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONSULTATION_NOTIFY_EMAIL=konsulinsupport@gmail.com
RESEND_FROM_EMAIL=Konsulin <onboarding@resend.dev>
```

## 4. Jalankan dengan PM2

VPS ini sudah menjalankan app lain di port 3000 (`d3o`), jadi Konsulin dikonfigurasi pakai **port 3001** (lihat `ecosystem.config.cjs`).

```sh
pm2 start ecosystem.config.cjs
pm2 save
```

(`pm2 startup` gak perlu dijalankan ulang kalau sudah pernah di-setup buat app lain di VPS ini.)

Cek jalan normal:

```sh
curl -I http://localhost:3001/
```

## 5. Setup Nginx sebagai reverse proxy

```sh
sudo nano /etc/nginx/sites-available/konsulin
```

Isi:

```nginx
server {
    listen 80;
    server_name namadomain.com www.namadomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan:

```sh
sudo ln -s /etc/nginx/sites-available/konsulin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Sekarang `http://namadomain.com` harusnya sudah tampil.

## 6. Pasang SSL (HTTPS) gratis dengan Let's Encrypt

```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d namadomain.com -d www.namadomain.com
```

Certbot otomatis edit config Nginx buat redirect HTTP → HTTPS dan setup auto-renewal.

## Update ke versi terbaru (setiap kali ada perubahan kode)

```sh
cd ~/konsulin-landing-page
git pull
npm install
npm run build
pm2 restart konsulin
```

## Troubleshooting cepat

```sh
pm2 logs konsulin         # lihat log aplikasi
pm2 status                 # cek proses jalan/mati, port bentrok dsb
sudo ss -tlnp | grep LISTEN  # lihat port apa aja yang kepake di VPS ini
sudo systemctl status nginx
sudo nginx -t               # validasi config nginx
```
