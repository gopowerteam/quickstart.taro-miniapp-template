import { env } from "@tarojs/taro";

export const appConfig = {
  server: process.env.server as string,
  agentId: process.env.agentId as string
}
