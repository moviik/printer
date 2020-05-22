extrair inicial
extrair especifico SO

mkdir /usr/share/cups/model/snbc
cp BTPS80\(180\).ppd /usr/share/cups/model/snbc
cp rastertoBTPS80\(180\) /usr/lib/cups/filter/
lpadmin -p SNBC_BTPS80 -E -v 'usb://SNBC/BTP-S80(U)1' -m snbc/'BTPS80(180).ppd'
lpadmin -p SNBC_BTPS80 -o PageSize=Custom.280x180
