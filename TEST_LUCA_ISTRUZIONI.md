# Testing e Deployment di Librerie Node-RED TypeScript Modificate

## 📋 Panoramica

Questa guida descrive il processo completo per testare e deployare modifiche a librerie Node-RED scritte in TypeScript, con particolare riferimento a `node-red-contrib-iiot-opcua-gem`.

---

## 🎯 Obiettivi

- Modificare sorgenti TypeScript
- Testare le modifiche in ambiente locale
- Deployare su installazioni Node-RED di produzione
- Gestire configurazioni tramite environment variables

---

## 📁 Struttura del Progetto

```
node-red-contrib-iiot-opcua-gem/
├── src/                          # Sorgenti TypeScript
│   ├── opcua-iiot-connector.ts  # Logica del nodo
│   ├── opcua-iiot-connector.html # Interfaccia UI
│   └── ...                       # Altri nodi
├── opcuaIIoT/                   # JavaScript compilato (auto-generato)
│   ├── opcua-iiot-connector.js  # ← File da deployare
│   ├── opcua-iiot-connector.html # ← File da deployare
│   └── ...
├── node-red-test/               # Ambiente test locale
│   └── .node-red/              # Dati Node-RED test
├── build-and-test.bat          # Build + Test completo
├── quick-test.bat              # Build veloce
├── start-node-red.bat          # Avvia Node-RED test
└── run-tests.bat               # Test interattivo
```

---

## 🚀 Workflow di Sviluppo Locale

### 1. Setup Iniziale

```bash
# Clone del repository
git clone [repository-url]
cd node-red-contrib-iiot-opcua-gem

# Installazione dipendenze
npm install

# Verifica ambiente
npm run build
```

### 2. Modifica Sorgenti

Modifica i file TypeScript in `src/`:
- `src/opcua-iiot-connector.ts` - Logica backend
- `src/opcua-iiot-connector.html` - Interfaccia UI

### 3. Build e Test

#### Opzione A: Build Completo con Test

```cmd
build-and-test.bat
```

**Cosa fa:**
1. Compila TypeScript → JavaScript
2. Esegue unit test, core test, e2e test
3. Verifica se Node-RED è in esecuzione
4. Fornisce istruzioni per avvio

**Output atteso:**
```
[1/4] Building TypeScript sources...
✓ Build completed successfully

[2/4] Running unit tests...
✓ Tests completed successfully

[3/4] Checking if Node-RED is running...
ℹ Node-RED is not running

[4/4] Ready to test in Node-RED!
```

#### Opzione B: Build Veloce (Solo Compilazione)

```cmd
quick-test.bat
```

**Quando usarlo:**
- Durante sviluppo iterativo
- Quando i test richiedono troppo tempo
- Per verifiche rapide di sintassi

**Output atteso:**
```
Building TypeScript sources...
✓ Build completed successfully!

Your changes are ready for testing in Node-RED.
If Node-RED is running, restart it to see the changes.
```

### 4. Avvio Ambiente Test

```cmd
start-node-red.bat
```

**Cosa fa:**
1. Verifica che la porta 1880 sia libera
2. Configura variabili di debug
3. Setta environment variables di test
4. Avvia Node-RED sulla porta 1880

**Configurazione automatica:**
```batch
set DEBUG=opcuaIIoT:core,opcuaIIoT:write,opcuaIIoT:connector*
set OPC_ENABLE=1
set OPCUA_USE_LOGIN=true
set OPCUA_USER=testuser
set OPCUA_PASSWORD=testpass123
```

**Accesso interfaccia:** http://127.0.0.1:1880/

### 5. Test nell'Interfaccia

1. Cerca "opcua" nella palette nodi
2. Trascina il nodo nel flow
3. Doppio-click per configurarlo
4. Verifica le modifiche nell'UI
5. Deploy e controlla i log

**Log attesi:**
```
[info] Using dynamic credentials from environment variables
[info] Dynamic login enabled: true (from OPCUA_USE_LOGIN)
[info] Dynamic user: testuser (from OPCUA_USER)
[info] Dynamic password loaded (from OPCUA_PASSWORD)
[info] Connecting with authentication (User: testuser)
```

### 6. Ciclo di Sviluppo Rapido

```cmd
# 1. Modifica file TypeScript
# 2. Build veloce
quick-test.bat

# 3. Riavvia Node-RED (nel terminale dove gira)
# Premi Ctrl+C, poi:
start-node-red.bat

# 4. Ricarica browser
# Ctrl+Shift+R
```

---

## 🎯 Test Avanzati

### Test Suite Completo

```cmd
run-tests.bat
```

**Menu interattivo:**
```
[1] All tests (standard + verbose)
[2] Unit tests only
[3] Core tests only
[4] E2E tests only
[5] Tests with coverage report
[6] Quick syntax check only
```

### Coverage Report

```cmd
npm run coverage
```

Report generato in: `./jcoverage/lcov-report/index.html`

---

## 📦 Deployment su Node-RED Produzione

### File da Deployare

Dalla directory `opcuaIIoT/` (compilata), copiare:
- `opcua-iiot-connector.js`
- `opcua-iiot-connector.html`

### Destinazione

```
[NODE_RED_DIR]/node_modules/node-red-contrib-iiot-opcua-gem/opcuaIIoT/
├── opcua-iiot-connector.js      ← Sostituire
├── opcua-iiot-connector.html    ← Sostituire
```

### Procedura Windows (Locale)

```powershell
# 1. Trova directory Node-RED
# Tipicamente: C:\Users\[username]\.node-red\

# 2. Backup
cd C:\Users\[username]\.node-red\node_modules\node-red-contrib-iiot-opcua-gem\opcuaIIoT
copy opcua-iiot-connector.js opcua-iiot-connector.js.backup
copy opcua-iiot-connector.html opcua-iiot-connector.html.backup

# 3. Copia nuovi file
copy "C:\path\to\dev\opcuaIIoT\opcua-iiot-connector.js" .
copy "C:\path\to\dev\opcuaIIoT\opcua-iiot-connector.html" .

# 4. Riavvia Node-RED
```

### Procedura Linux/NAS (Docker)

#### Via Script Automatici

Sul NAS, utilizzare gli script preparati:

```bash
# 1. Copia file sul NAS
# Via SCP/SFTP nella directory base:
# /volume1/docker/[nome-deployment]/nodered_[porta]/

# 2. SSH sul NAS
ssh admin@NAS_IP
cd /volume1/docker/[nome-deployment]/nodered_[porta]

# 3. Rendi eseguibili
chmod +x *.sh

# 4. Usa il menu interattivo
./manage-opcua-nodes.sh
```

**Menu disponibile:**
```
1) Backup dei file attuali
2) Deploy nuovi files
3) Restore da backup
4) Verifica installazione
5) Lista backup disponibili
```

#### Manuale

```bash
# 1. Backup
cp opcuaIIoT/opcua-iiot-connector.js opcuaIIoT/opcua-iiot-connector.js.backup
cp opcuaIIoT/opcua-iiot-connector.html opcuaIIoT/opcua-iiot-connector.html.backup

# 2. Copia file
cp /path/to/new/opcua-iiot-connector.js opcuaIIoT/
cp /path/to/new/opcua-iiot-connector.html opcuaIIoT/

# 3. Riavvia container
docker restart [container-name]
```

---

## ⚙️ Configurazione Environment Variables

### Docker Compose

Nel file `docker-compose.yml`:

```yaml
services:
  nodered:
    image: nodered/node-red:latest
    environment:
      # ⚠️ IMPORTANTE: Usare ${VAR} con $ per espansione
      - OPCUA_USE_LOGIN=${OPCUA_USE_LOGIN}
      - OPCUA_USER=${OPCUA_USER}
      - OPCUA_PASSWORD=${OPCUA_PASSWORD}
```

Nel file `.env` (stessa directory):

```bash
OPCUA_USE_LOGIN=true
OPCUA_USER=admin
OPCUA_PASSWORD=password123
```

**❌ ERRORE COMUNE:**
```yaml
# SBAGLIATO - Non espande le variabili!
- OPCUA_USE_LOGIN={OPCUA_USE_LOGIN}  # Senza $

# CORRETTO
- OPCUA_USE_LOGIN=${OPCUA_USE_LOGIN}  # Con $
```

### Valori Accettati

**OPCUA_USE_LOGIN:**
- `true`, `TRUE`, `True` → Login abilitato
- `1`, `yes`, `YES`, `Yes` → Login abilitato
- `false`, `FALSE`, `False` → Login disabilitato
- `0`, `no`, `NO`, `No` → Login disabilitato
- Vuoto o assente → Usa configurazione statica

**OPCUA_USER / OPCUA_PASSWORD:**
- Qualsiasi stringa
- Vengono automaticamente trimmate (spazi rimossi)

### Verifica Environment Variables

```bash
# In Docker
docker exec [container] env | grep OPCUA

# Output atteso:
OPCUA_USE_LOGIN=true
OPCUA_USER=admin
OPCUA_PASSWORD=password123
```

---

## 🔍 Troubleshooting

### Build Fallisce

**Sintomi:**
```
✗ Build failed! Check the errors above.
```

**Soluzione:**
1. Verifica errori TypeScript nel log
2. Controlla sintassi in file `.ts` modificati
3. Verifica dipendenze: `npm install`

### Node-RED Non Carica Nodi

**Sintomi:**
```
[warn] Missing node modules:
[warn]  - node-red-contrib-iiot-opcua-gem
```

**Soluzioni:**
```bash
# Opzione 1: Re-link
npm link
cd node-red-test
npm link node-red-contrib-iiot-opcua-gem

# Opzione 2: Re-install
cd node-red-test
npm install ..

# Riavvia Node-RED
```

### Environment Variables Non Funzionano

**Sintomi:**
```
Dynamic user from OPCUA_USER: {OPCUA_USER}  ← Letterale!
```

**Causa:** Manca `$` nel docker-compose.yml

**Soluzione:**
```yaml
# Cambia da:
- OPCUA_USER={OPCUA_USER}

# A:
- OPCUA_USER=${OPCUA_USER}
```

### Credenziali Corrette ma BadUserAccessDenied

**Possibili cause:**
1. Username/password errati per il server OPC-UA
2. Utente non autorizzato sul server
3. Policy di sicurezza server incompatibili

**Verifica:**
```bash
# Controlla che le credenziali statiche funzionino
# Se statiche OK ma dinamiche NO → problema env vars

# Verifica env vars effettive:
docker exec [container] env | grep OPCUA

# Verifica log Node-RED:
docker logs -f [container] | grep -i "dynamic"
```

---

## 📊 Checklist Deployment

### Pre-Deployment
- [ ] Modifiche TypeScript completate
- [ ] `quick-test.bat` eseguito con successo
- [ ] Test locale in Node-RED funzionante
- [ ] Environment variables configurate
- [ ] Git commit delle modifiche

### Deployment
- [ ] Backup file originali creato
- [ ] File `.js` e `.html` copiati
- [ ] Node-RED riavviato
- [ ] Nodi visibili nella palette
- [ ] UI mostra modifiche corrette

### Post-Deployment
- [ ] Log verificati (nessun errore)
- [ ] Connessione OPC-UA funzionante
- [ ] Test con login abilitato OK
- [ ] Test con login disabilitato OK
- [ ] Documentazione aggiornata

---

## 📚 Riferimenti

### File Importanti
- `DEVELOPMENT.md` - Guida sviluppo completa
- `package.json` - Script npm disponibili
- `README.md` - Documentazione progetto

### Script Batch Disponibili
- `build-and-test.bat` - Build + test completo
- `quick-test.bat` - Solo build
- `start-node-red.bat` - Avvia test environment
- `run-tests.bat` - Suite test interattiva

### Script Bash (NAS/Linux)
- `manage-opcua-nodes.sh` - Menu interattivo
- `backup-opcua-nodes.sh` - Backup automatico
- `deploy-opcua-nodes.sh` - Deploy automatico
- `restore-opcua-nodes.sh` - Restore da backup

---

## 🎓 Best Practices

### Durante Sviluppo
1. Usa `quick-test.bat` per iterazioni rapide
2. Committa frequentemente con messaggi chiari
3. Testa sia con che senza environment variables
4. Verifica log per ogni modifica

### Prima del Deployment
1. Esegui `build-and-test.bat` completo
2. Testa in ambiente locale identico alla produzione
3. Prepara procedura di rollback (backup)
4. Documenta le modifiche

### In Produzione
1. Fai sempre backup prima di sovrascrivere
2. Deploy in finestre di manutenzione
3. Monitora log dopo deployment
4. Testa funzionalità critiche
5. Mantieni backup disponibile per rollback rapido

---

## 🔐 Sicurezza

### Environment Variables
- Non committare file `.env` con password reali
- Usa secret management per produzione (Docker Secrets, Vault)
- Le password nei log sono sempre nascoste `[HIDDEN]`

### File di Configurazione
- Backup contengono timestamp per tracciabilità
- Restore disponibile in caso di problemi
- File sensibili mai in repository pubblici

---

**Versione documento:** 1.0  
**Ultimo aggiornamento:** 29 Gennaio 2026  
**Autore:** GEM Development Team