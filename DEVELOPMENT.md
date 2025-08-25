# Development Guide - OPC UA IIoT

## 🚀 Quick Start

1. **Build and test everything:**
   ```cmd
   build-and-test.bat
   ```

2. **Start Node-RED for testing:**
   ```cmd
   start-node-red.bat
   ```

3. **Quick rebuild after changes:**
   ```cmd
   quick-test.bat
   ```

## 📁 Project Structure

```
├── src/                          # TypeScript source files
│   ├── opcua-iiot-*.ts          # Node implementations
│   ├── opcua-iiot-*.html        # Node UI definitions
│   ├── core/                    # Core utilities
│   ├── helpers/                 # Helper functions
│   └── types/                   # Type definitions
├── opcuaIIoT/                   # Compiled JavaScript (auto-generated)
├── node-red-test/               # Local Node-RED test environment
│   └── .node-red/              # Node-RED user data
├── test/                        # Test files
└── certificates/                # OPC UA certificates
```

## 🛠️ Development Workflow

### Making Changes

1. **Edit TypeScript files** in the `src/` folder
2. **Build the project:**
   ```cmd
   npm run build
   ```
   or use: `quick-test.bat`

3. **Test in Node-RED:**
   - Restart Node-RED if running
   - Or use: `start-node-red.bat`

### Testing

- **All tests:** `run-tests.bat` or `npm test`
- **Quick syntax check:** `npm run code:check`
- **Coverage report:** `npm run coverage`
- **Specific test types:**
  ```cmd
  npm run test:units    # Unit tests only
  npm run test:core     # Core tests only  
  npm run test:e2e      # End-to-end tests only
  ```

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `build-and-test.bat` | Complete build and test cycle |
| `start-node-red.bat` | Start Node-RED test environment |
| `quick-test.bat` | Quick build for development |
| `run-tests.bat` | Interactive test runner |

## 📋 Manual Commands

### Build Commands
```cmd
npm run build           # Full build (TypeScript + docs + assets)
npm run test           # Run tests with linting
npm run coverage       # Tests with coverage report
```

### Development Commands
```cmd
npm run certificates   # Regenerate OPC UA certificates
npm run dev-link       # Create global npm link (not recommended)
npm run clean          # Clean build artifacts
```

## 🌐 Node-RED Testing

1. **Start Node-RED:** Run `start-node-red.bat`
2. **Access interface:** http://127.0.0.1:1880/
3. **Find nodes:** Look for "opcua iiot" in the node palette
4. **Test changes:** 
   - Stop Node-RED (Ctrl+C)
   - Run `quick-test.bat`
   - Restart Node-RED

## 🐛 Troubleshooting

### Build Issues
- **TypeScript errors:** Check `src/` files for syntax errors
- **Missing dependencies:** Run `npm install`
- **Permission issues:** Run terminal as administrator

### Node-RED Issues
- **Port 1880 in use:** Stop other Node-RED instances
- **Nodes not showing:** Check build completed successfully
- **Certificate errors:** Run `npm run certificates:renew`

### Test Issues
- **Tests failing:** Run `npm run test:verbose` for details
- **Coverage issues:** Clean with `rm -rf jcoverage` then retry

## 📝 Code Style

- **Linting:** Uses `standard` (runs automatically with `npm test`)
- **Auto-fix:** `npm run code:check`
- **TypeScript:** Strict mode enabled

## 🔄 Git Workflow

```bash
# Sync with upstream
git fetch upstream
git checkout master
git merge upstream/master

# Create feature branch
git checkout -b feature/my-feature

# After changes
git add .
git commit -m "feat: description of changes"
git push origin feature/my-feature

# Create PR on GitHub
```

## 🎯 Node Types

The package includes these OPC UA nodes:

- **OPCUA-IIoT-Connector** - Connection management
- **OPCUA-IIoT-Read** - Read operations
- **OPCUA-IIoT-Write** - Write operations
- **OPCUA-IIoT-Listener** - Subscription/monitoring
- **OPCUA-IIoT-Browser** - Address space browsing
- **OPCUA-IIoT-Server** - OPC UA server
- And more...

Each node has corresponding `.ts` and `.html` files in the `src/` folder.