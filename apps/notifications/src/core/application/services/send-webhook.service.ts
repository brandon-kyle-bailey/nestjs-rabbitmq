import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendWebhookCommand } from 'apps/notifications/src/interface/commands/send-webhook.command';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@CommandHandler(SendWebhookCommand)
export class SendWebhookService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    protected readonly httpService: HttpService,
  ) {}

  async execute(command: SendWebhookCommand): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .post(command.url, {
            username: 'Hawkstatus',
            avatar_url: 'https://i.imgur.com/4M34hi2.png',
            content: command.name,
            embeds: [
              {
                author: {
                  name: 'Birdie♫',
                  url: 'https://www.reddit.com/r/cats/',
                  icon_url: 'https://i.imgur.com/R66g1Pe.jpg',
                },
                title: 'Title',
                url: 'https://google.com/',
                description:
                  'Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`',
                color: 15258703,
                fields: [
                  {
                    name: 'Text',
                    value: 'More text',
                    inline: true,
                  },
                  {
                    name: 'Even more text',
                    value: 'Yup',
                    inline: true,
                  },
                  {
                    name: 'Use `"inline": true` parameter, if you want to display fields in the same line.',
                    value: 'okay...',
                  },
                  {
                    name: 'Thanks!',
                    value: "You're welcome :wink:",
                  },
                ],
                thumbnail: {
                  url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
                },
                image: {
                  url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg',
                },
                footer: {
                  text: 'Woah! So cool! :smirk:',
                  icon_url: 'https://i.imgur.com/fKL31aD.jpg',
                },
              },
            ],
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw error.response.status;
            }),
          ),
      );
    } catch (error) {
      this.logger.error('SendWebhookService encountered an error', error);
    }
  }
}
