#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ChatSseStack } from '../lib/chat-sse-stack';

const app = new cdk.App();

new ChatSseStack(app, 'HobbyEcChatSseStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1'
  }
});
