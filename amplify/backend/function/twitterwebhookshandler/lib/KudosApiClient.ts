import { GraphQLClient } from "graphql-request";
import * as winston from "winston";
import { KudosGraphQLConfig } from "./ConfigService";
import {
  CreateKudoInput,
  CreateKudoMutation,
  CreateKudoMutationVariables,
  CreatePersonInput,
  CreatePersonMutation,
  CreatePersonMutationVariables,
  DataSourceApp,
  Kudo,
  KudoVerb,
  ListPersonsQuery,
  ListPersonsQueryVariables,
  ModelPersonConnection,
  Person,
} from "./kudos-api/API";
import { createKudo, createPerson } from "./kudos-api/graphql/mutations";
import { listPersons } from "./kudos-api/graphql/queries";
import { LoggerService } from "./LoggerService";

export class KudosApiClient {
  private readonly graphQLClient: GraphQLClient;
  private readonly logger: winston.Logger;

  constructor(kudosGraphQLConfig: KudosGraphQLConfig) {
    this.logger = LoggerService.createLogger();
    this.graphQLClient = new GraphQLClient(kudosGraphQLConfig.ApiUrl, {
      headers: {
        "x-api-key": kudosGraphQLConfig.ApiKey,
      },
    });
  }

  static async build(kudosGraphQLConfig: KudosGraphQLConfig): Promise<KudosApiClient> {
    return new KudosApiClient(kudosGraphQLConfig);
  }

  public async createKudo(giverUsername: string, receiverUsername: string, message: string): Promise<{ kudo: Kudo; receiver: Person }> {
    this.logger.info(`Creating Kudo from ${giverUsername} to ${receiverUsername} with message "${message}"`);
    let giver: Person = await this.getUser(giverUsername);
    if (!giver) {
      giver = await this.createPerson({ input: { username: giverUsername, dataSourceApp: DataSourceApp.twitter } });
    }
    let receiver: Person = await this.getUser(receiverUsername);
    if (!receiver) {
      receiver = await this.createPerson({ input: { username: receiverUsername, dataSourceApp: DataSourceApp.twitter } });
    }

    const kudo = await this.sendCreateKudoRequest({
      input: { giverId: giver.id, receiverId: receiver.id, message: message, dataSourceApp: DataSourceApp.twitter, kudoVerb: KudoVerb.kudos },
    });

    return { kudo, receiver: kudo.receiver };
  }

  private async sendCreateKudoRequest(mutationVariables: CreateKudoMutationVariables): Promise<Kudo> {
    this.logger.info(`Sending create kudo request`);
    const input: CreateKudoInput = { ...mutationVariables.input, dataSourceApp: DataSourceApp.twitter, kudoVerb: KudoVerb.kudos };
    const rawResponse = await this.graphQLClient.request(createKudo, { ...mutationVariables, input });
    this.logger.http(JSON.stringify(rawResponse));
    const createKudoResponse = rawResponse as CreateKudoMutation;
    if (!createKudoResponse) {
      throw new Error("Expected a CreateKudoMutation response from createKudo");
    }
    const kudo = createKudoResponse.createKudo as Kudo;
    this.logger.info(`Created Kudo ${kudo.id}`);
    return kudo;
  }

  private async createPerson(mutationVariables: CreatePersonMutationVariables): Promise<Person> {
    this.logger.info(`Creating a person with the username ${mutationVariables.input.username}`);
    const input: CreatePersonInput = { ...mutationVariables.input, dataSourceApp: DataSourceApp.twitter };
    const rawResponse = await this.graphQLClient.request(createPerson, { ...mutationVariables, input });
    this.logger.http(JSON.stringify(rawResponse));
    const createPersonResponse = rawResponse as CreatePersonMutation;
    if (!createPersonResponse) {
      throw new Error("Expected a CreatePersonMutation response from createPerson");
    }
    const person = createPersonResponse.createPerson as Person;
    return person;
  }

  private async listPeople(queryVariables: ListPersonsQueryVariables): Promise<ModelPersonConnection> {
    const rawResponse = await this.graphQLClient.request(listPersons, queryVariables);
    this.logger.http(JSON.stringify(rawResponse));
    const listPersonsResponse = rawResponse as ListPersonsQuery;
    if (!listPersonsResponse) {
      throw new Error("Expected a ListPersonsQuery response from listPersons");
    }
    const modelPersonConnection = listPersonsResponse.listPersons as ModelPersonConnection;
    return modelPersonConnection;
  }

  private async getUser(username: string): Promise<Person> {
    this.logger.info(`Getting user for username ${username}`);

    const peopleResponse = await this.listPeople({ filter: { username: { eq: username }, dataSourceApp: { eq: DataSourceApp.twitter } } });

    const people = peopleResponse.items;
    this.logger.info(`Found ${people.length} users`);

    if (people.length === 0) {
      return null;
    }

    // Sort the array to get the newest (just in case there are more than 1)
    people.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const person = people[0];
    return person;
  }
}
