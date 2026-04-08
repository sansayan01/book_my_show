#!/bin/bash
# Keep BookMyShow tunnel alive

# Kill existing processes
pkill -f "cloudflared" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Start Vite dev server
cd /home/ubuntu/book_my_show/client
npm run dev -- --host 0.0.0.0 --port 5173 > /dev/null 2>&1 &
sleep 3

# Start cloudflared tunnel
cd /tmp
./cloudflared tunnel --url http://localhost:5173 --no-autoupdate > /tmp/tunnel.log 2>&1 &
sleep 5

# Get the tunnel URL
TUNNEL_URL=$(grep -o 'https://[^ ]*trycloudflare.com' /tmp/tunnel.log | head -1)
if [ -n "$TUNNEL_URL" ]; then
    echo "Tunnel URL: $TUNNEL_URL"
    echo "$TUNNEL_URL" > /tmp/tunnel_url.txt
fi

echo "Tunnel started at $(date)"
