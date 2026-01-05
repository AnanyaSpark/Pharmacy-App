# Setup script to create all server files
Write-Host "Creating server files..."

# Create directories
New-Item -ItemType Directory -Path "server\routes" -Force | Out-Null
New-Item -ItemType Directory -Path "server\database" -Force | Out-Null

Write-Host "Directories created. Please run the server files creation manually or contact support."
Write-Host "The files should be in the project but may need to be synced to disk."

