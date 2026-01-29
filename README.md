# node-red-contrib-iiot-opcua-gem

**Enhanced Industrial IoT OPC UA toolbox for Node-RED with dynamic credentials and extended array handling – GEM Edition**

This package builds upon the excellent [node-red-contrib-iiot-opcua](https://github.com/BiancoRoyal/node-red-contrib-iiot-opcua) by Klaus Landsdorf.  
The GEM edition introduces additional features designed for modern industrial automation scenarios.  

---

## 🆕 New Features (GEM Edition)

### 🔐 Dynamic Credentials (v4.3.1)
The **OPCUA-IIoT-Connector** now supports **dynamic authentication** using environment variables, perfect for Docker/Kubernetes deployments and production environments.

**Key Benefits:**
- 🔒 **Secure**: Credentials stored outside flow configurations
- 🐳 **Docker-friendly**: Native environment variable support
- 🔄 **Flexible**: Switch between environments without modifying flows
- ↩️ **Backward compatible**: Works seamlessly with existing static credentials

**Configuration:**

In the **Security** tab, find the new **"Dynamic Credentials"** section:

- **Use Login Dynamic**: `{OPCUA_USE_LOGIN}`
- **User Dynamic**: `{OPCUA_USER}`
- **Password Dynamic**: `{OPCUA_PASSWORD}`

**Environment Variables:**

```yaml
# Docker Compose example
environment:
  - OPCUA_USE_LOGIN=true     # or: 1, yes, YES, True
  - OPCUA_USER=admin
  - OPCUA_PASSWORD=secure123
```

**Features:**
- ✅ Real-time validation with visual feedback (green/red borders)
- ✅ Case-insensitive boolean values (`true/TRUE/True`, `yes/YES/Yes`, `1`)
- ✅ Priority: Dynamic > Static credentials
- ✅ Secure logging: Passwords always shown as `[HIDDEN]`
- ✅ Automatic trimming of whitespace
- ✅ Graceful fallback to anonymous connection on errors

---

### 🔧 Dynamic Enable/Disable (v4.3.0)
The **OPCUA-IIoT-Connector** provides a **Dynamic Enable** field for conditional node activation.

This feature allows you to disable nodes using either a **fixed value** or a **dynamic value** sourced from an environment variable.  

- Leave the field **empty** to preserve the default **Enabled** status (all nodes active).  
- Use **Flexible Values** such as `true/false`, `1/0`, `on/off`, `yes/no`, or environment variables like `${OPCUA_ENABLE}`.  

---

### 📊 Extended Array Support (v4.3.0)
Full support for multiple OPC UA array data types, with improved handling and type safety:  

- **Broader Array Coverage**: Support for UInt16, UInt32, UInt64, Float, Double, Int16, Int32, Int64, Boolean, String, SByte  
- **Improved Parsing & Processing**: Reliable array read/write operations  
- **TypeScript Definitions**: Stronger typing for development consistency  

---

## 📦 Installation

**Please remove the library "node-red-contrib-iiot-opcua"** if present.

```bash
# If "node-red-contrib-iiot-opcua" is present, remove before install
npm remove node-red-contrib-iiot-opcua

# Install this library
npm install node-red-contrib-iiot-opcua-gem
```

---

## 🚀 Quick Start

### Basic Setup

1. Install the package in your Node-RED environment  
2. Drag OPC UA IIoT nodes from the palette into your flow  
3. Configure the **Connector** with OPC UA server details  
4. Deploy and connect  

### Using Dynamic Credentials

1. Open the **OPCUA-IIoT-Connector** configuration  
2. Navigate to the **Security** tab  
3. Scroll to **"Dynamic Credentials (Environment Variables)"**  
4. Enter environment variable references:
   - Use Login: `{OPCUA_USE_LOGIN}`
   - User: `{OPCUA_USER}`
   - Password: `{OPCUA_PASSWORD}`
5. Set up your environment variables (Docker, .env file, or system)
6. Deploy your flow

**Docker Example:**

```yaml
version: '3.8'
services:
  nodered:
    image: nodered/node-red:latest
    environment:
      - OPCUA_USE_LOGIN=true
      - OPCUA_USER=admin
      - OPCUA_PASSWORD=mySecurePassword
    ports:
      - "1880:1880"
    volumes:
      - ./data:/data
```

---

## 📋 Configuration Examples

### Dynamic Credentials Priority

The connector uses this priority order:

1. **Dynamic credentials** (from environment variables) - if configured
2. **Static credentials** (from node configuration) - if dynamic not available
3. **Anonymous** (no authentication) - if neither available or login disabled

### Accepted Values

**OPCUA_USE_LOGIN:**
- Enable: `true`, `TRUE`, `True`, `1`, `yes`, `YES`, `Yes`
- Disable: `false`, `FALSE`, `False`, `0`, `no`, `NO`, `No`
- Empty/Not Set: Uses static `loginEnabled` setting

**Validation:**

Environment variable references must follow the pattern: `{VARIABLE_NAME}`
- ✅ Valid: `{OPCUA_USER}`, `{MY_PASSWORD}`, `{TEST_123}`
- ❌ Invalid: `OPCUA_USER`, `{opcua_user}`, `{123_VAR}`, `{MY-VAR}`

Visual feedback:
- 🟢 **Green border**: Valid format
- 🔴 **Red border**: Invalid format
- ⚪ **No border**: Empty (uses static config)

---

### 🔧 Dynamic Enable Configuration

In the **OPCUA-IIoT-Connector** settings:  

- **Empty** → Uses the global `IIOT_OPCUA_ENABLE` environment variable  
- **Static values** → `true`, `false`, `1`, `0`, `on`, `off`, `yes`, `no`  
- **Environment variables** → `${MY_CUSTOM_VAR}`, `${PRODUCTION_MODE}`, etc.

---

## 🔍 Troubleshooting

### Environment Variables Not Working

**Problem:** Credentials show as `{OPCUA_USER}` instead of actual values

**Solution:** In Docker Compose, use `${VAR}` syntax (with `$`):

```yaml
# ❌ Wrong
environment:
  - OPCUA_USER={OPCUA_USER}

# ✅ Correct
environment:
  - OPCUA_USER=${OPCUA_USER}
```

### BadUserAccessDenied Error

**Causes:**
1. Incorrect username/password for the OPC-UA server
2. User not authorized on the server
3. Server security policy incompatible

**Solution:**
- Verify credentials are correct for your OPC-UA server
- Test with static credentials first
- Check Node-RED logs for actual values being used:
  ```
  [info] Dynamic user: admin (from OPCUA_USER)
  [info] Connecting with authentication (User: admin)
  ```

### Validation Errors

**Red Border on Input:**
- Check variable name format: `{UPPERCASE_UNDERSCORE}`
- Ensure braces are present: `{VAR}` not `VAR`
- Use only uppercase letters, numbers, and underscores

---

## 📊 Logging

When using dynamic credentials, you'll see informative logs:

```
[info] [OPCUA-IIoT-Connector] Using dynamic credentials from environment variables
[info] [OPCUA-IIoT-Connector] Dynamic login enabled: true (from OPCUA_USE_LOGIN)
[info] [OPCUA-IIoT-Connector] Dynamic user: admin (from OPCUA_USER)
[info] [OPCUA-IIoT-Connector] Dynamic password loaded (from OPCUA_PASSWORD)
[info] [OPCUA-IIoT-Connector] Connecting with authentication (User: admin)
```

Or with static credentials:

```
[info] [OPCUA-IIoT-Connector] Using static credentials from node configuration
[info] [OPCUA-IIoT-Connector] Connecting with authentication (User: admin)
```

---

## 🏢 Credits

Enhancements provided by [GEM s.r.l.](https://www.gemsrl.it/) for industrial IoT and automation.  

**Lead Developer:** Luca Tralli  
**Company:** GEM s.r.l.  

Based on the excellent work by Klaus Landsdorf and the Node-RED community.

---

## 📄 License

BSD-3-Clause (same as the original project).  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m "feat: add new feature"`)  
4. Push to your fork (`git push origin feature/my-feature`)  
5. Submit a Pull Request  

---

## 📞 Support

- **Issues**: Report via [GitHub Issues](https://github.com/lucagem/node-red-contrib-iiot-opcua-gem/issues)
- **Documentation**: See [Development Guide](./DEVELOPMENT.md)
- **Community**: Join discussions in the Node-RED community  

---

## 🔄 Version History

### v4.3.1 (Latest)
- 🔐 **Dynamic Credentials**: Environment variable support for authentication
- 📊 **Enhanced Logging**: Visible credential source indicators
- 🔒 **Security**: Passwords always hidden in logs
- ✅ **Validation**: Real-time UI feedback for variable format
- ↩️ **Backward Compatible**: Works with existing configurations

### v4.3.0
- ✨ Dynamic Enable/Disable functionality  
- 📊 Extended array support  
- 🏷️ GEM edition branding and docs  
- 🔧 Improved TypeScript definitions  

Based on **node-red-contrib-iiot-opcua v4.2.0**.  

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** with real credentials to version control
2. **Use Docker Secrets** or **Kubernetes Secrets** in production
3. **Rotate credentials regularly**
4. **Use least-privilege** OPC-UA user accounts
5. **Enable TLS/encryption** for OPC-UA connections when possible
6. **Monitor logs** for authentication failures

---

## 📚 Additional Resources

- [Testing and Deployment Guide](./docs/TESTING_DEPLOYMENT.md)
- [Development Guide](./DEVELOPMENT.md)
- [Changelog](./CHANGELOG.md)
- [Original Project](https://github.com/BiancoRoyal/node-red-contrib-iiot-opcua)

---

> ⚠️ **Notice**  
> These modifications have been introduced following the deprecation of the original project.  
> Users and contributors are encouraged to further improve this library.  

---

**Made with ❤️ for the industrial automation community**