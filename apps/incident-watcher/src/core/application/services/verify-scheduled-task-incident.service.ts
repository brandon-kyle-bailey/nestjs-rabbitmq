import { OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { VerifyScheduledTaskIncidentCommand } from 'apps/incident-watcher/src/interface/commands/verify-scheduled-task-incident.command';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import { NotificationGenerics } from 'libs/common/enum/notification-generics.enum';
import { NotificationsIntegrationEvents } from 'libs/events/notifications.events';
import { ScheduledTaskIncidentNotificationIntegrationEvents } from 'libs/events/scheduled-task-incident-notification.events';
import { firstValueFrom } from 'rxjs';

@CommandHandler(VerifyScheduledTaskIncidentCommand)
export class VerifyScheduledTaskIncidentService
  implements ICommandHandler, OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportGatewayAdapterService)
    private readonly service: ClientProxy,
    @Inject(TransportAdapterNames.TransportNotificationsAdapterService)
    private readonly notificationsService: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.service.connect();
    await this.notificationsService.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
    await this.notificationsService.close();
  }
  async execute(command: VerifyScheduledTaskIncidentCommand): Promise<void> {
    try {
      this.logger.debug('reached verify sevice');
      // get all notification integration objects where active = true
      // emit event to notifications based on notification integration type. i.e [WEBHOOK, SLACK, etc.]
      const scheduledTaskIncidentNotifications: any[] = await firstValueFrom(
        this.service.send(
          ScheduledTaskIncidentNotificationIntegrationEvents.FindAllByScheduledTaskIdNotifyStatusPrefix,
          {
            scheduledTaskId: command.scheduledTaskId,
            notify: true,
            statusPrefix: Number(command.status.toString().split('')[0]),
          },
        ),
      );
      if (scheduledTaskIncidentNotifications.length < 1) {
        this.logger.debug(
          'No scheduled task incident notification configs found for scheduled task. exiting',
        );
        return;
      }
      const activeIntegrations = scheduledTaskIncidentNotifications
        .filter(
          (scheduledTaskIncidentNotification) =>
            scheduledTaskIncidentNotification.notificationIntegration.active ===
            true,
        )
        .map((scheduledTaskIncidentNotification) => {
          scheduledTaskIncidentNotification.notificationIntegration.owner =
            scheduledTaskIncidentNotification.owner;
          return scheduledTaskIncidentNotification.notificationIntegration;
        });
      if (activeIntegrations.length < 1) {
        this.logger.debug(
          'No notification integrations found for scheduled task. exiting',
        );
        return;
      }
      this.logger.debug(
        `found ${activeIntegrations.length} active notification integrations`,
      );
      activeIntegrations.map((integration) => {
        this.logger.debug(integration);
        let payload = {};
        if (integration.type.toLowerCase() === NotificationGenerics.Email) {
          payload = {
            to: integration.owner.email,
            subject: `Incident alert from Hawkstatus`,
            text: `Incident alert for ${integration.name}`,
          };
        }
        if (integration.type.toLowerCase() === NotificationGenerics.Webhook) {
          payload = {
            name: integration.name,
            token: integration.token,
            url: integration.url,
          };
        }
        this.notificationsService
          .emit(
            `${
              NotificationsIntegrationEvents.SendPrefix
            }.${integration.type.toLowerCase()}`,
            payload,
          )
          .subscribe();
      });
    } catch (error) {
      this.logger.error(
        'VerifyScheduledTaskIncidentService.execute encountered an error',
        error,
      );
    }
  }
}
