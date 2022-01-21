/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

// Manually Overridden
export const createKudo = /* GraphQL */ `
  mutation CreateKudo($input: CreateKudoInput!, $condition: ModelKudoConditionInput) {
    createKudo(input: $input, condition: $condition) {
      id
      createdAt
      receiver {
        kudosReceived {
          items {
            id
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const updateKudo = /* GraphQL */ `
  mutation UpdateKudo($input: UpdateKudoInput!, $condition: ModelKudoConditionInput) {
    updateKudo(input: $input, condition: $condition) {
      id
      giverId
      receiverId
      message
      kudoVerb
      dataSourceApp
      createdAt
      link
      metadata
      giver {
        id
        username
        email
        dataSourceApp
        kudosGiven {
          nextToken
        }
        kudosReceived {
          nextToken
        }
        createdAt
        updatedAt
      }
      receiver {
        id
        username
        email
        dataSourceApp
        kudosGiven {
          nextToken
        }
        kudosReceived {
          nextToken
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const deleteKudo = /* GraphQL */ `
  mutation DeleteKudo($input: DeleteKudoInput!, $condition: ModelKudoConditionInput) {
    deleteKudo(input: $input, condition: $condition) {
      id
      giverId
      receiverId
      message
      kudoVerb
      dataSourceApp
      createdAt
      link
      metadata
      giver {
        id
        username
        email
        dataSourceApp
        kudosGiven {
          nextToken
        }
        kudosReceived {
          nextToken
        }
        createdAt
        updatedAt
      }
      receiver {
        id
        username
        email
        dataSourceApp
        kudosGiven {
          nextToken
        }
        kudosReceived {
          nextToken
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const createPerson = /* GraphQL */ `
  mutation CreatePerson($input: CreatePersonInput!, $condition: ModelPersonConditionInput) {
    createPerson(input: $input, condition: $condition) {
      id
      username
      email
      dataSourceApp
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          link
          metadata
          updatedAt
        }
        nextToken
      }
      kudosReceived {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          link
          metadata
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson($input: UpdatePersonInput!, $condition: ModelPersonConditionInput) {
    updatePerson(input: $input, condition: $condition) {
      id
      username
      email
      dataSourceApp
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          link
          metadata
          updatedAt
        }
        nextToken
      }
      kudosReceived {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          link
          metadata
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePerson = /* GraphQL */ `
  mutation DeletePerson($input: DeletePersonInput!, $condition: ModelPersonConditionInput) {
    deletePerson(input: $input, condition: $condition) {
      id
      username
      email
      dataSourceApp
      kudosGiven {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          link
          metadata
          updatedAt
        }
        nextToken
      }
      kudosReceived {
        items {
          id
          giverId
          receiverId
          message
          kudoVerb
          dataSourceApp
          createdAt
          link
          metadata
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
