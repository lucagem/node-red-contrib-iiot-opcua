@echo off
echo =============================================
echo  Starting Node-RED Test Environment
echo =============================================
echo.

REM Check if we're in the right directory
if not exist "node-red-test" (
    echo ERROR: node-red-test folder not found!
    echo Make sure you're running this from the main project folder
    pause
    exit /b 1
)

REM Check if Node-RED is already running
netstat -an | find ":1880" >nul
if %ERRORLEVEL% equ 0 (
    echo ⚠ WARNING: Node-RED appears to be already running on port 1880
    echo   Press Ctrl+C in the other terminal to stop it first
    echo.
    choice /C YN /M "Continue anyway"
    if %ERRORLEVEL% equ 2 exit /b 0
)

echo Starting Node-RED with local test environment...
echo.
echo Web interface will be available at: http://127.0.0.1:1880/
echo Press Ctrl+C to stop Node-RED
echo.

cd node-red-test
REM imposto che voglio vedere i debug per il nodo core
REM set DEBUG=opcuaIIoT:core,opcuaIIoT:write,opcuaIIoT:connector*
set DEBUG=opcuaIIoT:*
set OPC_ENABLE=1
npx node-red --userDir ".\.node-red"