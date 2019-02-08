# Overview
This project uses node webkit to create a desktop application for your commonly used web services.

# Installation
1. Clone the repository
2. Run the command ``` npm install ```
3. Run the command ```npm run start```

# Customization
The sample configuration for the system is found in **modules.json**. Upon starting the system, there a new configuration file will be created with the name **user_default.json**. This is the file that will be loaded whenever you start the system.

**Adjust the flags to change the user interface as follows**
- **displayname**: The display name of the module shown in the user interface
- **type**: This is purely for categorization purposes, has no functional value yet
- **url**: The url to be loaded for the module
- **data_partition**: Modules sharing the same data partition will share information such as sessions etc. This can be useful if you have an email work account and email personal account that you want to keep on separate sessions
- **preload**: Starts the module in the background if set to true