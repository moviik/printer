# Mik-Printer
This application is responsible to print tickets and obtain printer status.
The layout of the ticket is defined in lib/printer/ticket-template.

# Contribute
System requirements
 - node (version 10.11.0) - because node-ffi dependency does not work with node10+
 - see setup deps for your environment

# Choose your printer

`npm start` is not enough. You must provide the printer adapter along with the printer name. You must provide one of the following:
1. `--cups-printer=whatever` if you want to use the generic cups adapter with the printer name you configured on CUPS
1. `--modus-cups-printer=whatever` if you want to use the MODUS3 printer specific adapter with the printer name you configured on CUPS
