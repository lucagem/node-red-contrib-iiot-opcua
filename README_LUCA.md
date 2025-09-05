# Abilitazione dei nodi in base alla connessione
Vorrei aggiungere un parametro di abilitazione al nodo "OPCUA-IIot-Connector.
Dopo al "Name" aggiungiamo una casella di testo chiamata "dynamic-enable" con la label "Dynamic Enable" dove possiamo accettare: un valore vuoto (non fa nulla); 0/false = Disable; 1/true = Enable; variabile di ambiente tipo ${IIOT_OPCUA_ENABLE} che potrà essere "Vuota", 0, false, 1, true

