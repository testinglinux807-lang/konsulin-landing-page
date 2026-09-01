# Deploy Konsulin ke VPS

Ganti `namadomain.com` di bawah dengan domain kamu yang beneran, dan `123.45.67.89` dengan IP VPS kamu.

## 0. Arahkan domain ke VPS

Di dashboard registrar/DNS domain kamu, tambahkan (atau edit) record:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `123.45.67.89` (IP VPS kamu) |
| A | `www` | `123.45.67.89` |

Propagasi DNS biasanya beberapa menit sampai 1-2 jam. Cek sudah nyambung dengan:

```sh
ping namadomain.com
```

## 1. Siapkan VPS (sekali saja)

SSH ke VPS-nya, lalu jalankan:

```sh
sudo apt update && sudo apt upgrade -y

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx (reverse proxy)
sudo apt install -y nginx

# PM2 (jaga proses Node tetap hidup + auto-restart)
sudo npm install -g pm2

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
```

## 2. Upload project ke VPS

Dari komputer kamu (Windows), kirim project ke VPS. Ganti `user` dengan username SSH VPS kamu:

```sh
# via rsync (exclude node_modules & file lokal yang gak perlu ikut)
rsync -avz --exclude node_modules --exclude .output --exclude .nitro --exclude .wrangler \
  ./ user@123.45.67.89:/var/www/konsulin/
```

Kalau belum ada `rsync` di Windows, pakai `scp -r` juga bisa (lebih lambat tapi jalan), atau `git push` ke repo lalu `git clone` di VPS kalau project ini sudah kamu taruh di GitHub/GitLab.

## 3. Install & build di VPS

```sh
ssh user@123.45.67.89
cd /var/www/konsulin

npm install
npm run build   # hasilnya masuk ke .output/ — sudah dikonfigurasi target Node server, bukan Cloudflare
```

## 4. Isi `.env` di VPS

File `.env` **tidak ikut ke-upload** (sengaja di-gitignore). Buat baru langsung di VPS:

```sh
nano .env
```

Isi:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONSULTATION_NOTIFY_EMAIL=konsulinsupport@gmail.com
RESEND_FROM_EMAIL=Konsulin <onboarding@resend.dev>
```

## 5. Jalankan dengan PM2

```sh
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # ikuti instruksi yang muncul (biar auto-start pas VPS reboot)
```

Cek jalan normal:

```sh
curl -I http://localhost:3000/
```

## 6. Setup Nginx sebagai reverse proxy

```sh
sudo nano /etc/nginx/sites-available/konsulin
```

Isi:

```nginx
server {
    listen 80;
    server_name namadomain.com www.namadomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

## 7. Pasang SSL (HTTPS) gratis dengan Let's Encrypt

```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d namadomain.com -d www.namadomain.com
```

Certbot otomatis edit config Nginx buat redirect HTTP → HTTPS dan setup auto-renewal.

## Update ke versi terbaru (setiap kali ada perubahan kode)

```sh
# dari komputer kamu
rsync -avz --exclude node_modules --exclude .output --exclude .nitro --exclude .wrangler \
  ./ user@123.45.67.89:/var/www/konsulin/

# di VPS
cd /var/www/konsulin
npm install
npm run build
pm2 restart konsulin
```

## Troubleshooting cepat

```sh
pm2 logs konsulin        # lihat log aplikasi
pm2 status                # cek proses jalan/mati
sudo systemctl status nginx
sudo nginx -t              # validasi config nginx
```
