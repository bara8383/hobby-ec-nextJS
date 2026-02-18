import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class ChatSseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const conversationsTable = new dynamodb.Table(this, 'ChatConversationsTable', {
      tableName: 'ChatConversations',
      partitionKey: { name: 'conversationId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const messagesTable = new dynamodb.Table(this, 'ChatMessagesTable', {
      tableName: 'ChatMessages',
      partitionKey: { name: 'conversationId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'messageKey', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const userQueueTable = new dynamodb.Table(this, 'ChatUserQueueTable', {
      tableName: 'ChatUserQueue',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const chatApiLambda = new lambda.Function(this, 'ChatApiLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200, body: "chat api" });'),
      handler: 'index.handler',
      timeout: cdk.Duration.minutes(15),
      memorySize: 512,
      environment: {
        CHAT_CONVERSATIONS_TABLE: conversationsTable.tableName,
        CHAT_MESSAGES_TABLE: messagesTable.tableName,
        CHAT_USER_QUEUE_TABLE: userQueueTable.tableName
      }
    });

    const restApi = new apigateway.RestApi(this, 'ChatStreamingApi', {
      restApiName: 'HobbyEcChatStreamingApi',
      deployOptions: { stageName: 'prod' }
    });

    const apiResource = restApi.root.addResource('api').addResource('chat').addResource('stream');
    apiResource.addMethod('GET', new apigateway.LambdaIntegration(chatApiLambda, { proxy: true }));

    chatApiLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Query'],
        resources: [conversationsTable.tableArn, messagesTable.tableArn, userQueueTable.tableArn]
      })
    );

    chatApiLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sqs:CreateQueue', 'sqs:GetQueueUrl', 'sqs:ReceiveMessage', 'sqs:SendMessage', 'sqs:DeleteMessage'],
        resources: ['*']
      })
    );

    new cdk.CfnOutput(this, 'ChatConversationsTableName', { value: conversationsTable.tableName });
    new cdk.CfnOutput(this, 'ChatMessagesTableName', { value: messagesTable.tableName });
    new cdk.CfnOutput(this, 'ChatUserQueueTableName', { value: userQueueTable.tableName });
    new cdk.CfnOutput(this, 'ChatStreamingApiUrl', { value: restApi.url });
  }
}
