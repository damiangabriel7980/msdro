define({ "api": [
  {
    "name": "Create_Newsletter_Campaign",
    "description": "<p>Create a newsletter campaign</p>",
    "group": "Admin_API",
    "type": "post",
    "url": "/api/admin/newsletter/campaigns",
    "title": "Create a newsletter campaign",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "clone",
            "description": "<p>the id of the campaign we want to clone</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST http://localhost:8080/api/admin/newsletter/campaigns?clone=0210infnf93f813s",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created template / an empty object if we clone a campaign</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Create_Newsletter_Distribution_List",
    "description": "<p>Create a newsletter distribution list</p>",
    "group": "Admin_API",
    "type": "post",
    "url": "/api/admin/newsletter/distribution_lists",
    "title": "Create a newsletter distribution list",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST http://localhost:8080/api/admin/newsletter/distribution_lists",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created distribution list</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Create_Newsletter_Template",
    "description": "<p>Create a newsletter template</p>",
    "group": "Admin_API",
    "type": "post",
    "url": "/api/admin/newsletter/templates",
    "title": "Create a newsletter template",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST http://localhost:8080/api/admin/newsletter/templates",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created template</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Delete_Newsletter_Campaign",
    "description": "<p>Delete a newsletter campaign</p>",
    "group": "Admin_API",
    "type": "delete",
    "url": "/api/admin/newsletter/campaigns",
    "title": "Delete a newsletter campaign",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the campaign</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE http://localhost:8080/api/admin/newsletter/campaigns?id=jdwkandnadnawnfwubfabf",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Delete_Newsletter_Distribution_list",
    "description": "<p>Delete a newsletter distribution list</p>",
    "group": "Admin_API",
    "type": "delete",
    "url": "/api/admin/newsletter/distribution_lists",
    "title": "Delete a newsletter distribution list",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the distribution list</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE http://localhost:8080/api/admin/newsletter/distribution_lists?id=jdwkandnadnawnfwubfabf",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Delete_Newsletter_Template",
    "description": "<p>Delete a newsletter template</p>",
    "group": "Admin_API",
    "type": "delete",
    "url": "/api/admin/newsletter/templates",
    "title": "Delete a newsletter template",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the template</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE http://localhost:8080/api/admin/newsletter/templates?id=wndkandandawodjaw",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Newsletter_Campaigns",
    "description": "<p>Retrieve a list of newsletter campaigns / a single campaign</p>",
    "group": "Admin_API",
    "type": "get",
    "url": "/api/admin/newsletter/templates",
    "title": "Retrieve a list of newsletter campaigns / a single campaign",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the camapign</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/admin/newsletter/campaigns?id=null",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of campaigns / an object with a campaign</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Newsletter_Distribution_Lists",
    "description": "<p>Retrieve a list of distribution lists / a single distribution list</p>",
    "group": "Admin_API",
    "type": "get",
    "url": "/api/admin/newsletter/distribution_lists",
    "title": "Retrieve a list of distribution lists / a single distribution list",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the distribution list</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/admin/newsletter/distribution_lists?id=null",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of distribution lists / an object with a distribution list</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Newsletter_Statistics",
    "description": "<p>Retrieve newsletter statistics</p>",
    "group": "Admin_API",
    "type": "post",
    "url": "/api/admin/newsletter/statistics",
    "title": "Retrieve newsletter statistics",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "campaign",
            "description": "<p>The id of a newsletter campaign</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/admin/newsletter/statistics?campaign=null",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object with statistics</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Newsletter_Templates",
    "description": "<p>Retrieve a list of newsletter templates</p>",
    "group": "Admin_API",
    "type": "get",
    "url": "/api/admin/newsletter/templates",
    "title": "Retrieve a list of newsletter templates",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the template</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "returnTypes",
            "description": "<p>if true, the newsletter types are returned</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>filter newsletters by type (can be header, content or footer)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/admin/newsletter/templates?id=null&type=header",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of templates</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Newsletter_Unsubscribed",
    "description": "<p>Retrieve a list of users who unsubscribed from MSD Newsletter</p>",
    "group": "Admin_API",
    "type": "post",
    "url": "/api/admin/newsletter/unsubscribedEmails",
    "title": "Retrieve a list of users who unsubscribed from MSD Newsletter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/admin/newsletter/unsubscribedEmails",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array with users</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Newsletter_Users_Unsubscribed_Yet",
    "description": "<p>Retrieve a list of users who haven't subscribed to the newsletter yet</p>",
    "group": "Admin_API",
    "type": "post",
    "url": "/api/admin/newsletter/users",
    "title": "Retrieve a list of users who haven't subscribed to the newsletter yet",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "unsubscribed",
            "description": "<p>if the user haven't subscribed to the newsletter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/admin/newsletter/users?unsubscribed=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array with users</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Update_Newsletter_Campaign",
    "description": "<p>Update a newsletter campaign</p>",
    "group": "Admin_API",
    "type": "put",
    "url": "/api/admin/newsletter/campaigns",
    "title": "Update a newsletter campaign",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the campaign</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "obj",
            "description": "<p>a campaign object</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -d '{}' http://localhost:8080/api/admin/newsletter/templates?id=jwiadjij141441mdd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the updated campaign</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Update_Newsletter_Distribution_List",
    "description": "<p>Update a newsletter distribution list</p>",
    "group": "Admin_API",
    "type": "put",
    "url": "/api/admin/newsletter/distribution_lists",
    "title": "Update a newsletter distribution list",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the template</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "obj",
            "description": "<p>a distribution list object</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -d '{}' http://localhost:8080/api/admin/newsletter/distribution_lists?id=0nncknkwawa",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the updated distribution list</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Update_Newsletter_Template",
    "description": "<p>Update a newsletter template</p>",
    "group": "Admin_API",
    "type": "put",
    "url": "/api/admin/newsletter/templates",
    "title": "Update a newsletter template",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      },
      {
        "name": "devModeAdmin",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with admin rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the template</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "obj",
            "description": "<p>a template object</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -d '{}' http://localhost:8080/api/admin/newsletter/templates?id=dknwandandwaid",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the updated template</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Admin_API"
  },
  {
    "name": "Get_All_Details_For_Conferences",
    "description": "<p>Retrieve all conferences and all their details (rooms, speakers)</p>",
    "group": "Check_In_Conferences_API",
    "type": "get",
    "url": "/apiConferences/getConferencesFull",
    "title": "Retrieve all conferences and all their details (rooms, speakers)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiConferences/getConferencesFull",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing all conferences and all their details (rooms, speakers)</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success : [\n\n     ],\n     message: \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"Error Message\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiConferences.js",
    "groupTitle": "Check_In_Conferences_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_User_Profile",
    "description": "<p>Retrieve a user's profile</p>",
    "group": "Check_In_Conferences_API",
    "type": "get",
    "url": "/apiConferences/userProfile",
    "title": "Retrieve a user's profile",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiConferences/userProfile",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing user data</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success : {\n\n     },\n     message: \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiConferences.js",
    "groupTitle": "Check_In_Conferences_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Redirect_Create_Account",
    "description": "<p>Redirect to the global API for creating an account</p>",
    "group": "Check_In_Conferences_API",
    "type": "post",
    "url": "/apiConferences/createAccount",
    "title": "Redirect to the global API for creating an account",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" http://localhost:8080/apiConferences/createAccount",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response",
            "description": "<p>an empty object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiConferences.js",
    "groupTitle": "Check_In_Conferences_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Reset_Password",
    "description": "<p>Redirect to the global API for resetting a password</p>",
    "group": "Check_In_Conferences_API",
    "type": "post",
    "url": "/apiConferences/resetPass",
    "title": "Redirect to the global API for resetting a password",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" http://localhost:8080/apiConferences/resetPass",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response",
            "description": "<p>an empty object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiConferences.js",
    "groupTitle": "Check_In_Conferences_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_Conference_And_AddIt_To_User",
    "description": "<p>Retrieve a conference and add it to a user</p>",
    "group": "Check_In_Conferences_API",
    "type": "post",
    "url": "/apiConferences/scanConference",
    "title": "Retrieve a conference and add it to a user",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the conference</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" http://localhost:8080/apiConferences/scanConference",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the scanned conference</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success : {\n\n     },\n     message: \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"Error Message\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 NotFound Error\n{\n     error: \"Error Message\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiConferences.js",
    "groupTitle": "Check_In_Conferences_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_Room_And_Add_Associated_Conference_To_User",
    "description": "<p>Retrieve a conference and add it to a user using a room id</p>",
    "group": "Check_In_Conferences_API",
    "type": "post",
    "url": "/apiConferences/scanRoom",
    "title": "Retrieve a conference and add it to a user",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the room</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" http://localhost:8080/apiConferences/scanRoom",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the scanned conference</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success : {\n\n     },\n     message: \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"Error Message\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 NotFound Error\n{\n     error: \"Error Message\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiConferences.js",
    "groupTitle": "Check_In_Conferences_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Unsubscribe_Push_Notifications",
    "description": "<p>Un-subscribe from push notifications</p>",
    "group": "Check_In_Conferences_API",
    "type": "post",
    "url": "/apiConferences/unsubscribeFromPush",
    "title": "Un-subscribe from push notifications",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>a unique token to identify device to un-subscribe the user from push notifications</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" http://localhost:8080/apiConferences/unsubscribeFromPush",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success : {\n\n     },\n     message: \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"Error Message\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiConferences.js",
    "groupTitle": "Check_In_Conferences_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Content_Preview",
    "description": "<p>Retrieve a preview for a specific content from medic section</p>",
    "group": "Content_Preview",
    "type": "get",
    "url": "/apiPreview/previewItem",
    "title": "Retrieve a preview for a specific content from medic section",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the content from medic section</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of the content (can be resource, pathology or product)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "articleType",
            "description": "<p>The type of an article (optional; can be 1 = national, 2 = international, 3 = scientific)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage (with id):",
        "content": "curl -i http://localhost:8080/apiPreview/previewItem?id=kdwooj2131313&type=resource&articleType=3",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing a specific content from medic section</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 Not Found Error\n{\n  \"error\": \"Not Found Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiPreview.js",
    "groupTitle": "Content_Preview"
  },
  {
    "name": "Contract_Management",
    "description": "<p>Retrieve a contract template</p>",
    "group": "Contract_Management",
    "type": "get",
    "url": "/apiPublic/apiContractManagement/templates",
    "title": "Retrieve a contract template",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "timestamp",
            "description": "<p>A date to filter the number of template</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiContractManagement/templates?timestamp=09/26/2016",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the current version and the download URL</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiContractManagement.js",
    "groupTitle": "Contract_Management"
  },
  {
    "name": "Delete_Courses",
    "description": "<p>Delete a course</p>",
    "group": "Courses",
    "type": "delete",
    "url": "/apiPublic/apiCourses/courses",
    "title": "Delete a course",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of a course</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X DELETE -H \"Authorization: Bearer \" http://localhost:8080/apiPublic/apiCourses/courses?id=23fwafwa1221f",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (400):",
          "content": "HTTP/1.1 400 Bad Request Error\n{\n  \"error\": \"Error\",\n  \"data\" : {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (404):",
          "content": "HTTP/1.1 404 Not found Error\n{\n  \"error\": \"Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiCourses.js",
    "groupTitle": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Courses",
    "description": "<p>Retrieve a course / list of courses</p>",
    "group": "Courses",
    "type": "get",
    "url": "/apiPublic/apiCourses/courses",
    "title": "Retrieve a course / list of courses",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of a course</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage (with id):",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiPublic/apiCourses/courses?id=23fwafwa1221f",
        "type": "curl"
      },
      {
        "title": "Example usage (no id):",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiPublic/apiCourses/courses",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the course / an array of courses</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (no id):",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":[\n  {\n\n  }\n ],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiCourses.js",
    "groupTitle": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Post_Courses",
    "description": "<p>Create a new course</p>",
    "group": "Courses",
    "type": "post",
    "url": "/apiPublic/apiContractManagement/templates",
    "title": "Create a new course",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "courseModel",
            "description": "<p>An object containing the properties of the course Mongo model</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" -d '{\"name\":\"someName\",\"content\":\"someContent\"}' http://localhost:8080/apiCourses/courses",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the newly created course</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"Bad request\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>The POST request doesn't contain all necessary data</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiCourses.js",
    "groupTitle": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Courses",
    "description": "<p>Update an existing course</p>",
    "group": "Courses",
    "type": "put",
    "url": "/apiPublic/apiContractManagement/templates",
    "title": "Update an existing course",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "course_id",
            "description": "<p>The id of the course we want to update</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "courseModel",
            "description": "<p>An object containing the properties of the course Mongo model</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X PUT -H \"Authorization: Bearer \" -d '{\"name\":\"someName\",\"content\":\"someContent\"}' http://localhost:8080/apiCourses/courses?id=23nf88y23nddy",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the updated course</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"Bad request\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>The PUT request doesn't contain all necessary data</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiCourses.js",
    "groupTitle": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Send_Email_From_DPOC_App",
    "description": "<p>Send an email from DPOC Application</p>",
    "group": "DPOC",
    "type": "post",
    "url": "/apiDPOC/report",
    "title": "Send an email from DPOC Application",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message to send via email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>The phone number of the sender</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "accepted",
            "description": "<p>If the sender doesn't agree to be contacted</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientNumber",
            "description": "<p>The patient's number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "patientSex",
            "description": "<p>The patient's sex</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the patient</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reportType",
            "description": "<p>The type of the report</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reporterType",
            "description": "<p>The sender's type</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": " curl -i -X POST -H \"Authorization: Bearer \" -d '{\"message\":\"someMessage\",\"phone\":\"1234141222\", \"accepted\": true,\n\"patientNumber\": \"34\", \"patientSex\": \"M\", \"name\": \"John\", \"reportType\": \"someType\", \"reporterType\": \"medic\"}'\n http://localhost:8080/apiDPOC/report",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response",
            "description": "<p>an empty object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiDPOC.js",
    "groupTitle": "DPOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "validate_Device_DPOC_App",
    "description": "<p>Validate a device for DPOC application</p>",
    "group": "DPOC",
    "type": "get",
    "url": "/apiDPOC/validate",
    "title": "Validate a device for DPOC application",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization-code",
            "description": "<p>a code specific to a registered DPOC device</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization-uuid",
            "description": "<p>the id of the registered DPOC device</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" -H \"authorization-code: someCode\" -H\n\"authorization-uuid: someUUID\" http://localhost:8080/apiDPOC/report",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response",
            "description": "<p>an empty object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 403 AccessForbidden Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "AccessForbidden",
            "description": "<p>Error - Access is forbidden</p>"
          }
        ]
      }
    },
    "filename": "app/apiDPOC.js",
    "groupTitle": "DPOC"
  },
  {
    "name": "Create_Elearning_Answer",
    "description": "<p>Create an elearning answer</p>",
    "group": "Elearning_API",
    "type": "post",
    "url": "/api/admin/elearning/answers",
    "title": "Create an elearning answer",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "answer",
            "description": "<p>a answer object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of question to associate to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{answer : {}, id: ''}' http://localhost:8080/api/admin/elearning/answers",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created answer</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_Elearning_Chapter",
    "description": "<p>Create an elearning chapter</p>",
    "group": "Elearning_API",
    "type": "post",
    "url": "/api/admin/elearning/chapters",
    "title": "Create an elearning chapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "chapter",
            "description": "<p>a chapter object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "courseId",
            "description": "<p>id of course to associate to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{chapter : {}, courseId: ''}' http://localhost:8080/api/admin/elearning/chapters",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created chapter</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_Elearning_Course",
    "description": "<p>Create an elearning course</p>",
    "group": "Elearning_API",
    "type": "post",
    "url": "/api/admin/elearning/courses",
    "title": "Create an elearning course",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "course",
            "description": "<p>a course object</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{course : {}}' http://localhost:8080/api/admin/elearning/courses",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created course</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_Elearning_Question",
    "description": "<p>Create an elearning question</p>",
    "group": "Elearning_API",
    "type": "post",
    "url": "/api/admin/elearning/questions",
    "title": "Create an elearning question",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "question",
            "description": "<p>a question object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of slide to associate to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{question : {}, id: ''}' http://localhost:8080/api/admin/elearning/questions",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a property containing the status of the update process</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n       success : {\n\t\t\t1 // or 0 if not updated\n       },\n       message : \"A message\"\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_Elearning_Slide",
    "description": "<p>Create an elearning slide</p>",
    "group": "Elearning_API",
    "type": "post",
    "url": "/api/admin/elearning/slides",
    "title": "Create an elearning slide",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "subchapter",
            "description": "<p>a slide object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of subchapter to associate to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{slide : {}, id: ''}' http://localhost:8080/api/admin/elearning/slides",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created slide</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_Elearning_SubChapter",
    "description": "<p>Create an elearning subchapter</p>",
    "group": "Elearning_API",
    "type": "post",
    "url": "/api/admin/elearning/subchapters",
    "title": "Create an elearning subchapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "subchapter",
            "description": "<p>a subchapter object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "chapterId",
            "description": "<p>id of chapter to associate to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{subchapter : {}, chapterId: ''}' http://localhost:8080/api/admin/elearning/subchapters",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created subchapter</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Delete_Elearning_Answer",
    "description": "<p>Delete an elearning answer</p>",
    "group": "Elearning_API",
    "type": "delete",
    "url": "/api/admin/elearning/answers",
    "title": "Delete an elearning answer",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the answer</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/answers?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Delete_Elearning_Chapter",
    "description": "<p>Delete an elearning chapter</p>",
    "group": "Elearning_API",
    "type": "delete",
    "url": "/api/admin/elearning/chapters",
    "title": "Delete an elearning chapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the chapter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/chapters?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Delete_Elearning_Course",
    "description": "<p>Delete an elearning course</p>",
    "group": "Elearning_API",
    "type": "delete",
    "url": "/api/admin/elearning/courses",
    "title": "Delete an elearning course",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the course</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/courses?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Delete_Elearning_Question",
    "description": "<p>Delete an elearning question</p>",
    "group": "Elearning_API",
    "type": "delete",
    "url": "/api/admin/elearning/questions",
    "title": "Delete an elearning question",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the question</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/questions?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Delete_Elearning_Slide",
    "description": "<p>Delete an elearning slide</p>",
    "group": "Elearning_API",
    "type": "delete",
    "url": "/api/admin/elearning/slides",
    "title": "Delete an elearning slide",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the slide</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/slides?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Delete_Elearning_SubChapter",
    "description": "<p>Delete an elearning subchapter</p>",
    "group": "Elearning_API",
    "type": "delete",
    "url": "/api/admin/elearning/subchapters",
    "title": "Delete an elearning subchapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the subchapter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x DELETE -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/subchapters?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Elearning_Chapters",
    "description": "<p>Retrieve a list of elearning chapters / a single chapter</p>",
    "group": "Elearning_API",
    "type": "get",
    "url": "/api/admin/elearning/chapters",
    "title": "Retrieve a list of elearning chapters / a single chapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the id of a chapter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/chapters?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a single chapter / an array of chapters</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Elearning_Courses",
    "description": "<p>Retrieve a list of elearning courses / a single course</p>",
    "group": "Elearning_API",
    "type": "get",
    "url": "/api/admin/elearning/courses",
    "title": "Retrieve a list of elearning courses / a single course",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the id of a course</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/courses?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a single course / an array of courses</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Elearning_Courses_For_Medic",
    "description": "<p>Retrieve a list of elearning courses / a single course (for medic section)</p>",
    "group": "Elearning_API",
    "type": "get",
    "url": "/api/elearning/courses",
    "title": "Retrieve a list of elearning courses / a single course (for medic section)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the id of a course</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/api/elearning/courses?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a single course / an array of courses</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Elearning_Slide_For_Medic",
    "description": "<p>Retrieve a single slide (for medic section)</p>",
    "group": "Elearning_API",
    "type": "get",
    "url": "/api/elearning/slides",
    "title": "Retrieve a single slide (for medic section)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "id",
            "description": "<p>the id of a slide</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/api/elearning/slides?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a single slide</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response :",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Elearning_Slides",
    "description": "<p>Retrieve a list of elearning slides / a single slide</p>",
    "group": "Elearning_API",
    "type": "get",
    "url": "/api/admin/elearning/slides",
    "title": "Retrieve a list of elearning slides / a single slide",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the id of a slide</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/slides?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a single slide / an array of slides</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Elearning_Subchapter_For_Medic",
    "description": "<p>Retrieve a single subchapter (for medic section)</p>",
    "group": "Elearning_API",
    "type": "get",
    "url": "/api/elearning/subchapters",
    "title": "Retrieve a single subchapter (for medic section)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of a subchapter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/api/elearning/subchapters?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a single subchapter</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response :",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Elearning_Subchapters",
    "description": "<p>Retrieve a list of elearning subchapters / a single subchapter</p>",
    "group": "Elearning_API",
    "type": "get",
    "url": "/api/admin/elearning/subchapters",
    "title": "Retrieve a list of elearning subchapters / a single subchapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the id of a subchapter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/api/admin/elearning/subchapters?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a single subchapter / an array of subchapters</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Post_Elearning_TestSlide_Answers",
    "description": "<p>Post the answers of a test slide (for medic section)</p>",
    "group": "Elearning_API",
    "type": "post",
    "url": "/api/elearning/slides",
    "title": "Post the answers of a test slide (for medic section)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of a slide</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "qaMap",
            "description": "<p>an object mapping the question and the user's answer</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{qid : aid}' http://localhost:8080/api/elearning/slides?id=wdnan828dnwdwoogr",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the score</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response :",
          "content": "    HTTP/1.1 200 OK\n    {\n       success : {\n\t\t\t21\n       },\n       message : \"A message\"\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Courses_Indexes",
    "description": "<p>Update courses indexes - use only one at a time of the parameters in the list below</p>",
    "group": "Elearning_API",
    "type": "put",
    "url": "/api/admin/elearning/updateIndex",
    "title": "Update courses indexes",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "courseMap",
            "description": "<p>An array of courses</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "chapterMap",
            "description": "<p>An array of chapters</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "subChaptersMap",
            "description": "<p>An array of sub-chapters</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "slidesMap",
            "description": "<p>An array of slides</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "questionsMap",
            "description": "<p>An array of questions</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{courseMap: [{id: '', order: ''}]}' http://localhost:8080/api/admin/elearning/updateIndex",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx 4xx Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Elearning_Answer",
    "description": "<p>Update an elearning answer</p>",
    "group": "Elearning_API",
    "type": "put",
    "url": "/api/admin/elearning/answers",
    "title": "Update an elearning answer",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "answer",
            "description": "<p>a answer object</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -H \"Authorization: Bearer \" -d '{answer : {}}' http://localhost:8080/api/admin/elearning/answers?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Elearning_Chapter",
    "description": "<p>Update an elearning chapter</p>",
    "group": "Elearning_API",
    "type": "put",
    "url": "/api/admin/elearning/chapters",
    "title": "Update an elearning chapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "chapter",
            "description": "<p>a chapter object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>if we want to enable/disable a chapter (contains the property isEnabled which holds the new status of the chapter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -H \"Authorization: Bearer \" -d '{chapter : {}, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/chapters?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Elearning_Course",
    "description": "<p>Update an elearning course</p>",
    "group": "Elearning_API",
    "type": "put",
    "url": "/api/admin/elearning/courses",
    "title": "Update an elearning course",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "course",
            "description": "<p>a course object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "imagePath",
            "description": "<p>the file path to the course image</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>if we want to enable/disable a course (contains the property isEnabled which holds the new status of the course</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -H \"Authorization: Bearer \" -d '{course : {}, imagePath: null, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/courses?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object / an object confirming if the course was updated</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n      updated: 1 //optional\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Elearning_Question",
    "description": "<p>Update an elearning question</p>",
    "group": "Elearning_API",
    "type": "put",
    "url": "/api/admin/elearning/questions",
    "title": "Update an elearning question",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "question",
            "description": "<p>a question object</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -H \"Authorization: Bearer \" -d '{question : {}}' http://localhost:8080/api/admin/elearning/questions?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Elearning_Slide",
    "description": "<p>Update an elearning slide</p>",
    "group": "Elearning_API",
    "type": "put",
    "url": "/api/admin/elearning/slides",
    "title": "Update an elearning slide",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "slide",
            "description": "<p>a slide object</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isSlide",
            "description": "<p>if the slide is a presentation or a questionnaire</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>if we want to enable/disable a slide (contains the property isEnabled which holds the new status of the slide</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -H \"Authorization: Bearer \" -d '{slide : {}, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/slides?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Elearning_SubChapter",
    "description": "<p>Update an elearning subchapter</p>",
    "group": "Elearning_API",
    "type": "put",
    "url": "/api/admin/elearning/subchapters",
    "title": "Update an elearning subchapter",
    "version": "1.0.0",
    "permission": [
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "subchapter",
            "description": "<p>a subchapter object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>if we want to enable/disable a subchapter (contains the property isEnabled which holds the new status of the subchapter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -H \"Authorization: Bearer \" -d '{subchapter : {}, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/subchapters?id=dnwadnwan8284y854nfg",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/elearning/index.js",
    "groupTitle": "Elearning_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Complete_Staywell_Account",
    "description": "<p>Complete Staywell account</p>",
    "group": "Global_API",
    "type": "post",
    "url": "/apiGloballyShared/completeProfile/",
    "title": "Complete Staywell account",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>a user object containing the following properties: title, name, email, password, registeredFrom, job, profession, groupsID, address, citiesID, practiceType, phone, subscriptions, specialty</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "activation",
            "description": "<p>Contains the properties : type - can be 'code' or 'file' and value - can be file or code string</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{user: {}, activation: {}}' http://localhost:8080/apiGloballyShared/completeProfile",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_Staywell_Account",
    "description": "<p>Create a Staywell account</p>",
    "group": "Global_API",
    "type": "post",
    "url": "/apiGloballyShared/createAccountStaywell/",
    "title": "Create a Staywell account",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>a user object containing the following properties: title, name, email, password, registeredFrom, job, profession, groupsID, address, citiesID, practiceType, phone, subscriptions, specialty</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "activation",
            "description": "<p>Contains the properties : type - can be 'code' or 'file' and value - can be file or code string</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{user: {}, activation: {}}' http://localhost:8080/apiGloballyShared/createAccountStaywell",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_Staywell_Account_Mobile",
    "description": "<p>Create a Staywell account (mobile only)</p>",
    "group": "Global_API",
    "type": "post",
    "url": "/apiGloballyShared/createAccountMobile/",
    "title": "Create a Staywell account (mobile only)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>a user object containing the following properties: title, name, email, password, registeredFrom, job</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{user: {}}' http://localhost:8080/apiGloballyShared/createAccountMobile",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Request_Password_Reset",
    "description": "<p>Request password reset</p>",
    "group": "Global_API",
    "type": "post",
    "url": "/apiGloballyShared/requestPasswordReset",
    "title": "Request password reset",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>the user's email</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{email : ''}' http://localhost:8080/apiGloballyShared/requestPasswordReset",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the email the reset password email was sent to</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n     mailto: ''\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_Amazon_Bucket",
    "description": "<p>Retrieve Amazon Bucket</p>",
    "group": "Global_API",
    "type": "get",
    "url": "/apiGloballyShared/appSettings/",
    "title": "Retrieve Amazon Bucket",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiGloballyShared/appSettings",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the link to the Amazon bucket</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n     amazonPrefix: ''\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_Professions",
    "description": "<p>Retrieve a list of professions</p>",
    "group": "Global_API",
    "type": "get",
    "url": "/apiGloballyShared/accountActivation/professions",
    "title": "Retrieve a list of professions",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiGloballyShared/accountActivation/professions",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of professions</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_cities",
    "description": "<p>Retrieve a list of cities from a county</p>",
    "group": "Global_API",
    "type": "get",
    "url": "/apiGloballyShared/accountActivation/cities",
    "title": "Retrieve a list of cities from a county",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "county",
            "description": "<p>the id of the county</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiGloballyShared/accountActivation/cities",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of cities</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_counties",
    "description": "<p>Retrieve a list of counties</p>",
    "group": "Global_API",
    "type": "get",
    "url": "/apiGloballyShared/accountActivation/specialty",
    "title": "Retrieve a list of counties",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiGloballyShared/accountActivation/counties",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of counties</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_groups",
    "description": "<p>Retrieve a list of groups based on profession</p>",
    "group": "Global_API",
    "type": "get",
    "url": "/apiGloballyShared/accountActivation/signupGroups/:profession",
    "title": "Retrieve a list of groups based on profession",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "profession",
            "description": "<p>The id of the profession</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiGloballyShared/accountActivation/signupGroups/215r25fqfwfdf2",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of groups</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_specialties",
    "description": "<p>Retrieve a list of specialties</p>",
    "group": "Global_API",
    "type": "get",
    "url": "/apiGloballyShared/accountActivation/specialty",
    "title": "Retrieve a list of specialties",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiGloballyShared/accountActivation/specialty",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of specialties</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGloballyShared.js",
    "groupTitle": "Global_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_GuideLines_By_Date",
    "description": "<p>Retrieve a set of guidelines categories by last updated date</p>",
    "group": "Guidelines",
    "type": "get",
    "url": "/apiGuidelines/last_updated",
    "title": "Retrieve a set of guidelines categories by last updated date",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "lastModified",
            "description": "<p>A date for filtering the guidelines categories</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiGuidelines/last_updated?lastModified=08/22/2016",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing a list of guidelines categories (or an empty object if no categories were found)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (304):",
          "content": "HTTP/1.1 304 Not Modified\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGuidelines.js",
    "groupTitle": "Guidelines"
  },
  {
    "name": "Get_GuideLines_Category_Files",
    "description": "<p>Retrieve a set of guidelines categories files</p>",
    "group": "Guidelines",
    "type": "get",
    "url": "/apiGuidelines/category",
    "title": "Retrieve a set of guidelines categories files",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the guidelines category</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiGuidelines/category?id=2rf1ffsq2dwdawd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing a list of files from a guidelines category (or an empty object if the category wasn't found)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (304):",
          "content": "HTTP/1.1 304 Not Modified\n{\n  \"success\":\n  {\n\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiGuidelines.js",
    "groupTitle": "Guidelines"
  },
  {
    "name": "IPad_Applications_Update",
    "description": "<p>Check if there are newer versions of Staywell iPad apps</p>",
    "group": "IPad_Applications",
    "type": "get",
    "url": "/apiPublic/apiAplicationUpgrade",
    "title": "Check if there are newer versions of Staywell iPad apps",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the application</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiAplicationUpgrade?name=arcoxia",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the current version and the download URL</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n    {\n    \"version\": \"1.2\",\n    \"downloadUrl\": \"https://\"\n    }\n},\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ApplicationNotFound",
            "description": "<p>The requested app was not found.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiAplicationUpgrade.js",
    "groupTitle": "IPad_Applications"
  },
  {
    "name": "Get_Januvia_Users",
    "description": "<p>Retrieve a list of Januvia Application users</p>",
    "group": "Januvia_Application",
    "type": "get",
    "url": "/apiJanuvia/users",
    "title": "Retrieve a list of Januvia Application users",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiJanuvia/users",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing a list of Januvia Application users</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":[\n  {\n\n  }],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiJanuvia.js",
    "groupTitle": "Januvia_Application"
  },
  {
    "name": "Check_Email",
    "description": "<p>Check if a user already exists / if the email address is valid</p>",
    "group": "Live_Conferences",
    "type": "delete",
    "url": "/api/streamAdmin/checkEmail",
    "title": "Check if a user already exists / if the email address is valid",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The email of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "checkIfExists",
            "description": "<p>If we want to check if the user exists</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "checkEmailAddress",
            "description": "<p>If we want to verify an email address</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -d '{username: \"john@test.com\"}' http://localhost:8080/api/streamAdmin/checkEmail?checkIfExists=true&checkEmailAddress=false",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of users / an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (checkIfExists):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (checkEmailAddress) :",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx BadRequest Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Create_Conference",
    "description": "<p>Create a conference</p>",
    "group": "Live_Conferences",
    "type": "post",
    "url": "/api/streamAdmin/liveConferences",
    "title": "Create a conference",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "conferenceObj",
            "description": "<p>A conference object (based on liveConferences model)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage (with id):",
        "content": "curl -i -X POST -d 'conferenceObject'  http://localhost:8080/api/streamAdmin/liveConferences",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object with the newly created conference</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response :",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Delete_Conference",
    "description": "<p>Delete a conference</p>",
    "group": "Live_Conferences",
    "type": "delete",
    "url": "/api/streamAdmin/liveConferences",
    "title": "Delete a conference",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the conference</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X DELETE  http://localhost:8080/api/streamAdmin/liveConferences?id=jdnwadw7871231b3b",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response :",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Regexp",
    "description": "<p>Retrieve the regexp validation strings from back-end</p>",
    "group": "Live_Conferences",
    "type": "get",
    "url": "/api/streamAdmin/regexp",
    "title": "Retrieve the regexp validation strings from back-end",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/streamAdmin/regexp",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the validation strings</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Retrieve_Conferences",
    "description": "<p>Retrieve a list of conferences or a single conference</p>",
    "group": "Live_Conferences",
    "type": "get",
    "url": "/api/streamAdmin/liveConferences",
    "title": "Retrieve a list of conferences or a single conference",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>An id for the conference</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "separatedViewers",
            "description": "<p>if we wish to receive the associated viewers</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage (with id):",
        "content": "curl -i  http://localhost:8080/api/streamAdmin/liveConferences?id=owkdoad9w912121&separatedViewers=true",
        "type": "curl"
      },
      {
        "title": "Example usage (without id):",
        "content": "curl -i  http://localhost:8080/api/streamAdmin/liveConferences",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of live conferences / an object with a specific conference</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (without id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Send_Conference_Invitation",
    "description": "<p>Send email to invite users to participate at a conference</p>",
    "group": "Live_Conferences",
    "type": "post",
    "url": "/api/streamAdmin/sendNotification",
    "title": "Send email to invite users to participate at a conference",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "conferencesStateURL",
            "description": "<p>The URL to access the conference in medic section</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the conference</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "spkString",
            "description": "<p>A string containing the names of the speakers</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -d '{conferencesStateURL: 'someURL', spkString: 'speakersString'}' http://localhost:8080/api/streamAdmin/sendNotification",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Send_Conference_Updates_Notification",
    "description": "<p>Send email to notify users for changes in a conference</p>",
    "group": "Live_Conferences",
    "type": "put",
    "url": "/api/streamAdmin/sendNotification",
    "title": "Send email to notify users for changes in a conference",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "conferencesStateURL",
            "description": "<p>The URL to access the conference in medic section</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the conference</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "spkString",
            "description": "<p>A string containing the names of the speakers</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -d '{conferencesStateURL: 'someURL', spkString: 'speakersString'}' http://localhost:8080/api/streamAdmin/sendNotification?id=dnwuadhw71723163bd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Therapeutic_areas",
    "description": "<p>Retrieve a list of therapeutic areas</p>",
    "group": "Live_Conferences",
    "type": "get",
    "url": "/api/streamAdmin/therapeutic_areas",
    "title": "Retrieve a list of therapeutic areas",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/streamAdmin/therapeutic_areas",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of therapeutic areas</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Update_Conference",
    "description": "<p>Update a conference</p>",
    "group": "Live_Conferences",
    "type": "put",
    "url": "/api/streamAdmin/liveConferences",
    "title": "Update a conference",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the conference</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isEnabled",
            "description": "<p>The current status of a conference (true=enabled)</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "updateImage",
            "description": "<p>If we want to update a conference's image</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "image_path",
            "description": "<p>The new Amazon path for the image previously mentioned</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "removeUser",
            "description": "<p>If we want to remove a user from a conference</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "userObject",
            "description": "<p>An object containing a user model.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "addSpeaker",
            "description": "<p>If we want to add a speaker (use previous user param for creating the user).</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "addViewers",
            "description": "<p>If we want to add a viewer (use previous user param for creating the user).</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "moderator",
            "description": "<p>An object containing a user model.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X PUT -d '{isEnabled: '', image_path: '', userObject : {}, moderator: {}}'\nhttp://localhost:8080/api/streamAdmin/liveConferences?id=okwdoai923913njff&updateImage=false&removeUser=false&addSpeaker=false&addViewers=false",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "response.success",
            "description": "<p>the number of conferences that were updated</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response :",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n      1\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "User_Groups",
    "description": "<p>Retrieve a list of user groups</p>",
    "group": "Live_Conferences",
    "type": "get",
    "url": "/api/streamAdmin/groups",
    "title": "Retrieve a list of user groups",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/streamAdmin/groups",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of groups</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "User_List",
    "description": "<p>Retrieve a list of users</p>",
    "group": "Live_Conferences",
    "type": "get",
    "url": "/api/streamAdmin/users",
    "title": "Retrieve a list of users",
    "version": "1.0.0",
    "permission": [
      {
        "name": "streamAdmin",
        "title": "Only users with streamAdmin rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "groups",
            "description": "<p>If we want to retrieve the user's groups</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/streamAdmin/users?groups=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of users</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiStreamAdmin.js",
    "groupTitle": "Live_Conferences"
  },
  {
    "name": "Create_Chat_Thread",
    "description": "<p>Create a chat thread</p>",
    "group": "MSD_DOC",
    "type": "post",
    "url": "/apiMSDDoc/chats/",
    "title": "Create a chat thread",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>The id of the user creating the chat</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "postId",
            "description": "<p>The id of the news post we want to create a chat</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "postOwner",
            "description": "<p>The owner of the post</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of a chat (can be null, 'userBased' or 'postBased')</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{userId: '', postId: '', postOwner: '', type: ''}' http://localhost:8080/apiMSDDoc/chats",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>The newly created chat</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Create_News_Post",
    "description": "<p>Create a news post</p>",
    "group": "MSD_DOC",
    "type": "post",
    "url": "/apiMSDDoc/newsPost/",
    "title": "Create a news post",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>The news post title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The news post content</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" -d '{title: '', message: ''}' http://localhost:8080/apiMSDDoc/newsPost",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>the newly created news post object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "News_Post_Image",
    "description": "<p>Attach a image to a news post</p>",
    "group": "MSD_DOC",
    "type": "post",
    "url": "/apiMSDDoc/image/newspost",
    "title": "Attach a image to a news post",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "files.file",
            "description": "<p>The image file</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the news post</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" --data-binary \"@path/to/file\" http://localhost:8080/apiMSDDoc/image/newspost?id=du8awd822313fnnf",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>An object containing the path to the image</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_Chats",
    "description": "<p>Retrieve a list of chats the current user has participated</p>",
    "group": "MSD_DOC",
    "type": "get",
    "url": "/apiMSDDoc/chats/",
    "title": "Retrieve a list of chats the current user has participated",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pageSize",
            "description": "<p>How many medics we want to receive (for multiple medics)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "created",
            "description": "<p>Filter chats by the created date</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of a chat (can be null or 'topic')</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiMSDDoc/chats?type=topic&pageSize=10&created=22/08/2016",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>A list of chats</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_Medics",
    "description": "<p>Retrieve a medic / multiple medics</p>",
    "group": "MSD_DOC",
    "type": "get",
    "url": "/apiMSDDoc/medics/",
    "title": "Retrieve a medic / multiple medics",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pageSize",
            "description": "<p>How many medics we want to receive (for multiple medics)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the medic (the other two parameters don't apply if used)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>How many medics we want to skip from the beginning of the query results</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiMSDDoc/medics?id=null&pageSize=10&skip=20",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a medic object / multiple medic objects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (without id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Retrieve_NewsPost",
    "description": "<p>Retrieve a news post / multiple news posts based on the create date</p>",
    "group": "MSD_DOC",
    "type": "get",
    "url": "/apiMSDDoc/newsPost/",
    "title": "Retrieve a news post / multiple news posts based on the create date",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pageSize",
            "description": "<p>How many news posts we want to receive (for multiple news posts)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the news post (the other two parameters don't apply if used)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "created",
            "description": "<p>The date the news post was created (for multiple news posts)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiMSDDoc/newsPost?id=90cwwdadwadawf1&pageSize=10&created=08/22/2016",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a news post object / multiple news posts objects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (without id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Subscribe_Unsubscribe_Chat_Thread",
    "description": "<p>Subscribe / un-subscribe to a chat thread</p>",
    "group": "MSD_DOC",
    "type": "put",
    "url": "/apiMSDDoc/chats/",
    "title": "Subscribe / un-subscribe to a chat thread",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "chatId",
            "description": "<p>The id of the chat</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "subscribe",
            "description": "<p>If true, the user will subscribe to a chat thread</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -H \"Authorization: Bearer \" http://localhost:8080/apiMSDDoc/chats?chatId=21nf387r32rn23ndf&subscribe=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>An empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_Profile_Image",
    "description": "<p>Update user profile picture</p>",
    "group": "MSD_DOC",
    "type": "post",
    "url": "/apiMSDDoc/image/profile",
    "title": "Update user profile picture",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "files.file",
            "description": "<p>The image file</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -H \"Authorization: Bearer \" --data-binary \"@path/to/file\" http://localhost:8080/apiMSDDoc/image/profile",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>An object containing the path to the image</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiMSDDoc.js",
    "groupTitle": "MSD_DOC",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Activate_Account_Mobile",
    "description": "<p>Activate user account (mobile only)</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/activateAccount/:token",
    "title": "Activate user account (mobile only)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/activateAccount/idwi9772313nd7ww",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   accepted: true\n}",
          "type": "HTML"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Activate_Account_Web",
    "description": "<p>Activate user account (web only)</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/activateAccountStaywell/:token",
    "title": "Activate user account (web only)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/activateAccountStaywell/idwi9772313nd7ww",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   accepted: true\n}",
          "type": "HTML"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Check_Email_Exists",
    "description": "<p>Check if a email address is already used by a user</p>",
    "group": "Main_Routes",
    "type": "post",
    "url": "/checkEmailExists",
    "title": "Check if a email address is already used by a user",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>An email address</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -d '{\"email\" : \"john@test.com\"}' http://localhost:8080/checkEmailExists",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "response.success.exists",
            "description": "<p>an object confirming the user's existence (can be true or false)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n         exists: true\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Log_Out_User",
    "description": "<p>User log out and redirect to public section/login page</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/logout",
    "title": "User log out and redirect to public section/login page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "admin",
        "title": "Only users with admin rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://localhost:8080/logout",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>the main page of the preview section</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "html"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Login",
    "description": "<p>User login</p>",
    "group": "Main_Routes",
    "type": "post",
    "url": "/login",
    "title": "User login",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>an email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>a password</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -i -d '{\"username\": \"josh@test.com\", \"password\" : \"pass\"}' http://localhost:8080/login",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   accepted: true\n}",
          "type": "HTML"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx AccessForbidden Error\n{\n\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx BadRequest Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "AccessForbidden",
            "description": "<p>Error - Access is forbidden</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Login",
    "description": "<p>User login redirect</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/login",
    "title": "User login",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/login",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   accepted: true\n}",
          "type": "HTML"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Merck_Manual",
    "description": "<p>View the Merck Manual</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/merckManual",
    "title": "View the Merck Manual",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/merckManual",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "PDF",
            "optional": false,
            "field": "response",
            "description": "<p>a PDF document</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "PDF"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Redirect_User_To_Medic_Section_If_Authenticated",
    "description": "<p>Redirect the user to the medic section if he's authenticated, otherwise show him the login page/modal window</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/pro",
    "title": "Redirect the user to the medic section if he's authenticated, otherwise show him the login page/modal window",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://localhost:8080/pro",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>the login page/the main page of public section with the login modal opened</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "html"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Redirect_User_To_Preview_Section",
    "description": "<p>Redirect the user to preview section of a medic content. If authenticated, redirect him to the content</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/preview",
    "title": "Redirect the user to preview section of a medic content. If authenticated, redirect him to the content",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://localhost:8080/preview",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>the main page of the preview section</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "html"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Redirect_User_To_Proper_Main_Page",
    "description": "<p>Redirect the user to the proper main page</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/",
    "title": "Redirect the user to the proper main page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://localhost:8080/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>the main page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "html"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Reset_Password_Page",
    "description": "<p>Reset a user's password - send forgotPass page</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/reset/:token",
    "title": "Reset a user's password - send forgotPass page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>an reset token</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/reset/iojwdj818281631361hdwwd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "HTML"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "html",
            "optional": false,
            "field": "HTMLErrorMessage",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx Error\n{\n\n}",
          "type": "html"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Reset_Password_Success",
    "description": "<p>Reset a user's password - change password and return success page</p>",
    "group": "Main_Routes",
    "type": "post",
    "url": "/reset/:token",
    "title": "Reset a user's password - change password and return success page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>an reset token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the current password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm",
            "description": "<p>the confirmed current password</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -d '{\"password\" : \"pass\", \"confirm\" : \"pass\"}' http://localhost:8080/reset/iojwdj818281631361hdwwd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "HTML"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "html",
            "optional": false,
            "field": "HTMLErrorMessage",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx Error\n{\n\n}",
          "type": "html"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Site_Map",
    "description": "<p>View the Site_Map</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/sitemap",
    "title": "View the Site_Map",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/sitemap",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "XML",
            "optional": false,
            "field": "response",
            "description": "<p>a XML document</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "XML"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Skill_share",
    "description": "<p>View the skillshare page</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/skillshare",
    "title": "View the skillshare page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/skillshare",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "HTML"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Unsubscribe_Newsletter",
    "description": "<p>Un-subscribe a user from newsletter</p>",
    "group": "Main_Routes",
    "type": "get",
    "url": "/unsubscribe",
    "title": "Reset a user's password - change password and return success page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hashedEmail",
            "description": "<p>a hashed email</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/unsubscribe?user=iojwdj818281631361hdwwd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "HTML"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "html",
            "optional": false,
            "field": "HTMLErrorMessage",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx Error\n{\n\n}",
          "type": "html"
        }
      ]
    },
    "filename": "app/routes.js",
    "groupTitle": "Main_Routes"
  },
  {
    "name": "Change_Job",
    "description": "<p>Change User Job</p>",
    "group": "Medic_API",
    "type": "post",
    "url": "/api/userJob",
    "title": "Change User Job",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "street_number",
            "description": "<p>the street number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "street_name",
            "description": "<p>the street name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_name",
            "description": "<p>job name</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "job_type",
            "description": "<p>the job type (1 = Spital; 2 = CMI; 3 = Policlinica; 4 = Farmacie)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "postal_code",
            "description": "<p>the postal code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "job_address",
            "description": "<p>the job address</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -d '{job: {street_number: '' , street_name : '', job_name:'', job_type: 3, postal_code: '', job_address: ''}}' http://localhost:8080/api/userJob",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Change_Password",
    "description": "<p>Change User Password</p>",
    "group": "Medic_API",
    "type": "post",
    "url": "/api/changePassword",
    "title": "Change User Password",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPass",
            "description": "<p>the old password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPass",
            "description": "<p>the new password</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -d '{userData: {oldPass: '' , newPass : ''}}' http://localhost:8080/api/changePassword",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Change_User_Profile_Pic",
    "description": "<p>Change user's profile pic</p>",
    "group": "Medic_API",
    "type": "post",
    "url": "/api/user/addPhoto",
    "title": "Change user's profile pic",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>An object containing the new picture</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  -x POST -d '{data : {Body: '', extension: ''}}' http://localhost:8080/api/user/addPhoto",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Check_Intro_Enabled",
    "description": "<p>Check if a intro is enabled</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/checkIntroEnabled",
    "title": "Check if a intro is enabled",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/checkIntroEnabled",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of intro presentations</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Check_Intro_Viewed",
    "description": "<p>Check if the intro was viewed in this session</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/rememberIntroView",
    "title": "Check if the intro was viewed in this session",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupID",
            "description": "<p>The id of the group the user belongs to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/rememberIntroView?groupID=wdkakdwa99713n",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object telling if the intro was viewed in this session</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n      isViewed: \"\"\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Get_Brochure",
    "description": "<p>Retrieve MSD brochure</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/brochure",
    "title": "Retrieve MSD brochure",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "firstOnly",
            "description": "<p>If we want only the first section of the brochure</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/brochure?firstOnly=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing the brochure sections</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Get_Intro",
    "description": "<p>Retrieve an array of intro presentations</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/introPresentation",
    "title": "Retrieve an array of intro presentations",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/introPresentation",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of intro presentations</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Get_Pathologies",
    "description": "<p>Retrieve an array of pathologies</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/pathologies",
    "title": "Retrieve an array of pathologies",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the pathology</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "forDropdown",
            "description": "<p>If we want to retrieve the patohlogies without their special products/resources</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/pathologies?id=null&forDropdown=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing the pathologies</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Medical_Courses_Redirect",
    "description": "<p>Obtain a token from Medical Courses and send URL for redirect</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/medicalCourses",
    "title": "Obtain a token from Medical Courses and send URL for redirect",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/medicalCourses",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the url for redirect</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {},\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Regexp",
    "description": "<p>Retrieve the regexp validation strings from back-end</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/regexp",
    "title": "Retrieve the regexp validation strings from back-end",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/api/regexp",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the validation strings</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message : \"A message\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Articles",
    "description": "<p>Retrieve an array of articles / a single article</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/content",
    "title": "Retrieve an array of articles / a single article",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content_id",
            "description": "<p>The id of the article</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "content_type",
            "description": "<p>The type of the content (1 = national, 2 = international or 3 = stiintific)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/content?id=null&content_type=3",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of articles / a single article</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (with article id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (no article id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Calendar_Events",
    "description": "<p>Retrieve an array of calendar events / a single event</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/calendar",
    "title": "Retrieve an array of calendar events / a single event",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the calendar event</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idPathology",
            "description": "<p>Filter calendar events items based on a pathology (0 means don't filter by pathology)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/calendar?id=dwhad841895715195151&idPathology=null",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of calendar events / a single calendar event</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (without calendar event id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with calendar event id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Carousel_Images",
    "description": "<p>Retrieve an array of carousel images</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/userHomeCarousel",
    "title": "Retrieve an array of carousel images",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/userHomeCarousel",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of carousel images</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Cities",
    "description": "<p>Retrieve an array of cities based on county name</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/cities",
    "title": "Retrieve an array of cities based on county name",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "county_name",
            "description": "<p>The county's name</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/cities?county_name=Bucuresti",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of cities</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Counties",
    "description": "<p>Retrieve an array of counties</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/counties",
    "title": "Retrieve an array of counties",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/counties",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of cities</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Default_Group",
    "description": "<p>Retrieve the default group of the user</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/defaultPharma",
    "title": "Retrieve the default group of the user",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/defaultPharma",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object with the default group</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Home_Events",
    "description": "<p>Retrieve an array of calendar events for home page</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/userHomeEvents",
    "title": "Retrieve an array of calendar events for home page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/userHomeEvents",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of calendar events</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Home_Multimedia",
    "description": "<p>Retrieve an array of multimedias for home page</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/userHomeMultimedia",
    "title": "Retrieve an array of multimedias for home page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/userHomeMultimedia",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of multimedias</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Home_News",
    "description": "<p>Retrieve an array of articles for home page</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/homeNews",
    "title": "Retrieve an array of articles for home page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "scientific",
            "description": "<p>If we want scientific articles</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/homeNews?scientific=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of articles</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Multimedia",
    "description": "<p>Retrieve an array of multimedia items / a single multimedia item</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/multimedia",
    "title": "Retrieve an array of multimedia items / a single multimedia item",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idMultimedia",
            "description": "<p>The id of the multimedia item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idPathology",
            "description": "<p>Filter multimedia items based on a pathology (0 means don't filter by pathology)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/multimedia?idMultimedia=null&idPathology=jdiwahd9aw8dd0111d",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of multimedia items / a single multimedia item</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (without multimedia id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with multimedia id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Products",
    "description": "<p>Retrieve an array of products / a single product</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/products",
    "title": "Retrieve an array of products / a single product",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idProduct",
            "description": "<p>The id of the product</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idPathology",
            "description": "<p>Filter products based on a pathology (0 means don't filter by pathology)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstLetter",
            "description": "<p>Filter products based on the first letter</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/products?idProduct=dwhad841895715195151&idPathology=null",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of calendar events / a single calendar event</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (without product id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with product id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Search_Content",
    "description": "<p>Retrieve an array of medic specific content for search page</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/userHomeSearch",
    "title": "Retrieve an array of medic specific content for search page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>the string to search for</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/userHomeSearch?data=someString",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of medic specific content</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Apps",
    "description": "<p>Retrieve an array of special apps / a single special app (hybrid apps)</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialFeatures/specialApps",
    "title": "Retrieve an array of special apps / a single special app (hybrid apps)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>The id of the special app</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialFeatures/specialApps?id=dawiy8271515h125s",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array with special apps objects / a single special app</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (no id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Product",
    "description": "<p>Retrieve a special product</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialProductMenu",
    "title": "Retrieve a special product's menu",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the special product</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idPathology",
            "description": "<p>Filter special products by pathology (0 means no filter)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialProduct?id=null&idPathology=wjdjadada924142nn24",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing special products / a single special product</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (no id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (with id):",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Product_By_Group",
    "description": "<p>Retrieve an array of special products by a user's special group</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialFeatures/groupSpecialProducts",
    "title": "Retrieve an array of special products by a user's special group",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "specialGroup",
            "description": "<p>The id of the special group the user belongs</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialFeatures/groupSpecialProducts?id=dawiy8271515h125s",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array with special products associated with the special group</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Product_Description",
    "description": "<p>Retrieve a special product menu item</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialProductDescription",
    "title": "Retrieve a special product menu item",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the special product</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialProductDescription?id=dnjwandawh8264y181b241",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing a menu item</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Product_Files",
    "description": "<p>Retrieve an array of files for a special product</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialProductFiles",
    "title": "Retrieve an array of files for a special product",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the special product</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialProductFiles?id=dnjwandawh8264y181b241",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of files objects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Product_Glossary",
    "description": "<p>Retrieve an array of glossary objects for a special product</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialProductGlossary",
    "title": "Retrieve a glossary array for a special product",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the special product</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialProductGlossary?id=dnjwandawh8264y181b241",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array of glossary objects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Product_Menu",
    "description": "<p>Retrieve a special product's menu</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialProductMenu",
    "title": "Retrieve a special product's menu",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the special product</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialProductMenu?id=dnjwandawh8264y181b241",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an array containing the menu of the product</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_Special_Product_Speaker",
    "description": "<p>Retrieve a speaker for a special product</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/specialProduct/speakers",
    "title": "Retrieve a speaker for a special product",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "speaker_id",
            "description": "<p>The id of the speaker</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/specialProduct/speakers?speaker_id=dnjwandawh8264y181b241",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>a speaker object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Retrieve_User_Data",
    "description": "<p>Retrieve user data for profile page</p>",
    "group": "Medic_API",
    "type": "get",
    "url": "/api/userdata",
    "title": "Retrieve user data for profile page",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i  http://localhost:8080/api/userdata",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing the current user info</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : [{\n\n   }],\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Set_Intro_As_Viewed",
    "description": "<p>Mark an intro as viewed for this session</p>",
    "group": "Medic_API",
    "type": "post",
    "url": "/api/pathologies",
    "title": "Mark an intro as viewed for this session",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "groupID",
            "description": "<p>The group id the user belong to</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -d '{groupID : \"\"}' http://localhost:8080/api/rememberIntroView",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Update_User_Data",
    "description": "<p>Update user's data</p>",
    "group": "Medic_API",
    "type": "put",
    "url": "/api/userdata",
    "title": "Change User Job",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      },
      {
        "name": "devModeMedic",
        "title": "In order to access this api change in the config/environment.js the dev_mode property (set it to true and in loggedInWith fill with an email with medic rights)",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the user's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>the user's title</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "therapeutic-areasID",
            "description": "<p>an array of therapeutic areas ids</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>the user's phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>the user's address</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "subscriptions",
            "description": "<p>subscribe to : newsletterStaywell or infoMSD</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "practiceType",
            "description": "<p>1 = Public , 2 = Private</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "newsletter",
            "description": "<p>subscribe to newsletter</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "citiesID",
            "description": "<p>an array with the city which is the user's hometown</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x PUT -d '{newData: {name: '' , title : '', phone:'', therapeutic-areasID: 3, address: '',\nsubscriptions: {newsletterStaywell: true, infoMSD: false},\npracticeType: '', newsletter: '', citiesID: []}}' http://localhost:8080/api/userdata",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   success : {\n\n   },\n   message: \"Cererea a fost procesata cu succes!\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 400 BadRequest Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Error - Bad request</p>"
          }
        ]
      }
    },
    "filename": "app/api/index.js",
    "groupTitle": "Medic_API"
  },
  {
    "name": "Activate_Account",
    "description": "<p>Activate a user's account</p>",
    "group": "Mobile_API",
    "type": "get",
    "url": "/apiMobileShared/activateAccount/:token",
    "title": "Activate a user's account",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>an activation token</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiMobileShared/activateAccount/iojwdj818281631361hdwwd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "html",
            "optional": false,
            "field": "response",
            "description": "<p>a HTML page</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "HTML"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMobileShared.js",
    "groupTitle": "Mobile_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_User_Profile",
    "description": "<p>Retrieve a user's profile</p>",
    "group": "Mobile_API",
    "type": "get",
    "url": "/apiMobileShared/userProfile",
    "title": "Retrieve a user's profile",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiMobileShared/userProfile",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.success",
            "description": "<p>an object containing user data</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success : {\n\n     },\n     message: \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMobileShared.js",
    "groupTitle": "Mobile_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Redirect_Create_Account",
    "description": "<p>Redirect to the global API for creating an account</p>",
    "group": "Mobile_API",
    "type": "post",
    "url": "/apiMobileShared/createAccount",
    "title": "Redirect to the global API for creating an account",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" http://localhost:8080/apiMobileShared/createAccount",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response",
            "description": "<p>an empty object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMobileShared.js",
    "groupTitle": "Mobile_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Reset_Password",
    "description": "<p>Redirect to the global API for resetting a password</p>",
    "group": "Mobile_API",
    "type": "post",
    "url": "/apiMobileShared/resetPass",
    "title": "Redirect to the global API for resetting a password",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X POST -H \"Authorization: Bearer \" http://localhost:8080/apiMobileShared/resetPass",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response",
            "description": "<p>an empty object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMobileShared.js",
    "groupTitle": "Mobile_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Update_User_Data",
    "description": "<p>Update a user's data</p>",
    "group": "Mobile_API",
    "type": "put",
    "url": "/apiMobileShared/userProfile",
    "title": "Update a user's data",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "citiesID",
            "description": "<p>an array of ids of cities</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "jobsID",
            "description": "<p>an array of ids of jobs</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the user's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>the user's phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "birthday",
            "description": "<p>the user's birthday date</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "therapeutic-areasID",
            "description": "<p>an array of therapeutic areas ids</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>the user's address</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "practiceType",
            "description": "<p>can be 1 = Public, 2 = Private</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "title",
            "description": "<p>can be 1 = Dl, 2 = Dna, 3 = Prof, 4 = Dr</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X PUT -H \"Authorization: Bearer \" -d '{\"citiesID\" : [], \"jobsID\" : [], \"name\" : \"\",\n\"phone\" : \"\", \"birthday\" : \"\",\n\"therapeutic-areasID\" : [], \"address\" : \"\", \"practiceType\" : 1, \"title\" : 1\n}' http://localhost:8080/apiMobileShared/userProfile",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.success",
            "description": "<p>an empty object</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "response.message",
            "description": "<p>A message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     success : {\n\n     },\n     message: \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMobileShared.js",
    "groupTitle": "Mobile_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Prescriptions",
    "description": "<p>Retrieve a list of prescriptions</p>",
    "group": "MyPrescription",
    "type": "get",
    "url": "/apiMyPrescription/config",
    "title": "Retrieve a list of prescriptions",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "last-modified",
            "description": "<p>a date used for filtering prescriptions</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" -H \"last-modified : someDate\" http://localhost:8080/apiMyPrescription/config",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "arr",
            "description": "<p>an array of prescriptions (or an empty object if the last-modified header is not sent</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   [\n\n   ]\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (304):",
          "content": "HTTP/1.1 304 Not Modified\n{\n   [\n\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiMyPrescription.js",
    "groupTitle": "MyPrescription"
  },
  {
    "name": "Get_Product_By_Code",
    "description": "<p>Retrieve a product from medic section by a code</p>",
    "group": "MyPrescription",
    "type": "get",
    "url": "/apiMyPrescription/drug",
    "title": "Retrieve a product from medic section by a code",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "drugCode",
            "description": "<p>the code of the product</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiMyPrescription/drug?drugCode=windw28312c87dw1",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "obj",
            "description": "<p>an object containing the product</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   [\n\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiMyPrescription.js",
    "groupTitle": "MyPrescription",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Get_Product_By_Id",
    "description": "<p>Retrieve a product from medic section by id</p>",
    "group": "MyPrescription",
    "type": "get",
    "url": "/apiMyPrescription/drug",
    "title": "Retrieve a product from medic section by a code",
    "version": "1.0.0",
    "permission": [
      {
        "name": "medic",
        "title": "Only users with medic rights can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the product</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/apiMyPrescription/drug/id?id=windw28312c87dw1",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "obj",
            "description": "<p>an object containing the product</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   [\n\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 404 EntityNotFound Error\n{\n\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ],
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "EntityNotFound",
            "description": "<p>Error - Entity not found</p>"
          }
        ]
      }
    },
    "filename": "app/apiMyPrescription.js",
    "groupTitle": "MyPrescription",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  },
  {
    "name": "Public_Carousel_Images",
    "description": "<p>Retrive carousel images for public section</p>",
    "group": "Public_Carousel",
    "type": "get",
    "url": "/apiPublic/getCarouselData",
    "title": "retrieve carousel images for public section",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/getCarouselData",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>list of public carousel entities.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n      \"success\": [\n      {\n        \"_id\": \"\",\n        \"title\": \"\",\n        \"enable\": true,\n        \"order_index\": 0,\n        \"image_path\": \"\",\n        \"description\": \"\",\n        \"link_name\": \"\",\n        \"last_updated\": \"\",\n        \"content_id\": \"\",\n        \"type\": 1,\n        \"links\": {\n            \"url\": \"\",\n            \"content\": {\n                 \"_id\": \"\",\n                 \"title\": \"\",\n                 \"author\": \"\",\n                 \"description\": \"\",\n                 \"type\": 4,\n                 \"text\" : \"\"\n                 \"enable\": true,\n                 \"date_added\": \"\",\n                 \"last_updated\": \"\",\n                 \"file_path\": \"\",\n                 \"image_path\": \"\",\n                 \"therapeutic-areasID\": []\n        }\n}\n      ],\n      \"message\": \"Cererea a fost procesata cu succes\"\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Carousel"
  },
  {
    "name": "Retrive_Public_Categories",
    "description": "<p>Get the public categories</p>",
    "group": "Public_Categories",
    "type": "get",
    "url": "/apiPublic/categories",
    "title": "Get the public categories",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id for retrieving a specific public category instead of all public categories.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage (all categories):",
        "content": "curl -i http://localhost:8080/apiPublic/categories",
        "type": "curl"
      },
      {
        "title": "Example usage (single category):",
        "content": "curl -i http://localhost:8080/apiPublic/categories?id=wdjhwdnw11",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of public categories (or a specific category).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (all categories):",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": [\n  {\n    \"_id\": \"\",\n    \"name\": \"\",\n    \"isEnabled\": true,\n    \"description\": \"\",\n    \"image_path\" : Array,\n    \"last_updated\" : \"\"\n  }\n],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (one category):",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\":\n  {\n    \"_id\": \"\",\n    \"name\": \"\",\n    \"isEnabled\": true,\n    \"description\": \"\",\n    \"image_path\" : Array,\n    \"last_updated\" : \"\"\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Categories"
  },
  {
    "name": "Retrive_Most_Read_Public_Content",
    "description": "<p>Retrive the most read content for public section</p>",
    "group": "Public_Content",
    "type": "get",
    "url": "/apiPublic/content",
    "title": "retrieve the most read content for public section",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "type",
            "description": "<p>Public content type (1 = stire (noutati); 2 = articol (despre); 3 = elearning; 4 = download).</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/content?type=1",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of public content entities.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": [\n  {\n    \"_id\": \"\",\n    \"title\": \"\",\n    \"enable\": true,\n    \"author\": 0,\n    \"description\": \"\",\n    \"text\": \"\",\n    \"type\": Number,\n    \"date_added\": \"\",\n    \"last_updated\": \"\",\n    \"image_path\": \"\",\n    \"file_path\": \"\",\n    \"nrOfViews\" : Number,\n    \"therapeutic-areasID\" : Array\n    \"category\" : \"\"\n  }\n],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Content"
  },
  {
    "name": "Retrive_Public_Content",
    "description": "<p>Retrive content for public section</p>",
    "group": "Public_Content",
    "type": "get",
    "url": "/apiPublic/content",
    "title": "retrieve content for public section",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>Optional id for retrieving a specific content instead of all public content.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "isFile",
            "description": "<p>If the requested specific content is a file (use it in conjunction with the id param).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "type",
            "description": "<p>Public content type (1 = stire (noutati); 2 = articol (despre); 3 = elearning; 4 = download).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "area",
            "description": "<p>Filter the public content by therapeutic area.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "category",
            "description": "<p>The category of the public content.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage (for a single item):",
        "content": "curl -i http://localhost:8080/apiPublic/content?type=1&area=23assdsdw&category=221ssaww",
        "type": "curl"
      },
      {
        "title": "Example usage (for all items):",
        "content": "curl -i http://localhost:8080/apiPublic/content?id=232aasd&isFile=true",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of public content entities (or a single public content item).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response (in case of missing id in query params):",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": [\n  {\n    \"_id\": \"\",\n    \"title\": \"\",\n    \"enable\": true,\n    \"author\": 0,\n    \"description\": \"\",\n    \"text\": \"\",\n    \"type\": Number,\n    \"date_added\": \"\",\n    \"last_updated\": \"\",\n    \"image_path\": \"\",\n    \"file_path\": \"\",\n    \"nrOfViews\" : Number,\n    \"therapeutic-areasID\" : Array\n    \"category\" : \"\"\n  }\n],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response (in case of id in query params):",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": {\n    \"_id\": \"\",\n    \"title\": \"\",\n    \"enable\": true,\n    \"author\": 0,\n    \"description\": \"\",\n    \"text\": \"\",\n    \"type\": Number,\n    \"date_added\": \"\",\n    \"last_updated\": \"\",\n    \"image_path\": \"\",\n    \"file_path\": \"\",\n    \"nrOfViews\" : Number,\n    \"therapeutic-areasID\" :\n    \"category\" : \"\"\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ContentNotFound",
            "description": "<p>The requested public content was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "AccessForbidden",
            "description": "<p>You don't have access to the requested public content.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response (4xx):",
          "content": "HTTP/1.1 4xx Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Content"
  },
  {
    "name": "Retrive_Public_Content_For_Mobile",
    "description": "<p>Retrive content for public section (mobile version)</p>",
    "group": "Public_Content",
    "type": "get",
    "url": "/apiPublic/mobileContent",
    "title": "retrieve content for public section (mobile version)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/mobileContent",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of public content entities.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": [\n  {\n    \"_id\": \"\",\n    \"title\": \"\",\n    \"enable\": true,\n    \"author\": 0,\n    \"description\": \"\",\n    \"text\": \"\",\n    \"type\": Number,\n    \"date_added\": \"\",\n    \"last_updated\": \"\",\n    \"image_path\": \"\",\n    \"file_path\": \"\",\n    \"nrOfViews\" : Number,\n    \"therapeutic-areasID\" : Array\n    \"category\" : \"\"\n  }\n],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Content"
  },
  {
    "name": "Search_Public_Content",
    "description": "<p>Search in public content for keyword/phrase</p>",
    "group": "Public_Content",
    "type": "get",
    "url": "/apiPublic/publicSearch",
    "title": "search in public content for keyword/phrase",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "term",
            "description": "<p>String/phrase to search.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/publicSearch?term=something",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of public content entities.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": [\n  {\n    \"_id\": \"\",\n    \"title\": \"\",\n    \"enable\": true,\n    \"author\": 0,\n    \"description\": \"\",\n    \"text\": \"\",\n    \"type\": Number,\n    \"date_added\": \"\",\n    \"last_updated\": \"\",\n    \"image_path\": \"\",\n    \"file_path\": \"\",\n    \"nrOfViews\" : Number,\n    \"therapeutic-areasID\" : Array\n    \"category\" : \"\"\n  }\n],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Content"
  },
  {
    "name": "Update_Public_Content",
    "description": "<p>Update number of views for a public content item</p>",
    "group": "Public_Content",
    "type": "put",
    "url": "/apiPublic/content",
    "title": "update number of views for a public content item",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the public content item which will be updated.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -X PUT http://localhost:8080/apiPublic/content?id=232aasd",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response.success",
            "description": "<p>The public content item before update.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": {\n    \"_id\": \"\",\n    \"title\": \"\",\n    \"enable\": true,\n    \"author\": 0,\n    \"description\": \"\",\n    \"text\": \"\",\n    \"type\": Number,\n    \"date_added\": \"\",\n    \"last_updated\": \"\",\n    \"image_path\": \"\",\n    \"file_path\": \"\",\n    \"nrOfViews\" : Number,\n    \"therapeutic-areasID\" : Array\n    \"category\" : \"\"\n  },\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Query Error\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Content"
  },
  {
    "name": "Retrive_Public_Events",
    "description": "<p>Get the public events</p>",
    "group": "Public_Events",
    "type": "get",
    "url": "/apiPublic/events",
    "title": "Get the public events",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/events",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of public events.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": [\n  {\n    \"_id\": \"\",\n    \"description\": \"\",\n    \"enable\": true,\n    \"end\": \"\",\n    \"groupsID\" : Array,\n    \"last_updated\" : \"\",\n    \"name\" : \"\"\n    \"place\" : \"\",\n    \"start\" : \"\",\n    \"type\" : \"\",\n    \"listconferences\" : Array,\n    \"pathologiesID\" : Array,\n    \"isPublic\" : true\n  }\n],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Public_Events"
  },
  {
    "name": "Retrive_Terms_Conditions",
    "description": "<p>Get the terms &amp; conditions</p>",
    "group": "Terms___conditions",
    "type": "get",
    "url": "/apiPublic/termsAndConditionsStaywell",
    "title": "Get the terms & conditions",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/termsAndConditionsStaywell",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HTML",
            "optional": false,
            "field": "HTMLContent",
            "description": "<p>The HTML page containing the terms &amp; conditions.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n'<html></html>'",
          "type": "HTML"
        }
      ]
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Terms___conditions"
  },
  {
    "name": "Retrive_Terms_Conditions_MSD",
    "description": "<p>Get the terms &amp; conditions (MSD)</p>",
    "group": "Terms___conditions_MSD",
    "type": "get",
    "url": "/apiPublic/termsAndConditionsStaywell",
    "title": "Get the terms & conditions (MSD)",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/termsAndConditionsMSD",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HTML",
            "optional": false,
            "field": "HTMLContent",
            "description": "<p>The HTML page containing the terms &amp; conditions.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n'<html></html>'",
          "type": "HTML"
        }
      ]
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Terms___conditions_MSD"
  },
  {
    "name": "Retrive_Therapeutic_Areas",
    "description": "<p>Get the public therapeutic areas</p>",
    "group": "Therapeutic_Areas",
    "type": "get",
    "url": "/apiPublic/therapeuticAreas",
    "title": "Get the public therapeutic areas",
    "version": "1.0.0",
    "permission": [
      {
        "name": "None",
        "title": "Any user can access this route",
        "description": ""
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:8080/apiPublic/therapeuticAreas",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "response.success",
            "description": "<p>a list of public therapeutic areas.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response.message",
            "description": "<p>A success message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": [\n  {\n    \"_id\": \"\",\n    \"name\": \"\",\n    \"enabled\": true,\n    \"last_updated\": \"\"\n  }\n],\n  \"message\": \"Cererea a fost procesata cu succes\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n  \"error\": \"Error Message\",\n  \"data\" : {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "app/apiPublic.js",
    "groupTitle": "Therapeutic_Areas"
  },
  {
    "name": "Create_token",
    "description": "<p>Create Bearer token</p>",
    "group": "Token_API",
    "type": "post",
    "url": "/authenticateToken",
    "title": "Create Bearer token",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>the user's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>the user's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "deviceType",
            "description": "<p>the device's type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "notificationToken",
            "description": "<p>the device's notification token</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -x POST -d '{username: '', password: ''}' http://localhost:8080/authenticateToken",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response",
            "description": "<p>an object containing the token and user data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   token : \"\",\n   {}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "config/tokenAuth.js",
    "groupTitle": "Token_API"
  },
  {
    "name": "Refresh_token",
    "description": "<p>Refresh Bearer token</p>",
    "group": "Token_API",
    "type": "get",
    "url": "/authenticateToken",
    "title": "Refresh Bearer token",
    "version": "1.0.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i -H \"Authorization: Bearer \" http://localhost:8080/authenticateToken",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "response",
            "description": "<p>an object containing the new token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   token : \"\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response (500):",
          "content": "HTTP/1.1 500 Server Error\n{\n     error: \"\",\n     data: {}\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "type": "Object",
            "optional": false,
            "field": "ServerError",
            "description": "<p>The requested operation could not be executed</p>"
          }
        ]
      }
    },
    "filename": "config/tokenAuth.js",
    "groupTitle": "Token_API",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Bearer",
            "description": "<p>a Bearer token included in &quot;Authorization&quot; HTTP Header</p>"
          }
        ]
      }
    }
  }
] });