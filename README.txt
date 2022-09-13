//Moviik Printer - README
// v1.0 - Rui Palmeira
//NIPPON NP-2411 DRIVER 

1. cp /usr/local/bin/mik-printer/setup/printers/np_3411.sh /usr/local/bin/mik-printer/setup/printers/np_2411.sh
    a. alterar linha 32 - NII_3INCH para NII_2INCH
    b. alterar linha 33 - NII_3INCH para NII_2INCH
2. Correr script sudo ./usr/local/bin/mik-printer/setup/printers/np_2411.sh (trocar o .sh para a impressora/versão correcta)
3. sudo systemctl daemon-reload
4. Activar driver em /etc/systemd/system/mik-printer.service 
    a. alterar linha: ExecStart=/usr/local/bin/node-v10.11.0-linux-x64/bin/npm start -- --modus-cups-printer=CUSTOM_SPA_MODUS3
        para: ExecStart=/usr/local/bin/node-v10.11.0-linux-x64/bin/npm start -- --cups-printer=NII_2INCH
    b. sudo systemctl daemon-reload
    c. sudo systemctl restart mik-dispenser.service
5. sudo vim /usr/local/bin/mik-printer/lib/adapter/cups_adapter.js 
    a. alterar dimensões do pdf para impressão:
        linha 100 - comentar;
        linha 101 - comentar height: '90mm' 
        linha 102 - adicionar > height: `${pageHeight*1.07}px`
        linha 103 - comentar margin: {left: 24}
        linha 104 - comentar pageRanges: '1-1'
6. sudo systemctl daemon-reload
7. sudo systemctl restart mik-printer.service
8. testar impressão senhas 