import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class GatewayService implements OnModuleInit, OnModuleDestroy {
  constructor() {}

  async onModuleInit() {
    console.log(`The module has been initialized.`);
    // await this.authClient.connect();
  }
  async onModuleDestroy() {
    console.log(`The module has been initialized.`);
    // await this.authClient.close();
  }
  // async getHello(): Promise<any> {
  //   // const result = await firstValueFrom(this.authClient.send('user.get', ''));
  //   // return result;
  // }
}
