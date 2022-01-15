/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateKudoInput = {
  id?: string | null,
  giverId: string,
  receiverId: string,
  message: string,
  kudoVerb: KudoVerb,
  dataSourceApp: DataSourceApp,
  createdAt?: string | null,
};

export enum KudoVerb {
  kudos = "kudos",
  props = "props",
  sparkles = "sparkles",
  fireworks = "fireworks",
}


export enum DataSourceApp {
  github = "github",
  slack = "slack",
  teams = "teams",
  twitter = "twitter",
  other = "other",
}


export type ModelKudoConditionInput = {
  giverId?: ModelIDInput | null,
  receiverId?: ModelIDInput | null,
  message?: ModelStringInput | null,
  kudoVerb?: ModelKudoVerbInput | null,
  dataSourceApp?: ModelDataSourceAppInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelKudoConditionInput | null > | null,
  or?: Array< ModelKudoConditionInput | null > | null,
  not?: ModelKudoConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelKudoVerbInput = {
  eq?: KudoVerb | null,
  ne?: KudoVerb | null,
};

export type ModelDataSourceAppInput = {
  eq?: DataSourceApp | null,
  ne?: DataSourceApp | null,
};

export type Kudo = {
  __typename: "Kudo",
  id: string,
  giverId: string,
  receiverId: string,
  message: string,
  kudoVerb: KudoVerb,
  dataSourceApp: DataSourceApp,
  metadata?: Metadata | null,
  createdAt: string,
  giver?: Person | null,
  receiver?: Person | null,
  updatedAt: string,
};

export type Metadata = GitHubMetadata | TwitterMetadata


export type GitHubMetadata = {
  __typename: "GitHubMetadata",
  dataSourceId: string,
  dataSourceApp: DataSourceApp,
  url: string,
  owner: string,
  repo?: string | null,
  team?: string | null,
  item?: GitHubItem | null,
};

export type IDataSource = {
  __typename: "IDataSource",
  dataSourceId: string,
  dataSourceApp: DataSourceApp,
  url: string,
};

export type TwitterMetadata = {
  __typename: "TwitterMetadata",
  dataSourceId: string,
  dataSourceApp: DataSourceApp,
  url: string,
};

export enum GitHubItem {
  issue = "issue",
  pullRequest = "pullRequest",
  discussion = "discussion",
  teamPost = "teamPost",
}


export type Person = {
  __typename: "Person",
  id: string,
  username: string,
  email?: string | null,
  dataSourceApp: DataSourceApp,
  kudosGiven?: ModelKudoConnection | null,
  kudosReceived?: ModelKudoConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelKudoConnection = {
  __typename: "ModelKudoConnection",
  items:  Array<Kudo | null >,
  nextToken?: string | null,
};

export type UpdateKudoInput = {
  id: string,
  giverId?: string | null,
  receiverId?: string | null,
  message?: string | null,
  kudoVerb?: KudoVerb | null,
  dataSourceApp?: DataSourceApp | null,
  createdAt?: string | null,
};

export type DeleteKudoInput = {
  id: string,
};

export type CreatePersonInput = {
  id?: string | null,
  username: string,
  email?: string | null,
  dataSourceApp: DataSourceApp,
};

export type ModelPersonConditionInput = {
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  dataSourceApp?: ModelDataSourceAppInput | null,
  and?: Array< ModelPersonConditionInput | null > | null,
  or?: Array< ModelPersonConditionInput | null > | null,
  not?: ModelPersonConditionInput | null,
};

export type UpdatePersonInput = {
  id: string,
  username?: string | null,
  email?: string | null,
  dataSourceApp?: DataSourceApp | null,
};

export type DeletePersonInput = {
  id: string,
};

export type ModelKudoFilterInput = {
  id?: ModelIDInput | null,
  giverId?: ModelIDInput | null,
  receiverId?: ModelIDInput | null,
  message?: ModelStringInput | null,
  kudoVerb?: ModelKudoVerbInput | null,
  dataSourceApp?: ModelDataSourceAppInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelKudoFilterInput | null > | null,
  or?: Array< ModelKudoFilterInput | null > | null,
  not?: ModelKudoFilterInput | null,
};

export type ModelPersonFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  dataSourceApp?: ModelDataSourceAppInput | null,
  and?: Array< ModelPersonFilterInput | null > | null,
  or?: Array< ModelPersonFilterInput | null > | null,
  not?: ModelPersonFilterInput | null,
};

export type ModelPersonConnection = {
  __typename: "ModelPersonConnection",
  items:  Array<Person | null >,
  nextToken?: string | null,
};

export type CreateKudoMutationVariables = {
  input: CreateKudoInput,
  condition?: ModelKudoConditionInput | null,
};

export type CreateKudoMutation = {
  createKudo?:  {
    __typename: "Kudo",
    id: string,
    giverId: string,
    receiverId: string,
    message: string,
    kudoVerb: KudoVerb,
    dataSourceApp: DataSourceApp,
    metadata: ( {
        __typename: "GitHubMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
        owner: string,
        repo?: string | null,
        team?: string | null,
        item?: GitHubItem | null,
      } | {
        __typename: "TwitterMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
      }
    ) | null,
    createdAt: string,
    giver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    receiver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateKudoMutationVariables = {
  input: UpdateKudoInput,
  condition?: ModelKudoConditionInput | null,
};

export type UpdateKudoMutation = {
  updateKudo?:  {
    __typename: "Kudo",
    id: string,
    giverId: string,
    receiverId: string,
    message: string,
    kudoVerb: KudoVerb,
    dataSourceApp: DataSourceApp,
    metadata: ( {
        __typename: "GitHubMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
        owner: string,
        repo?: string | null,
        team?: string | null,
        item?: GitHubItem | null,
      } | {
        __typename: "TwitterMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
      }
    ) | null,
    createdAt: string,
    giver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    receiver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteKudoMutationVariables = {
  input: DeleteKudoInput,
  condition?: ModelKudoConditionInput | null,
};

export type DeleteKudoMutation = {
  deleteKudo?:  {
    __typename: "Kudo",
    id: string,
    giverId: string,
    receiverId: string,
    message: string,
    kudoVerb: KudoVerb,
    dataSourceApp: DataSourceApp,
    metadata: ( {
        __typename: "GitHubMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
        owner: string,
        repo?: string | null,
        team?: string | null,
        item?: GitHubItem | null,
      } | {
        __typename: "TwitterMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
      }
    ) | null,
    createdAt: string,
    giver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    receiver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreatePersonMutationVariables = {
  input: CreatePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type CreatePersonMutation = {
  createPerson?:  {
    __typename: "Person",
    id: string,
    username: string,
    email?: string | null,
    dataSourceApp: DataSourceApp,
    kudosGiven?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    kudosReceived?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePersonMutationVariables = {
  input: UpdatePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type UpdatePersonMutation = {
  updatePerson?:  {
    __typename: "Person",
    id: string,
    username: string,
    email?: string | null,
    dataSourceApp: DataSourceApp,
    kudosGiven?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    kudosReceived?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePersonMutationVariables = {
  input: DeletePersonInput,
  condition?: ModelPersonConditionInput | null,
};

export type DeletePersonMutation = {
  deletePerson?:  {
    __typename: "Person",
    id: string,
    username: string,
    email?: string | null,
    dataSourceApp: DataSourceApp,
    kudosGiven?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    kudosReceived?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetKudoQueryVariables = {
  id: string,
};

export type GetKudoQuery = {
  getKudo?:  {
    __typename: "Kudo",
    id: string,
    giverId: string,
    receiverId: string,
    message: string,
    kudoVerb: KudoVerb,
    dataSourceApp: DataSourceApp,
    metadata: ( {
        __typename: "GitHubMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
        owner: string,
        repo?: string | null,
        team?: string | null,
        item?: GitHubItem | null,
      } | {
        __typename: "TwitterMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
      }
    ) | null,
    createdAt: string,
    giver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    receiver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type ListKudosQueryVariables = {
  filter?: ModelKudoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListKudosQuery = {
  listKudos?:  {
    __typename: "ModelKudoConnection",
    items:  Array< {
      __typename: "Kudo",
      id: string,
      giverId: string,
      receiverId: string,
      message: string,
      kudoVerb: KudoVerb,
      dataSourceApp: DataSourceApp,
      metadata: ( {
          __typename: "GitHubMetadata",
          dataSourceId: string,
          dataSourceApp: DataSourceApp,
          url: string,
          owner: string,
          repo?: string | null,
          team?: string | null,
          item?: GitHubItem | null,
        } | {
          __typename: "TwitterMetadata",
          dataSourceId: string,
          dataSourceApp: DataSourceApp,
          url: string,
        }
      ) | null,
      createdAt: string,
      giver?:  {
        __typename: "Person",
        id: string,
        username: string,
        email?: string | null,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null,
      receiver?:  {
        __typename: "Person",
        id: string,
        username: string,
        email?: string | null,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPersonQueryVariables = {
  id: string,
};

export type GetPersonQuery = {
  getPerson?:  {
    __typename: "Person",
    id: string,
    username: string,
    email?: string | null,
    dataSourceApp: DataSourceApp,
    kudosGiven?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    kudosReceived?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPersonsQueryVariables = {
  filter?: ModelPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPersonsQuery = {
  listPersons?:  {
    __typename: "ModelPersonConnection",
    items:  Array< {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateKudoSubscription = {
  onCreateKudo?:  {
    __typename: "Kudo",
    id: string,
    giverId: string,
    receiverId: string,
    message: string,
    kudoVerb: KudoVerb,
    dataSourceApp: DataSourceApp,
    metadata: ( {
        __typename: "GitHubMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
        owner: string,
        repo?: string | null,
        team?: string | null,
        item?: GitHubItem | null,
      } | {
        __typename: "TwitterMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
      }
    ) | null,
    createdAt: string,
    giver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    receiver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateKudoSubscription = {
  onUpdateKudo?:  {
    __typename: "Kudo",
    id: string,
    giverId: string,
    receiverId: string,
    message: string,
    kudoVerb: KudoVerb,
    dataSourceApp: DataSourceApp,
    metadata: ( {
        __typename: "GitHubMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
        owner: string,
        repo?: string | null,
        team?: string | null,
        item?: GitHubItem | null,
      } | {
        __typename: "TwitterMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
      }
    ) | null,
    createdAt: string,
    giver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    receiver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteKudoSubscription = {
  onDeleteKudo?:  {
    __typename: "Kudo",
    id: string,
    giverId: string,
    receiverId: string,
    message: string,
    kudoVerb: KudoVerb,
    dataSourceApp: DataSourceApp,
    metadata: ( {
        __typename: "GitHubMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
        owner: string,
        repo?: string | null,
        team?: string | null,
        item?: GitHubItem | null,
      } | {
        __typename: "TwitterMetadata",
        dataSourceId: string,
        dataSourceApp: DataSourceApp,
        url: string,
      }
    ) | null,
    createdAt: string,
    giver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    receiver?:  {
      __typename: "Person",
      id: string,
      username: string,
      email?: string | null,
      dataSourceApp: DataSourceApp,
      kudosGiven?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      kudosReceived?:  {
        __typename: "ModelKudoConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePersonSubscription = {
  onCreatePerson?:  {
    __typename: "Person",
    id: string,
    username: string,
    email?: string | null,
    dataSourceApp: DataSourceApp,
    kudosGiven?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    kudosReceived?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePersonSubscription = {
  onUpdatePerson?:  {
    __typename: "Person",
    id: string,
    username: string,
    email?: string | null,
    dataSourceApp: DataSourceApp,
    kudosGiven?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    kudosReceived?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePersonSubscription = {
  onDeletePerson?:  {
    __typename: "Person",
    id: string,
    username: string,
    email?: string | null,
    dataSourceApp: DataSourceApp,
    kudosGiven?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    kudosReceived?:  {
      __typename: "ModelKudoConnection",
      items:  Array< {
        __typename: "Kudo",
        id: string,
        giverId: string,
        receiverId: string,
        message: string,
        kudoVerb: KudoVerb,
        dataSourceApp: DataSourceApp,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
