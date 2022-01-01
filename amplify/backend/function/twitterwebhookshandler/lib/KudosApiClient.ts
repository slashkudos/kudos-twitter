import { GraphQLClient, gql } from "graphql-request";
import * as winston from "winston";
import { KudosGraphQLConfig } from "./ConfigService";
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

  public listKudos = async () => {
    const query = gql`
      {
        listKudos {
          items {
            id
            receiver {
              email
              username
            }
            giver {
              username
              email
            }
            createdAt
            kudoVerb
          }
        }
      }
    `;

    const data = await this.graphQLClient.request(query);
    this.logger.debug(JSON.stringify(data, undefined, 2));
  };
}
