/***************************************************************************
 *   Copyright (C) 2013 by Marco Gaibazzi,,,   *
 *   marco@marco-desktop   *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 *   This program is distributed in the hope that it will be useful,       *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 *   GNU General Public License for more details.                          *
 *                                                                         *
 *   You should have received a copy of the GNU General Public License     *
 *   along with this program; if not, write to the                         *
 *   Free Software Foundation, Inc.,                                       *
 *   59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.             *
 ***************************************************************************/
#ifndef _CUSTOMXMLPRINT__H_
#define _CUSTOMXMLPRINT__H_

/** @cond */

#define CXP_SUCCESS		0
#define CXP_FAILURE		-1



#define CUSTOMXPLIB_WINAPI

#if defined(WINDOWS) || defined(WIN32)
   /* If building or using lib as a DLL, define CUSTOMLIB_DLL.
    * This is not mandatory, but it offers a little performance increase.
    */
#  ifdef CUSTOMXPLIB_DLL
#    if defined(WIN32) && (!defined(__BORLANDC__) || (__BORLANDC__ >= 0x500))
#      ifdef CUSTOMXPLIB_INTERNAL
#        define CUSTOMXPEXTERN extern __declspec(dllexport)
#      else
#        define CUSTOMXPEXTERN extern __declspec(dllimport)
#      endif
#    endif
#  endif  /* CUSTOMLIB_DLL */
   /* If building or using zlib with the WINAPI/WINAPIV calling convention,
    * define CUSTOMLIB_WINAPI.
    * Caution: the standard ZLIB1.DLL is NOT compiled using ZLIB_WINAPI.
    */
#ifdef CUSTOMXPLIB_WINAPI
#    include <windows.h>
     /* No need for _export, use .DEF instead. */
     /* For complete Windows compatibility, use WINAPI, not __stdcall. */
#    define CUSTOMXPEXPORT WINAPI
#endif

#endif /* WINDOWS || WIN32 */

#ifndef CUSTOMXPEXTERN
#  define CUSTOMXPEXTERN extern
#endif

/** @endcond */

enum _CustomXmlPrintResult
{

	/**
        * Success
        */
        CUSTOM_XMLPRINT_SUCCESS = 0,
        /**
        * Generic failure
        */
        CUSTOM_XMLPRINT_GENERIC_FAILURE = 1,
        /**
        * Invalid argument
        */
        CUSTOM_XMLPRINT_INVALID_ARGUMENT = 2,
        /**
        * Printer name is not valid
        */
        CUSTOM_XMLPRINT_NOT_VALID_PRINTER = 3,
        /**
        * Internal engine library error
        */
        CUSTOM_XMLPRINT_INTERNAL_LIBRARY_ERROR = 4,
        /**
        * Library error
        */
        CUSTOM_XMLPRINT_LIBRARY_ERROR = 5,
        /**
        * not connected error
        */
        CUSTOM_XMLPRINT_NOT_CONNECTED_ERROR = 6,
        /**
        * security error
        */
        CUSTOM_XMLPRINT_SECURITY_ERROR = 7,
};
typedef enum _CustomXmlPrintResult CustomXmlPrintResult;

enum _CustomPrintOrientation
{
		/**
        * Portrait
        */
        CUSTOM_ORIENTATION_PORTRAIT = 0,		       
		/**
        * Landscape
        */
        CUSTOM_ORIENTATION_LANDSCAPE = 1,
};
typedef enum _CustomPrintOrientation CustomPrintOrientation;


#ifdef __cplusplus
extern "C" {
#endif


#define CUSTOM_XMLPRINT_SEPARATOR	0x1E



/// <summary>
/// Get handle for the printer identified by its name \n
/// Use this function to select the desired printer. It is necessary to call this function before performing the actual print operation with PrintXml() 
/// \n Notes: \n
/// It is necessary to install the proper custom cups printer driver, in order to print using CPT library.
/// </summary>
/// <param name="printerName">Printer name</param>        
/// <returns>Handle for the printer</returns>
CUSTOMXPEXTERN void * GetXmlPrintHandle(char * printerName);	

/// <summary>
/// Get handle for the printer identified by its name, using QT dialog box\n
/// Use this function to select the desired printer using a QT system dialog Box. It is necessary to call this function before performing the actual print operation with PrintXml() 
/// \n Notes: \n
/// It is necessary to install the proper custom cups printer driver, in order to print using CPT library.
/// </summary>
/// <returns>Handle for the printer</returns>
CUSTOMXPEXTERN void * GetXmlPrintHandleFromDialog(void);	

/// <summary>
/// Set printer margins in hundred of an inch 
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Use this function only to change the default printer margins
/// </remarks>   
/// <param name="xmlPrintHandle">handle</param>
/// <param name="left">Left margin</param>
/// <param name="top">Top margin</param>
/// <param name="right">Right margin</param>
/// <param name="bottom">Bottom margin</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetMargins(void * xmlPrintHandle, int left, int top, int right, int bottom);

/// <summary>
/// Set printer margins in hundred of a millimiter 
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Use this function only to change the default printer margins
/// </remarks>
/// <param name="xmlPrintHandle">handle</param>
/// <param name="left">Left margin</param>
/// <param name="top">Top margin</param>
/// <param name="right">Right margin</param>
/// <param name="bottom">Bottom margin</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetMarginsMM(void * xmlPrintHandle, int left, int top, int right, int bottom);

/// <summary>
/// Set print page orientation 
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Use this function only to change the default printer margins
/// </remarks>
/// <param name="xmlPrintHandle">handle</param>
/// <param name="orientation">Type of orientation(Portrait or Landscape)</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetOrientation(void * xmlPrintHandle, CustomPrintOrientation orientation);

/// <summary>
/// Set page size in hundred of an inch 
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Use this function to select a custom page, specifying width and height of the desired page \n
/// To select a standard page use GetPageSizeNames() and SetPageSizeName()
/// </remarks>
/// <param name="xmlPrintHandle">handle</param>
/// <param name="width">Page width</param>
/// <param name="height">Page height</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetPageSize(void * xmlPrintHandle, int width, int height);

/// <summary>
/// Set page size in hundred of a millimiter 
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Use this function to select a custom page, specifying width and height of the desired page \n
/// To select a standard page use GetPageSizeNames() and SetPageSizeName()
/// </remarks>
/// <param name="xmlPrintHandle">handle</param>
/// <param name="width">Page width</param>
/// <param name="height">Page height</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetPageSizeMM(void * xmlPrintHandle, int width, int height);

/// <summary>
/// Set page size by name
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Use this function to select a standard page, specifying the name of the desired page \n
/// To get the list of all pages supported by selected printer use GetPageSizeNames()
/// </remarks>  
/// <param name="xmlPrintHandle">handle</param>
/// <param name="name">Page name (as returned by GetPageSizeNames)</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetPageSizeName(void * xmlPrintHandle, char * name);

/// <summary>
/// Set the number of copies to be printed
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Use this function to set the number of copies of the same document that will be printed using PrintXml()        
/// </remarks>   
/// <param name="xmlPrintHandle">handle</param>
/// <param name="copies">Number of copies</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetNumCopies(void * xmlPrintHandle, int copies);

/// <summary>
/// Print image from file
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog() \n
/// Not necessary for CPT printing \n
/// Utility fucntion to print a standard image (bmp, jpg, ..) on the selected printer
/// </remarks> 
/// <param name="xmlPrintHandle">handle</param>
/// <param name="filename">File path of the image to be printed</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult PrintImage(void * xmlPrintHandle, char * filename);


/// <summary>
/// Get the list of all available printers in the system 
/// \n Notes: \n
/// The returned pointer must be freed using FreeInfoPtrMemory
/// </summary>  
/// <remarks>        
/// Use this fucntion to get a list of all availabale printers in the system \n
/// Remeber to install custom printer driver, in order to use custom printer with CPT
/// </remarks>         
/// <param name="len">len of returned array (output value)</param>
/// <returns>Pointer to an array of string containing the names of available printers in the system</returns>
CUSTOMXPEXTERN char ** GetAvailablePrinters(int * len);


/// <summary>
/// Get the list of the fonts available in the system, together with the fonts included in the opened xml project
/// \n Notes: \n
/// A "fonts" directory is included in the project generated by CPT Editor: this directory contains all the local fonts saved inside the projects. \n
/// This function call returns the list of system fonts and add also all the local fonts inside the "fonts" project directory. \n
/// The returned pointer must be freed using FreeInfoPtrMemory.
/// </summary>   
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog()    
/// </remarks> 
/// <param name="xmlPrintHandle">handle</param>
/// <param name="len">len of returned array (output value)</param>
/// <returns>Pointer to an array of string containing the names of available fonts in the system</returns>
CUSTOMXPEXTERN char ** GetXmlAvailableFontList(void * xmlPrintHandle, int * len);

/// <summary>
/// Get the list of page formats available for the printer
/// \n Notes: \n
/// The returned pointer must be freed using FreeInfoPtrMemory
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog()  \n
/// Use this function to get the list of all standard pages supported by selected printer        
/// </remarks>           
/// <param name="xmlPrintHandle">handle</param>
/// <param name="len">len of returned array (output value)</param>
/// <returns>Pointer to an array of string containing the names of pages for current printer</returns>
CUSTOMXPEXTERN char ** GetPageSizeNames(void * xmlPrintHandle, int * len);

/// <summary>
/// Free memory allocated by a previous API
/// \n Notes: \n
/// GetPageSizeNames() GetXmlAvailableFontList() GetAvailablePrinters() return a pointer that must be freed with this function call.
/// </summary>
/// <param name="ptr">pointer returned by a previous API</param>
/// <param name="len">len array to be freed</param>
/// <returns>Pointer to an array of string that must be freed</returns>
CUSTOMXPEXTERN CustomXmlPrintResult FreeInfoPtrMemory(char ** ptr, int len);

/// <summary>
/// Set the name of the xml project file \n 
/// To be done as the first step, in order to load the project inside the library. 
/// \n Notes: \n
/// This is the name of the project file created with CustomPowerTool (CPT) Editor (it has .xml extension) \n
/// In fact, you must initialize CPT library with the project file that you want to print. \n       
/// In the same location it is necessary to find "images" and "fonts" directories, as created by CPT Editor. \n
/// If "images" and "fonts" directories are in a different location, use SetXmlFileNameAndDirs() function. \n
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog()       
/// </remarks>   
/// <param name="xmlPrintHandle">handle</param>
/// <param name="filename">File path of the xml project file</param>        
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetXmlFileName(void * xmlPrintHandle, char * filename);

/// <summary>
/// Set the name of the xml project file, "images" and "fonts" directories \n
/// To be done as the first step, in order to load the project inside the library. 
/// \n Notes: \n
/// This function should be used instead of SetXmlFileName() if  "images" and "fonts" directories are in a different location with respect to xml project file. \n
/// xml project file,  "images" and "fonts" directories are generated by CPT Editor. 
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog()       
/// </remarks>   
/// <param name="xmlPrintHandle">handle</param>
/// <param name="filename">File path of the xml project file</param>
/// <param name="imagesDir">Absoulute path of the directory containing images</param>
/// <param name="fontsDir">Absoulute path of the directory containing fonts</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult SetXmlFileNameAndDirs(void * xmlPrintHandle, char * filename, char * imagesDir, char * fontsDir);

/// <summary>
/// Superseded Function ( replaced by SetXmlObjectTag)
/// </summary>
CUSTOMXPEXTERN CustomXmlPrintResult SetXmlTag(void * xmlPrintHandle, char * tag, char * value);

/// <summary>
/// Set the value of the element specified by tag (format Id.Property) \n 
/// In the xml file identify an element with the specified tag and overwrite the value with the supplied one.
/// \n Notes: \n
/// The xml project file contains the description of the layout to print in the form of xml nodes. \n
/// Each node is identified by an Id, and has many properties. \n
/// You can change the value of a property, and the document will be printed with this new value. \n        
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog(). \n
/// Example: \n
/// This is a part of the xml project file describing a textbox field: \n
/// <CustomItem class="text" id="TextBox0"> \n
///.... \n
/// <text>original string</text> \n
/// <fontname>Arial</fontname> \n
/// <fontsize>8</fontsize> \n
/// ..... \n
/// </CustomItem> \n
/// \n
/// Use: SetXmlObjectTag("TextBox0.text", "new string"); \n
/// In the printed document, the TextBox0 field will be printed with "new string" instead of "original string".
/// </remarks> 
/// <param name="xmlPrintHandle">handle</param>
/// <param name="tag">Xml Tag (in the form Id.Property) to identify an element</param>
/// <param name="value">Value assigned to the element identified by tag</param>  
/// <returns>Operation result (success or error type)</returns>  
CUSTOMXPEXTERN CustomXmlPrintResult SetXmlObjectTag(void * xmlPrintHandle, char * tag, char * value);

/// <summary>
/// Get the value of the element specified by tag (format Id.Property). \n
/// In the xml file identify an element with the specified tag and return its value.
/// \n Notes: \n
/// This is the Get function, while SetXmlObjectTag() is the equivalent Set function.
/// The xml project file contains the description of the layout to print in the form of xml nodes. \n
/// Each node is identified by an Id, and has many properties. \n
/// You can retrieve (get) the value of a property. \n        
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog(). \n
/// Example: \n
/// This is a part of the xml project file describing a textbox field: \n
/// <CustomItem class="text" id="TextBox0"> \n
///.... \n
/// <text>original string</text> \n
/// <fontname>Arial</fontname> \n
/// <fontsize>8</fontsize> \n
/// ..... \n
/// </CustomItem> \n
/// \n
/// Use: GetXmlObjectTag("TextBox0.text", str_val); \n
/// str_val will contain "original string".
/// </remarks> 
/// <param name="xmlPrintHandle">handle</param>
/// <param name="tag">Xml Tag (in the form Id.Property) to identify an element</param>
/// <param name="value">Value of the element identified by tag (output value)</param>  
/// <param name="valuesize">Size of the buffer pointed by value parameter</param>
/// <returns>Operation result (success or error type)</returns>       
CUSTOMXPEXTERN CustomXmlPrintResult GetXmlObjectTag(void * xmlPrintHandle, char * tag, char * value, int valuesize);

/// <summary>
/// Set the value of the element specified by "link" tag. Undocumented: internal use only
/// </summary>
/// <returns>Operation result (success or error type)</returns>   
CUSTOMXPEXTERN CustomXmlPrintResult SetXmlObjectLink(void * xmlPrintHandle, char * tag, char * value);

/// <summary>
/// Get the value of the element specified by "link" tag. Undocumented: internal use only
/// </summary>
/// <returns>Operation result (success or error type)</returns>   
CUSTOMXPEXTERN CustomXmlPrintResult GetXmlObjectLink(void * xmlPrintHandle, char * tag, char * value, int valuesize);

/// <summary>
/// Create a list of tag/value using the supplied xml parameter file and apply it to the xml project file (see SetXmlObjectTag() for tag/value meaning). \n
/// The parameter file must be in the format produced by CPT Editor
/// \n Notes: \n
/// The xml parameter file is generated by CPT Editor, and has extension ".param.xml". \n
/// The xml parameter file contains the description of the "variable" part of the layout to print, in the form of xml nodes. \n
/// This file can be interpreted as a subset of the xml project file, containing only the "variable" properties. \n
/// Each node is identified by an Id and can have one or more properties. \n
/// It can be modifed manually by the user.
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog(). \n
/// Example: \n
/// This is a part of a xml parameter file: \n
/// .... \n
/// <CustomParam class="text" id="TextBox1"> \n
/// <text>new string 1</text> \n
/// </CustomParam> \n        
/// <CustomParam class="text" id="TextBox2"> \n
/// <text>new string 2</text> \n
/// </CustomParam> \n
/// ..... \n
/// A call to SetXmlObjectFromParamFile() produces the same result of multiple calls to SetXmlObjectTag() \n
/// In this example, it is equivalent to: \n
/// SetXmlObjectTag("TextBox1.text", "new string 1"); \n
/// SetXmlObjectTag("TextBox2.text", "new string 2"); \n
/// </remarks> 
/// <param name="xmlPrintHandle">handle</param>
/// <param name="xmlParameterFileName">File path of xml parameter file</param>        
/// <returns>Operation result (success or error type)</returns>    
CUSTOMXPEXTERN CustomXmlPrintResult SetXmlObjectsFromParamFile(void * xmlPrintHandle, char * xmlParamFileName);

/// <summary>
/// Get the list of tag/value from the supplied xml parameter file. \n
/// The parameter file must be in the format produced by CPT Editor
/// \n Notes: \n
/// The xml parameter file is generated by CPT Editor, and has extension ".param.xml". \n
/// For a description of the xml parameter file see SetXmlObjectFromParamFile()
/// This function parses the xml parameter file and generates a list of objects, with tag and value.
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog(). \n
/// Example: \n
/// This is a part of a xml parameter file: \n
/// .... \n
/// <CustomParam class="text" id="TextBox1"> \n
/// <text>new string 1</text> \n
/// </CustomParam> \n        
/// <CustomParam class="text" id="TextBox2"> \n
/// <text>new string 2</text> \n
/// </CustomParam> \n
/// ..... \n
/// A call to GetXmlObjectFromParamFile() will produce the following result: \n        
/// tag=TextBox1.text[0x1E]TextBox2.text \n
/// value=new string 1[0x1E]new string 2 \n
/// that can be represented as a list of objects like this: \n        
/// { Tag:"TextBox1.text", Value:"new string 1" } \n
/// { Tag:"TextBox2.text", Value:"new string 2" } \n
/// </remarks>        
/// </summary>
/// <param name="xmlPrintHandle">handle</param>
/// <param name="xmlParameterFileName">File path of xml parameter file</param>
/// <param name="tag">List of tag in the parameter file (separator is 0x1E) (output value)</param>
/// <param name="tagsize">Size of the buffer pointed by tag parameter</param>
/// <param name="value">List of values in the parameter file (separator is 0x1E) (output value)</param>
/// <param name="valuesize">Size of the buffer pointed by value parameter</param>
/// <returns>Operation result (success or error type)</returns>  
CUSTOMXPEXTERN CustomXmlPrintResult GetXmlObjectsFromParamFile(void * xmlPrintHandle, char * xmlParamFileName, char * tag, int tagsize, char * value, int valuesize);

/// <summary>
/// Parse Xml project file performing a syntax/correctness check
/// \n Notes: \n
/// After a call to SetXmlFileName() or SetXmlFileNameAndDirs(), the project is loaded inside the library. \n
/// With this function call it is possible to verify if the syntax of the project is correct: in case of syntax error, a message is returned.
/// </summary>
/// <remarks> 
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog()       
/// </remarks>   
/// <param name="xmlPrintHandle">handle</param>
/// <param name="info">>Pointer to an array of char used to store error information string in case of errors(output value)</param>        
/// <returns>Operation result (success or error type)</returns>    
/// <param name="size">Size of the array of char</param>
CUSTOMXPEXTERN CustomXmlPrintResult GetXmlCheckCorrectParsing(void * xmlPrintHandle, char * info, int size);

/// <summary>
/// Get bold and italic properties for the font identified by fontname
/// \n Notes: \n
/// This function can be used to retrieve information about a font present in the system or included in the loaded project. \n
/// With GetAvailableSystemFontList() it is possible to retrieve all the fonts available. \n
/// With this fuction call it is possible to retrieve bold and italic information for all the avalable fonts. \n
/// </summary>
/// <remarks>
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog()    
/// </remarks>   
/// <param name="xmlPrintHandle">handle</param>
/// <param name="name">Font family name</param>
/// <param name="isBoldAvailable">Pointer to int variable that can assume the vaules:0(bold not available) 1(bold available) (output value)</param>
/// <param name="isItalicAvailable">Pointer to int variable that can assume the vaules:0(italic not available) 1(italic available) (output value)</param>
/// <returns>Operation result (success or error type)</returns>   
CUSTOMXPEXTERN CustomXmlPrintResult GetXmlFontProperty(void * xmlPrintHandle, char * name, int * isBoldAvailable, int * isItalicAvailable);



/// <summary>
/// Free handle previously allocated \n
/// Handle is returned by GetXmlPrintHandle() or GetXmlPrintHandleFromDialog()   
/// </summary>
/// <param name="xmlPrintHandle">handle</param>
/// <returns>Operation result (success or error type)</returns>    
CUSTOMXPEXTERN CustomXmlPrintResult FreeXmlPrintHandle(void * xmlPrintHandle);

/// <summary>
/// Print xml project file
/// \n Notes: \n
/// This function is used to perform the rendering of the xml project and to send it to the printer. \n
/// Prerequistes are loding the project (using SetXmlFileNameAndDirs() or SetXmlFileName()) and selecting the printer (using SetPrinterName())
/// </summary>
/// <remarks>
/// Prerequisite: select printer using GetXmlPrintHandle() or GetXmlPrintHandleFromDialog(). \n
/// "automaticPageSize": set to 1 (true) in order to create a custom page size according to the width and height specified int the project.
/// Otherwise use predefined pages, see SetPageSizeName()
/// </remarks> 
/// <param name="xmlPrintHandle">handle</param>
/// <param name="automaticPageSize">Use custom page size. If different from 0, use printer page width and height taken from xml prject file</param>    
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult PrintXml(void * xmlPrintHandle, int automaticPageSize);

/// <summary>
/// Get the current library API version
/// </summary>
/// <param name="info">Pointer to an array of char used to store library version string(outut value)</param>
/// <param name="size">Size of the array of char</param>
/// <returns>Operation result (success or error type)</returns>   
CUSTOMXPEXTERN CustomXmlPrintResult GetLibraryApiVersion(char * info, int size);

/// <summary>
/// Not documented, internal use only
/// </summary>
CUSTOMXPEXTERN CustomXmlPrintResult SetCustomResolutionRounding(int enable);

/// <summary>
/// Keep project embedded fonts for future reuse when library handler is released
/// </summary>
/// <param name="enable">Enable/Disable feature</param>
/// <returns>Operation result (success or error type)</returns>   
CUSTOMXPEXTERN CustomXmlPrintResult SetEmbeddedFontKeepFlag(int enable);

/// <summary>
/// Set the value of the element specified by tag (format Id.Property) \n 
/// See SetXmlObjectTag() for more details. \n
/// \n Notes: \n
/// This function is very similar to SetXmlObjectTag() and should be used together with PrintXmlObjArray().  \n
/// It gives the possibility to identify more than one ticket in a single print job, using the parameter ticket_num. \n
/// You can change the value of a property, and the ticket will be printed with this new value, but this change will affect only the ticket identified by ticket_num\n    
/// </summary>
/// <param name="xmlPrintHandle">handle</param>
/// <param name="ticket_num">Id that identify the ticket (in a multi page document)</param>
/// <param name="tag">Xml Tag (in the form Id.Property) to identify an element</param>
/// <param name="value">Value assigned to the element identified by tag</param>  
/// <returns>Operation result (success or error type)</returns>      

CUSTOMXPEXTERN CustomXmlPrintResult FillXmlObjArray(void * xmlPrintHandle, int ticket_num, char * tag, char * value);


/// <summary>
/// Clear the list of tag/values created using FillXmlObjArray().
/// </summary>            
/// <param name="xmlPrintHandle">handle</param>
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult ClearXmlObjArray(void * xmlPrintHandle);

/// <summary>
/// Print xml project file as a multi page document
/// \n Notes: \n
/// This function is used to perform the rendering of the xml project and to send it to the printer. \n
/// Prerequistes are loding the project (using SetXmlFileNameAndDirs() or SetXmlFileName()) and selecting the printer (using SetPrinterName()). \n
/// This function call is available only for Windows and Linux. \n
/// This function is similar to PrintXml() but gives the possibility to print many pages/tickets in a single document, that is in a single print job. \n
/// The number of pages that will be printed depends on the number of tickets specified using multiple calls to FillXmlObjArray(). \n
/// </summary>
/// <remarks>
/// "automaticPageSize": set to true in in order to create a custom page size according to the width and height specified int the project.
/// Otherwise use predefined pages, see SetPageSizeName() \n
/// "adaptMarginsToPrinter" : set to false in order to leave default printer margins (suggested choice)
/// </remarks> 
/// <param name="xmlPrintHandle">handle</param>
/// <param name="automaticPageSize">Use custom page size. Printer page width and height taken from xml prject file (default value is true)</param>   
/// <returns>Operation result (success or error type)</returns>
CUSTOMXPEXTERN CustomXmlPrintResult PrintXmlObjArray(void * xmlPrintHandle, int automaticPageSize);


#ifdef __cplusplus
}
#endif

#endif
