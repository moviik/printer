// Custom Engineering SPA
// USB "interface 0" C library for communication with Custom printers


#ifndef _COM_USB_IF0_CUSTOM_H
#define _COM_USB_IF0_CUSTOM_H 1


#include <errno.h>
#include <fcntl.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <dirent.h>
#include <sys/ioctl.h>
#include <sys/time.h>


typedef unsigned long DWORD;
typedef unsigned short WORD;
typedef unsigned short BOOL;


//    ---------- 'PUBLIC' FUNCTIONS ----------:
/*-------------------------------------------------------------------------------------------------


	DWORD openUSBDevice(long,long,const char*);
	DWORD GetPrinterStatus(unsigned char* bufferRecv,const DWORD dwSize,DWORD* dwRead);
	DWORD closeUSBDevice();

	DWORD openUSBDevice(int *iPrinterID, long,long,const char*);
	DWORD GetPrinterStatus(int iPrinterID, unsigned char* bufferRecv,const DWORD dwSize,DWORD* dwRead);
	DWORD closeUSBDevice(int iPrinterID);

--------------------------------------------------------------------------------------------------*/
/* This function initialized and opens the USB printer status connection , with the specified parameters.
   Parameters:
   - Vendor ID (int)
   - Product ID (int)
   - Serial Number (constant string)
   Usage example: InitDeviceIf0(0xdd4, 0x01A8, ,TG2480H Num.: 0");
    Note:
    - 1st parameter = -1 : all Vendor IDs will be accepted (be careful!!!) ***
    - 2nd parameter = -1 : all Product IDs will be accepted
    - 3rd parameter = NULL or 'empty string' : all Serial Numbers will be accepted
    
   Return values:

   - SUCCESS      
   - ERR_NO_INIT
   - ERR_OPEN_DEVICE
   - ERR_ALREADY_OPENED
   - ERR_PARAMINIT_NOT_VALID
*/

DWORD openUSBDevice(long,long,const char*);

/*
   This function the printer status 
   Parameters:
   - buffer to store data in
   - size of the provided buffer
   - return parameter, where the function will store actually read data size

   Return values:
   - ERR_NOT_OPENED
   - ERR_IOCTL_SEND
   - ERR_IOCTL_PIPE
   - ERR_IOCTL_OVERFLOW
   - ERR_IOCTL_LOW_LEVEL
   - ERR_IOCTL_GENERAL
   - ERR_IOCTL_TIMEOUT
   - ERR_READ_BUFFER_FULL
   - ERR_READING_USB
   - SUCCESs

*/


DWORD GetPrinterStatus(unsigned char* bufferRecv,const DWORD dwSize,DWORD* dwRead);


/* This function closes the printer USB status device.
   Return values:
   - ERR_NOT_OPENED
   - ERR_CLOSE
   - SUCCESS
*/

DWORD closeUSBDevice();




DWORD openPrinterDevice(int *iPrinterID, long,long,const char*);
DWORD GetPrinterDeviceStatus(int iPrinterID, unsigned char* bufferRecv,const DWORD dwSize,DWORD* dwRead);
DWORD closePrinterDevice(int iPrinterID);

//Get CeSmLm.so Version
char* GetLibVers();

#endif    
