@echo off
echo =============================================
echo  Quick Test Cycle (Build Only)
echo =============================================
echo.

echo Building TypeScript sources...
call npm run build

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✓ Build completed successfully!
    echo.
    echo Your changes are ready for testing in Node-RED.
    echo If Node-RED is running, restart it to see the changes.
) else (
    echo.
    echo ✗ Build failed! Check the errors above.
)

echo.
pause