"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.KudosApiClient = void 0;
var graphql_request_1 = require("graphql-request");
var API_1 = require("./kudos-api/API");
var mutations_1 = require("./kudos-api/graphql/mutations");
var queries_1 = require("./kudos-api/graphql/queries");
var LoggerService_1 = require("./LoggerService");
var KudosApiClient = /** @class */ (function () {
    function KudosApiClient(kudosGraphQLConfig) {
        this.logger = LoggerService_1.LoggerService.createLogger();
        this.graphQLClient = new graphql_request_1.GraphQLClient(kudosGraphQLConfig.ApiUrl, {
            headers: {
                "x-api-key": kudosGraphQLConfig.ApiKey
            }
        });
    }
    KudosApiClient.build = function (kudosGraphQLConfig) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new KudosApiClient(kudosGraphQLConfig)];
            });
        });
    };
    KudosApiClient.prototype.createKudo = function (giverUsername, receiverUsername, message) {
        return __awaiter(this, void 0, void 0, function () {
            var giver, receiver, kudo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Creating Kudo from ".concat(giverUsername, " to ").concat(receiverUsername, " with message \"").concat(message, "\""));
                        return [4 /*yield*/, this.getUser(giverUsername)];
                    case 1:
                        giver = _a.sent();
                        if (!!giver) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createPerson({ input: { username: giverUsername, dataSourceApp: API_1.DataSourceApp.twitter } })];
                    case 2:
                        giver = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getUser(receiverUsername)];
                    case 4:
                        receiver = _a.sent();
                        if (!!receiver) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createPerson({ input: { username: receiverUsername, dataSourceApp: API_1.DataSourceApp.twitter } })];
                    case 5:
                        receiver = _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.sendCreateKudoRequest({
                            input: { giverId: giver.id, receiverId: receiver.id, message: message, dataSourceApp: API_1.DataSourceApp.twitter, kudoVerb: API_1.KudoVerb.kudos }
                        })];
                    case 7:
                        kudo = _a.sent();
                        return [2 /*return*/, { kudo: kudo, receiver: kudo.receiver }];
                }
            });
        });
    };
    KudosApiClient.prototype.sendCreateKudoRequest = function (mutationVariables) {
        return __awaiter(this, void 0, void 0, function () {
            var input, rawResponse, createKudoResponse, kudo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Sending create kudo request");
                        input = __assign(__assign({}, mutationVariables.input), { dataSourceApp: API_1.DataSourceApp.twitter, kudoVerb: API_1.KudoVerb.kudos });
                        return [4 /*yield*/, this.graphQLClient.request(mutations_1.createKudo, __assign(__assign({}, mutationVariables), { input: input }))];
                    case 1:
                        rawResponse = _a.sent();
                        this.logger.http(JSON.stringify(rawResponse));
                        createKudoResponse = rawResponse;
                        if (!createKudoResponse) {
                            throw new Error("Expected a CreateKudoMutation response from createKudo");
                        }
                        kudo = createKudoResponse.createKudo;
                        this.logger.info("Created Kudo ".concat(kudo.id));
                        return [2 /*return*/, kudo];
                }
            });
        });
    };
    KudosApiClient.prototype.createPerson = function (mutationVariables) {
        return __awaiter(this, void 0, void 0, function () {
            var input, rawResponse, createPersonResponse, person;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Creating a person with the username ".concat(mutationVariables.input.username));
                        input = __assign(__assign({}, mutationVariables.input), { dataSourceApp: API_1.DataSourceApp.twitter });
                        return [4 /*yield*/, this.graphQLClient.request(mutations_1.createPerson, __assign(__assign({}, mutationVariables), { input: input }))];
                    case 1:
                        rawResponse = _a.sent();
                        this.logger.http(JSON.stringify(rawResponse));
                        createPersonResponse = rawResponse;
                        if (!createPersonResponse) {
                            throw new Error("Expected a CreatePersonMutation response from createPerson");
                        }
                        person = createPersonResponse.createPerson;
                        return [2 /*return*/, person];
                }
            });
        });
    };
    KudosApiClient.prototype.listPeople = function (queryVariables) {
        return __awaiter(this, void 0, void 0, function () {
            var rawResponse, listPersonsResponse, modelPersonConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.graphQLClient.request(queries_1.listPersons, queryVariables)];
                    case 1:
                        rawResponse = _a.sent();
                        this.logger.http(JSON.stringify(rawResponse));
                        listPersonsResponse = rawResponse;
                        if (!listPersonsResponse) {
                            throw new Error("Expected a ListPersonsQuery response from listPersons");
                        }
                        modelPersonConnection = listPersonsResponse.listPersons;
                        return [2 /*return*/, modelPersonConnection];
                }
            });
        });
    };
    KudosApiClient.prototype.getUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var peopleResponse, people, person;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Getting user for username ".concat(username));
                        return [4 /*yield*/, this.listPeople({ filter: { username: { eq: username }, dataSourceApp: { eq: API_1.DataSourceApp.twitter } } })];
                    case 1:
                        peopleResponse = _a.sent();
                        people = peopleResponse.items;
                        this.logger.info("Found ".concat(people.length, " users"));
                        if (people.length === 0) {
                            return [2 /*return*/, null];
                        }
                        // Sort the array to get the newest (just in case there are more than 1)
                        people.sort(function (a, b) { return Date.parse(a.createdAt) - Date.parse(b.createdAt); });
                        person = people[0];
                        return [2 /*return*/, person];
                }
            });
        });
    };
    return KudosApiClient;
}());
exports.KudosApiClient = KudosApiClient;
