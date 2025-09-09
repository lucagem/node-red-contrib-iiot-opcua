# Copilot Instructions - Dynamic Enable per OPCUA-IIot-Connector

## Obiettivo
Aggiungere un parametro "dynamic-enable" al nodo OPCUA-IIot-Connector per consentire l'abilitazione/disabilitazione dinamica dei nodi attraverso valori statici o variabili di ambiente.

## Panoramica del Problema TS/JS
Il repository è scritto in TypeScript (`src/`) ma viene compilato in JavaScript (`built/`) per l'installazione su Node-RED. Il processo di build è gestito da:
- `tsconfig.json` - configurazione TypeScript
- `package.json` - script di build che compila TS → JS nella directory `built/`
- Node-RED legge i file JS compilati, non quelli TS sorgente

## Setup Visual Studio Code per Sviluppo

### 1. Fork e Clone
```bash
# Fork del repository originale su GitHub
git clone https://github.com/TUO_USERNAME/node-red-contrib-iiot-opcua.git
cd node-red-contrib-iiot-opcua

# Aggiungi remote originale per sincronizzazione
git remote add upstream https://github.com/BiancoRoyal/node-red-contrib-iiot-opcua.git
```

### 2. Installazione Dipendenze
```bash
npm install
```

### 3. Configurazione VS Code
Crea `.vscode/settings.json`:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.validate.enable": true,
  "files.associations": {
    "*.html": "html"
  }
}
```

Crea `.vscode/tasks.json` per automatizzare il build:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build TypeScript",
      "type": "shell",
      "command": "npm",
      "args": ["run", "build"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "silent",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "Build and Link to Node-RED",
      "type": "shell",
      "command": "npm",
      "args": ["run", "build"],
      "group": "build",
      "dependsOrder": "sequence",
      "dependsOn": [],
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### 4. Test Setup per Node-RED
```bash
# Build del progetto
npm run build

# Link per test locale (da eseguire nella directory del progetto)
npm link

# In una directory di test Node-RED
mkdir test-node-red && cd test-node-red
npm init -y
npm link node-red-contrib-iiot-opcua

# Avvia Node-RED per test
npx node-red
```

## Implementazione Dynamic Enable

### 1. Modifica opcua-iiot-connector.html

Nel template HTML (`<script type="text/x-red" data-template-name="OPCUA-IIoT-Connector">`), all'interno del tab settings (`<div id="opcuaiiot-server-tab-settings">`), aggiungere dopo il campo "Name":

```html
<div class="form-row">
    <label for="node-config-input-name"><i class="icon-tag"></i>
    <span data-i18n="node-red:common.label.name"></span></label>
    <input type="text" id="node-config-input-name" placeholder="Name">
</div>

<!-- AGGIUNGERE QUESTO BLOCCO DOPO IL CAMPO NAME -->
<div class="form-row">
    <label for="node-config-input-dynamicEnable"><i class="fa fa-power-off"></i> Dynamic Enable</label>
    <input type="text" id="node-config-input-dynamicEnable" placeholder="Leave empty, 0/false=Disable, 1/true=Enable, ${ENV_VAR}" style="min-width:480px">
</div>
<div class="form-row">
    <label style="font-size: 11px; color: #666; min-width:480px;">
        Accepts: empty (uses global env), 0/false (disable), 1/true (enable), ${IIOT_OPCUA_ENABLE} (env variable)
    </label>
</div>

<hr>
<!-- Il resto del template continua... -->
```

**Nota importante**: Nel connector, tutti gli input hanno il prefisso `node-config-input-` invece di `node-input-` perché è un nodo di configurazione.

Aggiungere nei defaults del JavaScript:
```javascript
RED.nodes.registerType('OPCUA-IIoT-Connector', {
    category: 'config',
    defaults: {
        // ... esistenti ...
        name: {value: "LOCAL SERVER"},
        dynamicEnable: {value: ""}, // AGGIUNGERE QUESTA RIGA
        // ... altri campi ...
    },
    // ... resto della configurazione
});
```

### 2. Modifica opcua-iiot-connector.ts

**A. Aggiungere la proprietà alle interfacce TypeScript:**

Nell'interfaccia `OPCUAIIoTConnectorNode`:
```typescript
export type OPCUAIIoTConnectorNode = nodered.Node<OPCUAIIoTConnectorCredentials> & {
  discoveryUrl: string | null
  endpoint: string
  keepSessionAlive: boolean
  loginEnabled: boolean
  securityPolicy: SecurityPolicy
  messageSecurityMode: MessageSecurityMode
  name: string
  dynamicEnable: string  // ← AGGIUNGERE QUESTA RIGA
  showErrors: boolean
  // ... resto delle proprietà ...
}
```

Nell'interfaccia `OPCUAIIoTConnectorConfigurationDef`:
```typescript
interface OPCUAIIoTConnectorConfigurationDef extends nodered.NodeDef {
  discoveryUrl: string
  endpoint: string
  keepSessionAlive: boolean
  loginEnabled: boolean
  securityPolicy: string
  securityMode: string
  name: string
  dynamicEnable: string  // ← AGGIUNGERE QUESTA RIGA
  showErrors: boolean
  // ... resto delle proprietà ...
}
```

**B. Aggiungere l'inizializzazione nel costruttore:**

Nel costruttore `OPCUAIIoTConnectorConfiguration`, dopo la riga `this.name = config.name`:

```typescript
function OPCUAIIoTConnectorConfiguration(
  this: OPCUAIIoTConnectorNode, config: OPCUAIIoTConnectorConfigurationDef) {
  
  // ... codice esistente ...
  this.name = config.name
  this.dynamicEnable = config.dynamicEnable || ""  // ← AGGIUNGERE QUESTA RIGA
  this.showErrors = config.showErrors
  // ... resto del codice ...
}
```

**C. Aggiungere logica di controllo Dynamic Enable:**

Dopo l'inizializzazione delle proprietà e prima della connessione, aggiungere:

```typescript
// AGGIUNGERE la funzione per valutazione dynamic enable
const evaluateDynamicEnable = (): boolean => {
  const value = this.dynamicEnable.trim()
  
  // Se vuoto, usa la logica esistente (variabile ambiente globale)
  if (!value) {
    return isOpcUaIIoTEnabled()
  }
  
  // Se è una variabile di ambiente (${...})
  if (value.startsWith('${') && value.endsWith('}')) {
    const envVar = value.slice(2, -1) // Rimuove ${ e }
    const envValue = process.env[envVar]
    
    if (!envValue) return true // Default enabled se variabile non esiste
    
    const disabledValues = ['0', 'false', 'FALSE', 'False', 'f', 'F', 'no', 'NO', 'No', 'off', 'OFF', 'Off']
    return !disabledValues.includes(envValue.trim())
  }
  
  // Valori diretti
  const disabledValues = ['0', 'false', 'FALSE', 'False', 'f', 'F', 'no', 'NO', 'No', 'off', 'OFF', 'Off']
  const enabledValues = ['1', 'true', 'TRUE', 'True', 't', 'T', 'yes', 'YES', 'Yes', 'on', 'ON', 'On']
  
  if (disabledValues.includes(value)) return false
  if (enabledValues.includes(value)) return true
  
  return true // Default enabled per valori non riconosciuti
}

// MODIFICARE la logica di inizializzazione per controllare dynamic enable
if (!evaluateDynamicEnable()) {
  setNodeStatusToDisabled(this as any)
  internalDebugLog('Connector disabled by dynamic-enable setting: ' + this.dynamicEnable)
  return // Interrompe l'inizializzazione del connector
}

// AGGIUNGERE import della funzione setNodeStatusToDisabled
// (all'inizio del file con gli altri import)
import { isOpcUaIIoTEnabled, setNodeStatusToDisabled } from './core/opcua-iiot-core'
```
```

### 3. Estendere le funzioni core esistenti
In `opcua-iiot-core.ts`, aggiungere funzioni per il controllo a livello di nodo:

```typescript
/**
 * Controlla se un nodo specifico dovrebbe essere abilitato
 * basandosi sul suo parametro dynamic-enable
 * @param node Nodo da controllare
 * @param dynamicEnable Valore del parametro dynamic-enable del nodo
 * @returns true se abilitato, false se disabilitato
 */
export function isNodeDynamicallyEnabled(node: any, dynamicEnable: string): boolean {
  const value = (dynamicEnable || "").trim()
  
  // Se vuoto, usa la logica globale esistente
  if (!value) {
    return isOpcUaIIoTEnabled()
  }
  
  // Se è una variabile di ambiente (${...})
  if (value.startsWith('${') && value.endsWith('}')) {
    const envVar = value.slice(2, -1)
    const envValue = process.env[envVar]
    
    if (!envValue) return true // Default enabled
    
    const disabledValues = ['0', 'false', 'FALSE', 'False', 'f', 'F', 'no', 'NO', 'No', 'off', 'OFF', 'Off']
    return !disabledValues.includes(envValue.trim())
  }
  
  // Valori diretti
  const disabledValues = ['0', 'false', 'FALSE', 'False', 'f', 'F', 'no', 'NO', 'No', 'off', 'OFF', 'Off']
  const enabledValues = ['1', 'true', 'TRUE', 'True', 't', 'T', 'yes', 'YES', 'Yes', 'on', 'ON', 'On']
  
  if (disabledValues.includes(value)) return false
  if (enabledValues.includes(value)) return true
  
  return true // Default enabled
}

/**
 * Versione estesa di shouldProcessMessage che considera dynamic-enable del nodo
 */
export function shouldProcessMessageWithDynamicEnable(
  node: any, 
  msg: any, 
  nodeType: string, 
  dynamicEnable?: string
): boolean {
  // Prima controlla il parametro specifico del nodo (se fornito)
  if (dynamicEnable !== undefined) {
    if (!isNodeDynamicallyEnabled(node, dynamicEnable)) {
      setNodeStatusToDisabled(node)
      logger.detailDebugLog(`${nodeType} node passing through message - disabled by dynamic-enable: ${dynamicEnable}`)
      node.send(msg)
      return false
    }
  }
  
  // Poi controlla la logica globale esistente
  return shouldProcessMessage(node, msg, nodeType)
}
```

## Workflow di Sviluppo

### 1. Ciclo di Sviluppo
```bash
# 1. Modifica i file TypeScript in src/
# 2. Build
npm run build

# 3. Test in Node-RED locale
# I file compilati sono in built/ e vengono utilizzati da Node-RED

# 4. Debug se necessario
npm run test
```

### 2. Test su Node-RED
1. Avvia Node-RED: `npx node-red`
2. Vai a `http://localhost:1880`
3. Trascina il nodo OPCUA-IIot-Connector
4. Configura il nuovo campo "Dynamic Enable"
5. Testa i diversi valori:
   - Vuoto
   - `0` o `false`
   - `1` o `true`
   - `${IIOT_OPCUA_ENABLE}`

### 3. Gestione Git per Merge Request
```bash
# Sincronizza con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crea branch per feature
git checkout -b feature/dynamic-enable-connector

# Commit delle modifiche
git add .
git commit -m "Add dynamic-enable parameter to OPCUA-IIot-Connector

- Add dynamic-enable input field to connector HTML
- Implement evaluation logic for static values and env vars
- Extend core functions for node-specific enable/disable
- Support empty, 0/false, 1/true, and ${ENV_VAR} formats"

# Push e crea PR
git push origin feature/dynamic-enable-connector
```

## File da Modificare

1. **src/opcua-iiot-connector.html** - Aggiungere UI field
2. **src/opcua-iiot-connector.ts** - Aggiungere logica TypeScript
3. **src/core/opcua-iiot-core.ts** - Estendere funzioni esistenti
4. **Test** - Verificare funzionalità in Node-RED

## Note di Debug

- I file di log sono in `~/.node-red/`
- Usare `logger.internalDebugLog()` per debug
- Controllare sempre la directory `built/` per vedere il JavaScript compilato
- Il hot-reload non è supportato: rebuild necessario dopo modifiche TS

## Variabili di Ambiente di Test
```bash
# Test abilitazione
export IIOT_OPCUA_ENABLE=true
export IIOT_OPCUA_ENABLE=1

# Test disabilitazione  
export IIOT_OPCUA_ENABLE=false
export IIOT_OPCUA_ENABLE=0

# Test variabile custom
export MY_OPCUA_ENABLE=true
# Usa ${MY_OPCUA_ENABLE} nel campo dynamic-enable
```