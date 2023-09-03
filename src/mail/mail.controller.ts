import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly emailService: MailService) {}

  @Post('reset-link')
  async sendResetLink(
    @Body() emailData: { to: string; link: string },
  ): Promise<void> {
    const { to, link } = emailData;
    await this.emailService.sendResetLink(to, link);
  }
}
