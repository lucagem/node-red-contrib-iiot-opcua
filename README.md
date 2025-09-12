# node-red-contrib-iiot-opcua-gem

**Enhanced Industrial IoT OPC UA toolbox for Node-RED with extended array handling and dynamic enable/disable features – GEM Edition**

This package builds upon the excellent [node-red-contrib-iiot-opcua](https://github.com/BiancoRoyal/node-red-contrib-iiot-opcua) by Klaus Landsdorf.  
The GEM edition introduces additional features designed for modern industrial automation scenarios.  

---

## 🆕 New Features (GEM Edition)

### 🔧 Dynamic Enable/Disable
The **OPCUA-IIoT-Connector** now provides a **Dynamic Enable** field, located directly below the **Name** field.  

This feature allows you to disable nodes using either a **fixed value** or a **dynamic value** sourced from an environment variable.  

- Leave the field **empty** to preserve the default **Enabled** status (all nodes active).  
- Use **Flexible Values** such as `true/false`, `1/0`, `on/off`, `yes/no`, or environment variables like `${OPCUA_ENABLE}`.  

---

### 📊 Extended Array Support
Full support for multiple OPC UA array data types, with improved handling and type safety:  

- **Broader Array Coverage**: Support for UInt16, UInt32, UInt64, Float, Double, Int16, Int32, Int64, Boolean, String, SByte  
- **Improved Parsing & Processing**: Reliable array read/write operations  
- **TypeScript Definitions**: Stronger typing for development consistency  

---

## 📦 Installation

**Please remove the library "install node-red-contrib-iiot-opcua"** if present.

```bash
# if the "node-red-contrib-iiot-opcua" is present, remove before install
npm remove node-red-contrib-iiot-opcua
# intall the library
npm install node-red-contrib-iiot-opcua-gem
```

---

## 🚀 Quick Start

1. Install the package in your Node-RED environment.  
2. Drag OPC UA IIoT nodes from the palette into your flow.  
3. Configure the **Connector** with OPC UA server details.  
4. (Optional) Set **Dynamic Enable** for conditional connectivity.  
5. Deploy and connect.  

---

### 🔧 Dynamic Enable Configuration

In the **OPCUA-IIoT-Connector** settings:  

- **Empty** → Uses the global `IIOT_OPCUA_ENABLE` environment variable  
- **Static values** → `true`, `false`, `1`, `0`, `on`, `off`, `yes`, `no`  
- **Environment variables** → `${MY_CUSTOM_VAR}`, `${PRODUCTION_MODE}`, etc.  

---

## 📋 Available Nodes

- **OPCUA-IIoT-Connector** – Configurable connector with dynamic enable  
- **OPCUA-IIoT-Inject** – Inject values, including arrays  
- **OPCUA-IIoT-Read** – Read scalar and array values  
- **OPCUA-IIoT-Write** – Write scalar and array values  
- **OPCUA-IIoT-Listener** – Monitor node changes  
- **OPCUA-IIoT-Browser** – Explore the address space  
- **OPCUA-IIoT-Server** – Create an OPC UA server  
- **OPCUA-IIoT-Method-Caller** – Execute OPC UA methods  

---

## 🏭 Use Cases

### Industrial Automation
- **Production Lines**: Conditional OPC UA connectivity to PLCs  
- **Quality Control**: Manage and analyze array-based sensor data  
- **Environment Control**: Toggle nodes based on plant conditions  

### Development & Testing
- **Staging Environments**: Enable/disable via environment variables  
- **Integration Testing**: Scripted toggling of OPC UA connections  
- **Multi-tenant Systems**: Environment-variable driven configurations  

---

## 🛠️ Environment Variables

| Variable            | Description                         | Default |
|---------------------|-------------------------------------|---------|
| `IIOT_OPCUA_ENABLE` | Global enable/disable for all nodes | `true`  |
| Custom variables    | `${VARIABLE_NAME}` in Dynamic Enable | -       |

**Accepted Values:** `true`, `false`, `1`, `0`, `on`, `off`, `yes`, `no` (case-insensitive)  

---
### Array Handling
Enhanced reading/writing of arrays with improved error handling and typing.  

---

## 🔗 Original Project

This project extends **node-red-contrib-iiot-opcua** by Klaus Landsdorf:  
- Repository: https://github.com/BiancoRoyal/node-red-contrib-iiot-opcua  
- Documentation: https://noderedplus.de/  

---

## 🏢 About GEM s.r.l.

Enhancements provided by [GEM s.r.l.](https://www.gemsrl.it/) for industrial IoT and automation.  

**Lead Developer:** Luca Tralli  
**Company:** GEM s.r.l.  

---

## 📄 License
BSD-3-Clause (same as the original project).  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m "Add new feature"`)  
4. Push to your fork (`git push origin feature/my-feature`)  
5. Submit a Pull Request  

---

## 📞 Support

- Report issues via GitHub Issues  
- Refer to original documentation for core functionality  
- Join discussions in the Node-RED community  

---

## 🔄 Version History

### v4.3.0 (Current)  
- ✨ Introduced Dynamic Enable/Disable functionality  
- 📊 Added extended array support  
- 🏷️ GEM edition branding and docs  
- 🔧 Improved TypeScript definitions  

Based on **node-red-contrib-iiot-opcua v4.2.0**.  

---

> ⚠️ **Notice**  
> These modifications have been introduced following the deprecation of the original project.  
> Users and contributors are encouraged to further improve this library.  

---

**Made with ❤️ for the industrial automation community**
