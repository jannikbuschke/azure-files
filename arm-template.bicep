@description('Describes plan\'s pricing tier and instance size. Check details at https://azure.microsoft.com/en-us/pricing/details/app-service/')
@allowed([
  'F1'
  'D1'
  'B1'
  'B2'
  'B3'
  'S1'
  'S2'
  'S3'
  'P1'
  'P2'
  'P3'
  'P4'
])
param skuName string = 'F1'

@description('Describes plan\'s instance count')
@minValue(1)
param skuCapacity int = 1

@description('The name of the app, is suffix to several resources.')
param appName string = 'azfiles'

@description('Environment, i.e. dev, test or prod')
param environment string = 'dev'

@description('The admin user of the SQL Server')
param sqlLoginName string = '${appName}-login'

@description('The password of the admin user of the SQL Server')
@secure()
param sqlLoginPassword string = 'P-${uniqueString(resourceGroup().id, '447a6f76-0246-47ce-98a8-c66b34bdaeb2')}-!#x'

@description('Tenant Id used for the KeyVault')
param tenantId string = subscription().tenantId

@description('Location for all resources.')
param location string = resourceGroup().location

var prefix = '${appName}-${environment}'
var hostingplanName_var = '${prefix}-plan'
var appserviceName = '${prefix}-app'
var sqlserverName = '${prefix}-sqlserver'
var databaseName = '${prefix}-db'
var keyvaultName = '${prefix}-kv'
var appInsightsName = '${prefix}-insights'
var storageAccountName = '${appName}${environment}sa'

resource sqlserver 'Microsoft.Sql/servers@2014-04-01' = {
  name: sqlserverName
  location: location
  tags: {
    displayName: 'SqlServer'
  }
  properties: {
    administratorLogin: sqlLoginName
    administratorLoginPassword: sqlLoginPassword
    version: '12.0'
  }
}

resource sqlserver_database 'Microsoft.Sql/servers/databases@2015-01-01' = {
  parent: sqlserver
  name: databaseName
  location: location
  tags: {
    displayName: 'Database'
  }
  properties: {
    edition: 'Basic'
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: '1073741824'
    requestedServiceObjectiveName: 'Basic'
  }
}

resource sqlserver_AllowAllWindowsAzureIps 'Microsoft.Sql/servers/firewallrules@2014-04-01' = {
  parent: sqlserver
  name: 'AllowAllWindowsAzureIps'
  properties: {
    endIpAddress: '0.0.0.0'
    startIpAddress: '0.0.0.0'
  }
}

resource hosting_plan 'Microsoft.Web/serverfarms@2021-01-15' = {
  name: hostingplanName_var
  location: location
  tags: {
    displayName: 'HostingPlan'
  }
  sku: {
    name: skuName
    capacity: skuCapacity
  }
  properties: {
    name: hostingplanName_var
  }
}

resource app_service 'Microsoft.Web/sites@2018-02-01' = {
  identity: {
    type: 'SystemAssigned'
  }
  name: appserviceName
  location: location
  tags: {
    displayName: 'Website'
  }
  properties: {
    name: appserviceName
    serverFarmId: hosting_plan.id
  }
}

resource appservice_appsettings 'Microsoft.Web/sites/config@2021-01-15' = {
  parent: app_service
  name: 'appsettings'
  properties: {
    KeyVaultName: keyvaultName
  }
  dependsOn: [
    app_service
  ]
}

// resource webSiteName_connectionstrings 'Microsoft.Web/sites/config@2016-03-01' = {
//   parent: app_service
//   name: 'connectionstrings'
//   properties: {
//     DefaultConnection: {
//       value: 'Data Source=tcp:${sqlserver.properties.fullyQualifiedDomainName},1433;Initial Catalog=${databaseName};User Id=${sqlLoginName}@${sqlserver.properties.fullyQualifiedDomainName};Password=${sqlLoginPassword};'
//       type: 'SQLAzure'
//     }
//   }
//   dependsOn: [
//     app_service
//   ]
// }

resource app_insights 'Microsoft.Insights/components@2015-05-01' = {
  kind: 'web'
  name: appInsightsName
  location: location
  tags: {
    'hidden-link:${app_service.id}': 'Resource'
    displayName: 'AppInsightsComponent'
  }
  properties: {
    Application_Type: 'web'
  }
  dependsOn: [
    app_service
  ]
}

resource keyvault 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: keyvaultName
  location: location
  properties: {
    tenantId: tenantId
    enableSoftDelete: false
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: [
      {
        tenantId: tenantId
        objectId: reference('${app_service.id}/providers/Microsoft.ManagedIdentity/Identities/default', '2018-11-30', 'Full').properties.principalId
        permissions: {
          keys: [
            'all'
          ]
          secrets: [
            'all'
          ]
        }
      }
    ]
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: false
  }
  dependsOn: [
    app_service
  ]
}

resource keyvault_ConnectionString 'Microsoft.KeyVault/vaults/secrets@2019-09-01' = {
  parent: keyvault
  name: 'ConnectionString'
  properties: {
    contentType: 'text/plain'
    value: 'Data Source=tcp:${sqlserver.properties.fullyQualifiedDomainName},1433;Initial Catalog=${databaseName};User Id=${sqlLoginName}@${sqlserver.properties.fullyQualifiedDomainName};Password=${sqlLoginPassword};'
  }
}

//storage account
resource mainstorage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: storageAccountName
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

//create container
resource mainstoragecontainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-02-01' = {
  name: '${mainstorage.name}/default/mycontainer'
  dependsOn: [
    mainstorage
  ]
}

resource logicAppStorageBlobDataContributor 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid('ba92f5b4-2d11-453d-a403-e96b0029c9fe')
  properties: {
    roleDefinitionId: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c'
    principalId: reference('${app_service.id}/providers/Microsoft.ManagedIdentity/Identities/default','2018-11-30','Full').properties.principalId
  }
}

output appServicePrincipalId string = reference('${app_service.id}/providers/Microsoft.ManagedIdentity/Identities/default','2018-11-30','Full').properties.principalId
output siteUri string = app_service.properties.hostNames[0]
output sqlSvrFqdn string = sqlserver.properties.fullyQualifiedDomainName
output keyvaultName string = keyvault.name
// output p object = reference('${app_service.id}/providers/Microsoft.ManagedIdentity/Identities/default','2018-11-30','Full').properties
// output r object = reference('${app_service.id}/providers/Microsoft.ManagedIdentity/Identities/default','2018-11-30','Full')
