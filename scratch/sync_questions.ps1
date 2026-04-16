$v2Root = "C:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2"
$backupRoot = "C:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2_backup"
$subjects = @("botany", "chemistry", "maths", "physics", "zoology")

Write-Host "Starting Perfect Synchronization..." -ForegroundColor Cyan

foreach ($sub in $subjects) {
    $backupSubPath = Join-Path $backupRoot $sub
    $v2SubPath = Join-Path $v2Root $sub

    if (-not (Test-Path $backupSubPath)) {
        Write-Host "Warning: Backup subject path not found: $backupSubPath" -ForegroundColor Yellow
        continue
    }

    $topics = Get-ChildItem -Path $backupSubPath -Directory
    foreach ($topic in $topics) {
        $topicName = $topic.Name
        $v2TopicPath = Join-Path $v2SubPath $topicName
        $backupTopicPath = $topic.FullName

        Write-Host "Processing: $sub/$topicName" -ForegroundColor Gray

        # Ensure V2 topic directory exists
        if (-not (Test-Path $v2TopicPath)) {
            New-Item -ItemType Directory -Path $v2TopicPath -Force | Out-Null
        }

        # 1. Clean up ALL existing attempts in V2 topic
        Remove-Item -Path (Join-Path $v2TopicPath "attempt_*.json") -ErrorAction SilentlyContinue

        # 2. Copy exactly 4 attempts from Backup
        for ($i = 1; $i -le 4; $i++) {
            $fileName = "attempt_$i.json"
            $srcFile = Join-Path $backupTopicPath $fileName
            $destFile = Join-Path $v2TopicPath $fileName

            if (Test-Path $srcFile) {
                Copy-Item -Path $srcFile -Destination $destFile -Force
            } else {
                Write-Host "  Note: $fileName missing in backup for $topicName" -ForegroundColor DarkGray
            }
        }
    }
}

# 3. Cleanup topics only in V2 (trim to 4 if they exist)
Write-Host "Cleaning up orphaned/extra attempts in V2..." -ForegroundColor Cyan
foreach ($sub in $subjects) {
    $v2SubPath = Join-Path $v2Root $sub
    if (-not (Test-Path $v2SubPath)) { continue }

    $v2Topics = Get-ChildItem -Path $v2SubPath -Directory
    foreach ($v2Topic in $v2Topics) {
        $backupTopicPath = Join-Path (Join-Path $backupRoot $sub) $v2Topic.Name
        
        # If it wasn't in backup, it hasn't been processed yet
        if (-not (Test-Path $backupTopicPath)) {
            Write-Host "Enforcing 4-attempt limit on V2-only topic: $($sub)/$($v2Topic.Name)" -ForegroundColor DarkMagenta
            $extraFiles = Get-ChildItem -Path $v2Topic.FullName -Filter "attempt_*.json" | 
                          Where-Object { [int]($_.Name -replace 'attempt_(\d+)\.json', '$1') -gt 4 }
            
            foreach ($file in $extraFiles) {
                Remove-Item -Path $file.FullName -Force
            }
        }
    }
}

Write-Host "Synchronization Complete!" -ForegroundColor Green
