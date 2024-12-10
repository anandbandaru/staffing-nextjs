# Azure App Service

The working solution for me was the App service with Code based > Node 20 LTS > Windows Machine

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local tesitng

In the project directory, you can run:

### `npm run start`

## Local tesitng

In the project directory, you can run:

### `npm run build`

## VSCode change

Edit settings.json 
It should have "./build" value for the setting "appService.deploySubpath":

### `"appService.deploySubpath": "./build"`

![image](https://github.com/user-attachments/assets/44fe6e1f-c2a4-4bf6-83fd-97d44e15e2d3)


## VSCode deployment

R-click on the project folder & say "Deploy to Web App.." > select your subscription > RG > App Service
