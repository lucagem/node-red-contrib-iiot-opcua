# node-red-contrib-iiot-opcua-gem

**Enhanced Industrial IoT OPC UA toolbox for Node-RED with array support and dynamic enable/disable features - GEM edition**

Based on the excellent [node-red-contrib-iiot-opcua](https://github.com/BiancoRoyal/node-red-contrib-iiot-opcua) by Klaus Landsdorf, this enhanced version adds powerful new capabilities for industrial automation scenarios.

## 🆕 New Features (GEM Edition)

### 🔧 Dynamic Enable/Disable System
Control OPC-UA nodes dynamically through environment variables or static values:

- **Global Control**: Set `IIOT_OPCUA_ENABLE=false` to disable all nodes
- **Per-Node Control**: Individual Dynamic Enable field in Connector configuration
- **Flexible Values**: Supports `true/false`, `1/0`, `on/off`, `yes/no`, and custom environment variables like `${MY_OPCUA_ENABLE}`
- **Runtime Control**: Enable/disable nodes without code changes

### 📊 Enhanced Array Support
Extended support for OPC-UA array data types:

- **Multiple Array Types**: Support for various array configurations
- **Improved Data Handling**: Better parsing and processing of array values
- **Type Safety**: Enhanced TypeScript definitions for array operations

## 📦 Installation

```bash
npm install node-red-contrib-iiot-opcua-gem
```

## 🚀 Quick Start

1. **Install the package** in your Node-RED environment
2. **Drag OPC-UA IIoT nodes** from the palette to your flow
3. **Configure Connector** with your OPC-UA server details
4. **Set Dynamic Enable** (optional) for conditional node operation
5. **Deploy and connect** to your OPC-UA server

### Dynamic Enable Configuration

In the **OPCUA-IIoT-Connector** configuration:

- **Empty**: Uses global `IIOT_OPCUA_ENABLE` environment variable
- **Static values**: `true`, `false`, `1`, `0`, `on`, `off`, `yes`, `no`
- **Environment variables**: `${MY_CUSTOM_VAR}`, `${PRODUCTION_MODE}`, etc.

**Examples:**
```bash
# Global disable
export IIOT_OPCUA_ENABLE=false

# Custom per-environment
export PRODUCTION_MODE=true
# Then use ${PRODUCTION_MODE} in Dynamic Enable field
```

## 📋 Available Nodes

- **OPCUA-IIoT-Connector** - Server connection with dynamic enable
- **OPCUA-IIoT-Inject** - Inject data with array support
- **OPCUA-IIoT-Read** - Read values and arrays
- **OPCUA-IIoT-Write** - Write values and arrays
- **OPCUA-IIoT-Listener** - Monitor changes
- **OPCUA-IIoT-Browser** - Browse address space
- **OPCUA-IIoT-Server** - Create OPC-UA server
- **OPCUA-IIoT-Method-Caller** - Call OPC-UA methods
- And more...

## 🏭 Use Cases

### Industrial Automation
- **Production Lines**: Monitor PLCs with conditional connectivity
- **Quality Control**: Array-based sensor data collection
- **Environment Control**: Enable/disable based on operational status

### Development & Testing
- **Staging Environments**: Use environment variables to control connections
- **Integration Testing**: Programmatic enable/disable of OPC-UA connectivity
- **Multi-tenant Deployments**: Per-tenant OPC-UA configuration

## 🛠️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `IIOT_OPCUA_ENABLE` | Global enable/disable for all nodes | `true` |
| Custom variables | Use `${VARIABLE_NAME}` in Dynamic Enable field | - |

**Accepted Values:** `true`, `false`, `1`, `0`, `on`, `off`, `yes`, `no` (case-insensitive)

## 📚 Examples

### Basic Connection with Dynamic Enable

```javascript
// Environment
process.env.PRODUCTION_READY = "true";

// In Connector Dynamic Enable field: ${PRODUCTION_READY}
// Node will only connect when PRODUCTION_READY=true
```

### Array Data Handling

Enhanced support for reading and writing array values from/to OPC-UA servers, with improved type safety and error handling.

## 🔗 Original Project

This project is based on **node-red-contrib-iiot-opcua** by Klaus Landsdorf and contributors:
- Original repository: https://github.com/BiancoRoyal/node-red-contrib-iiot-opcua
- Documentation: https://noderedplus.de/

## 🏢 About GEM s.r.l.

Enhanced by [GEM s.r.l.](https://www.gemsrl.it/) for industrial automation and IoT applications.

**Enhancements by:** Luca Tralli  
**Company:** GEM s.r.l.  
**Website:** https://www.gemsrl.it/

## 📄 License

BSD-3-Clause (same as original project)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: Please report bugs and feature requests on GitHub
- **Documentation**: Check the original project documentation
- **Community**: Node-RED community forums

## 🔄 Version History

### v4.2.0 (Current)
- ✨ Added Dynamic Enable/Disable functionality
- 📊 Enhanced array support for various data types
- 🏷️ GEM edition branding and documentation
- 🔧 Improved TypeScript definitions

Based on **node-red-contrib-iiot-opcua v4.2.0** with additional enhancements.

---

**Made with ❤️ for the industrial automation community**