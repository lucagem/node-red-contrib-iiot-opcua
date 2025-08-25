@echo off
echo =============================================
echo  OPC UA IIoT - Build and Test Automation
echo =============================================
echo.

echo [1/4] Building TypeScript sources...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build completed successfully
echo.

echo [2/4] Running unit tests...
call npm test
if %ERRORLEVEL% neq 0 (
    echo ERROR: Tests failed!
    pause
    exit /b 1
)
echo ✓ Tests completed successfully
echo.

echo [3/4] Checking if Node-RED is running...
netstat -an | find ":1880" >nul
if %ERRORLEVEL% equ 0 (
    echo ⚠ Node-RED is already running on port 1880
    echo   Please stop it manually or it will use the old version
) else (
    echo ℹ Node-RED is not running
)
echo.

echo [4/4] Ready to test in Node-RED!
echo.
echo Next steps:
echo 1. Go to node-red-test folder: cd node-red-test
echo 2. Start Node-RED: npx node-red --userDir ".\.node-red"
echo 3. Open browser: http://127.0.0.1:1880/
echo.
echo ✓ Build and test cycle completed!
pause