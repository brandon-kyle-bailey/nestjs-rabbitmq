import { ResponseBase } from 'libs/dto/response.base';
import { NotificationIntegrationResponseDto } from '../notification-integration/notification-integration.response.dto';

export class ScheduledTaskIncidentNotificationResponseDto extends ResponseBase {
  statusPrefix: number;
  notify: boolean;
  notificationIntegration: NotificationIntegrationResponseDto;
}
