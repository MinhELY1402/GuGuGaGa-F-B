# Kịch bản kiểm tra sức khỏe hệ thống GuGuGaGa (System Smoke Test & Health Check)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🍜 KIỂM TRA MÔI TRƯỜNG & SỨC KHỎE HỆ SINH THÁI GUGUGAGA" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Kiểm tra công cụ cài đặt
Write-Host "`n[*] 1. Kiểm tra các công cụ lập trình cốt lõi:" -ForegroundColor Yellow

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) { Write-Host "  ✅ Node.js: $($node.Version)" -ForegroundColor Green }
else { Write-Host "  ❌ Node.js chưa được cài đặt!" -ForegroundColor Red }

$flutter = Get-Command flutter -ErrorAction SilentlyContinue
if ($flutter) { Write-Host "  ✅ Flutter: Đã cài đặt" -ForegroundColor Green }
else { Write-Host "  ⚠️ Flutter chưa có trên PATH" -ForegroundColor Yellow }

$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) { Write-Host "  ✅ Git: $($git.Version)" -ForegroundColor Green }
else { Write-Host "  ❌ Git chưa được cài đặt!" -ForegroundColor Red }

# 2. Kiểm tra các cổng dịch vụ (5000, 5173, 8000)
Write-Host "`n[*] 2. Kiểm tra trạng thái cổng dịch vụ cục bộ:" -ForegroundColor Yellow

function Test-Port {
    param([int]$port, [string]$serviceName)
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect("127.0.0.1", $port)
        $tcp.Close()
        Write-Host "  ✅ Cổng $port ($serviceName): ĐANG CHẠY" -ForegroundColor Green
    } catch {
        Write-Host "  ⚪ Cổng $port ($serviceName): Chưa khởi động" -ForegroundColor Gray
    }
}

Test-Port -port 5000 -serviceName "Backend Express API"
Test-Port -port 5173 -serviceName "Admin Web Portal"
Test-Port -port 8000 -serviceName "AI Flask Service"

Write-Host "`n[*] Kiểm tra hoàn tất! Sẵn sàng vận hành hệ thống." -ForegroundColor Cyan
