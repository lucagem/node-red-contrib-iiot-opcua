@echo off
echo =============================================
echo  OPC UA IIoT - Test Suite Runner
echo =============================================
echo.

echo Select test type:
echo.
echo [1] All tests (standard + verbose)
echo [2] Unit tests only
echo [3] Core tests only
echo [4] E2E tests only
echo [5] Tests with coverage report
echo [6] Quick syntax check only
echo.

choice /C 123456 /M "Choose test type"

if %ERRORLEVEL% equ 1 (
    echo Running all tests...
    call npm test
) else if %ERRORLEVEL% equ 2 (
    echo Running unit tests...
    call npm run test:units
) else if %ERRORLEVEL% equ 3 (
    echo Running core tests...
    call npm run test:core
) else if %ERRORLEVEL% equ 4 (
    echo Running E2E tests...
    call npm run test:e2e
) else if %ERRORLEVEL% equ 5 (
    echo Running tests with coverage...
    call npm run coverage
    echo.
    echo Coverage report generated in: .\jcoverage\lcov-report\index.html
) else if %ERRORLEVEL% equ 6 (
    echo Running code style check...
    call npm run code:check
)

echo.
if %ERRORLEVEL% equ 0 (
    echo ✓ Tests completed successfully!
) else (
    echo ✗ Some tests failed. Check the output above.
)

echo.
pause