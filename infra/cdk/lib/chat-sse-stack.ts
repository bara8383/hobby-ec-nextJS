import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
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
      sortKey: { name: 'sortKey', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const userQueueTable = new dynamodb.Table(this, 'ChatUserQueueTable', {
      tableName: 'ChatUserQueue',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const chatPolicy = new iam.ManagedPolicy(this, 'ChatApiPolicy', {
      managedPolicyName: 'HobbyEcChatApiPolicy',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Query'],
          resources: [conversationsTable.tableArn, messagesTable.tableArn, userQueueTable.tableArn]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'sqs:CreateQueue',
            'sqs:GetQueueUrl',
            'sqs:ReceiveMessage',
            'sqs:SendMessage',
            'sqs:DeleteMessage'
          ],
          resources: ['*']
        })
      ]
    });

    new cdk.CfnOutput(this, 'ChatConversationsTableName', { value: conversationsTable.tableName });
    new cdk.CfnOutput(this, 'ChatMessagesTableName', { value: messagesTable.tableName });
    new cdk.CfnOutput(this, 'ChatUserQueueTableName', { value: userQueueTable.tableName });
    new cdk.CfnOutput(this, 'ChatApiManagedPolicyArn', { value: chatPolicy.managedPolicyArn });
  }
}
